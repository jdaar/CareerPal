import * as puppeteer from "puppeteer";
import type { TJobInfo, Platform, TJobScraperParameters } from "./lib/platform";
import { datasource, role } from "./lib/arguments";
import { log } from "./lib/io";

import MongoDb from "./datasources/mongodb";
import type { Datasource } from "./lib/datasource";
import { GenerateGuid } from "./lib/helpers";

export type TJobScraperStatus = 'queued' | 'running' | 'finished'
export type TJobScraperResponseStatus = 'none' | 'success' | 'error'

/**
 * Metadata for needed for JobScraper to be added in the queue (generated)
 * @since 1.1.0
 */
export type TJobScraperWithMetadata = {
  id: string
  scraper: JobScraper
  status: TJobScraperStatus,
  response_status: TJobScraperResponseStatus,
}

/**
 * Wraps scraper with required queue metadata
 * @param scraper JobScraper to be wraped
 * @returns JobScraper with metadata
 * @since 1.1.0
 */
export function WrapJobScraperWithMetadata(scraper: JobScraper) {
  const jobScraperMetadata: TJobScraperWithMetadata = {
    id: GenerateGuid(),
    scraper,
    status: 'queued',
    response_status: 'none'
  }
  return jobScraperMetadata;
}

/**
 * Execution parameters for JobScraperQueue
 * @since 1.1.0
 */
export type TJobScraperQueueParameters = {
  batch_size: number,
  connection_string: string
}

/**
 * Creates a new error with template
 * @param message Message to be appended
 * @returns Error instance with templated applied
 * @since 1.1.0
 */
function newScrapingError(message: string) {
  return new Error(`An error ocurred while scraping the data (JobScraper): ${message}`);
}

/**
 * A JobScraper execution queue
 * @example
 * let queue = new JobScraperQueue({
 *  ...params
 * })
 * await queue.Add(new JobScraper({...jobScrapperParams}));
 * await queue.ExecuteBatch();
 * @since 1.1.0
 */
export class JobScraperQueue {
  private queue: TJobScraperWithMetadata[] = [];
  private parameters: TJobScraperQueueParameters
  private empty = true;

  private static instance: JobScraperQueue | null = null

  public static GetInstance(): JobScraperQueue {
    if (JobScraperQueue.instance === null) {
      JobScraperQueue.instance = new JobScraperQueue({
        batch_size: 1,
        connection_string: 'mongodb://localhost:27017/job-search'
      })
    }
    return JobScraperQueue.instance;
  }
  
  constructor(parameters: TJobScraperQueueParameters) {
    this.parameters = parameters;
  }

  /**
   * Add scraper to queue
   * @param scraper Scraper to add
   * @since 1.1.0
   */
  public async Add(scraper: JobScraper) {
    await scraper.SetDatasource(this.parameters.connection_string);
    this.queue.push(WrapJobScraperWithMetadata(scraper));
  }

  /**
   * Execute a batch by batch_size parameter
   * @since 1.1.0
   */
  public async ExecuteBatch() {
    if (!this.empty) throw newScrapingError("Queue should not be empty")
    
    for (let i = 0; i < this.parameters.batch_size; i++) {
      await this.executeHead();
    }
  }

  /**
   * Execute queue head and drop 
   * @since 1.1.0
   */
  private async executeHead() {
    await this.queue[0].scraper.Init();
    this.empty = false;
  }

  /**
   * Acts as a callback for execution ack
   * @param id JobScraper id (generated)
   */
  public RegisterExecution(id: string) {
    if (this.empty) throw newScrapingError("Queue should be empty")

    this.queue.reduce<TJobScraperWithMetadata[]>((acc, value) => {
      if (value.id == id) {
        value.status = 'finished';
      }
      acc.push(value);
      return acc;
    }, [])
    if (this.queue.find((value) => value.status == 'running') == undefined) {
      this.empty = true;
    }
  }
}


/**
 * This class encapsulates all operations related to scraping jobs
 * @example
 * let jobScraper = new JobScraper({
 *  ...params
 * })
 * jobScraper.Init();
 * @since 1.0.0
 */
export class JobScraper {
  private static platforms: Platform[] = [];
  private browser: puppeteer.Browser | null;
  private jobsLinks: Map<string, string[]>;
  private jobsInfo: Map<string, TJobInfo[]>;
  private executionCallback: () => void;
  private parameters: TJobScraperParameters;
  private datasource: Datasource | null = null; 

  constructor(parameters: TJobScraperParameters) {
    this.browser = null;
    this.jobsLinks = new Map();
    this.jobsInfo = new Map();
    this.executionCallback = () => {return};

    this.parameters = parameters;
  }

  public async Init() {
    this.browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: false,
    });
    this.run();
  }

  public static RegisterPlatform(platform: Platform) {
    JobScraper.platforms.push(platform);
  }

  public RegisterExecutionCallback(exec_cb: () => void) {
    this.executionCallback = exec_cb;
  }

  private async getJobLinks() {
    for (const platform of JobScraper.platforms) {
      if (!this.browser) {
        throw new Error("Browser not found.");
      }

      const page = await this.browser.newPage();

      const jobLinks = await platform.getJobLinks({
        data: platform.getUrl(role),
        page, 
        parameters: this.parameters
      });

      this.jobsLinks.set(platform.name, jobLinks);

      await page.close();
    }
  }

  private async getJobInfo() {
    for (const _platform of Array.from(this.jobsLinks.keys())) {
      const jobsLinks = this.jobsLinks.get(_platform);

      if (!this.browser) {
        throw new Error("Browser not found.");
      }
      if (!jobsLinks) {
        throw new Error("Jobs links not found.");
      }

      const platform = JobScraper.platforms.find((p) => p.name === _platform);
      const page = await this.browser.newPage();

      if (!platform) {
        throw new Error(`Platform ${_platform} not found.`);
      }

      const jobsInfo: TJobInfo[] = [];
      for (const jobLink of jobsLinks) {
        const jobInfo = await platform.getJobInfo({
          data: jobLink,
          page, 
          parameters: this.parameters
        });
        this.postJobInfo(jobInfo);
        jobsInfo.push(jobInfo);
      }

      this.jobsInfo.set(platform.name, jobsInfo);
      await page.close();
    }
  }

  public async SetDatasource(conn_str: string) {
    const mongoDbRegex = new RegExp(/^mongodb:\/\/(?:(?:(\w+)?:(\w+)?@)|:?@?)((?:[\w.-])+)(?::(\d+))?(?:\/([\w-]+))?(?:\?([\w-]+=[\w-]+(?:&[\w-]+=[\w-]+)*)?)?$/);
    if (mongoDbRegex.test(this.parameters.connection_string)) {
      this.parameters.connection_string = conn_str;
      this.datasource = MongoDb;
    }
    if (!datasource) {
      throw new Error("Datasource not supported");
    }
    await this.datasource?.connect(this.parameters.connection_string);
    await this.datasource?.ensureCreated();
  }

  private async postJobInfo(jobInfo: TJobInfo) {
    if (this.datasource?.tables.JobInfo.created) {
      log("debug", "writeJobInfo", "Inserting job info into database...");
      await this.datasource?.tables.JobInfo.postRow(jobInfo);
    }
    this.datasource?.tables.JobInfo.getRows((job) => job);
  }

  private async run() {
    if (!this.browser) {
      throw new Error("Browser not initialized.");
    }
    await this.getJobLinks();
    await this.getJobInfo();
    await this.browser.close();
    await this.executionCallback();
  }
}

/*
async function main() {
  JobScraper.RegisterPlatform(Computrabajo);
  new JobScraper();
}

main();
*/