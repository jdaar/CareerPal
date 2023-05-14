import * as puppeteer from "puppeteer";
import type { JobInfo, Platform } from "./lib/platform";
import { datasource, role } from "./lib/arguments";
import { log } from "./lib/io";

import Computrabajo from "./platforms/computrabajo";
import MongoDb from "./datasources/mongodb";
import type { Datasource } from "./lib/datasource";

/**
 * Main function, entry point of the script. It will:
 * - Launch a browser
 * - Get the job links
 * - Get the job info
 * - Write the job info to a CSV file
 * - Close the browser
 * @example
 * main()
 * @since 1.0.0
 */
export class JobScraper {
  private static platforms: Platform[] = [];
  private browser: puppeteer.Browser | null;
  private jobsLinks: Map<string, string[]>;
  private jobsInfo: Map<string, JobInfo[]>;

  constructor() {
    this.browser = null;
    this.jobsLinks = new Map();
    this.jobsInfo = new Map();

    this.init();
  }

  private async init() {
    this.browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
    this.run();
  }

  public static registerPlatform(platform: Platform) {
    JobScraper.platforms.push(platform);
  }

  private async getJobLinks() {
    for (const platform of JobScraper.platforms) {
      if (!this.browser) {
        throw new Error("Browser not found.");
      }

      const page = await this.browser.newPage();

      const jobLinks = await platform.getJobLinks(page!, platform.getUrl(role));

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

      const jobsInfo: JobInfo[] = [];
      for (const jobLink of jobsLinks) {
        const jobInfo = await platform.getJobInfo(page, jobLink);
        this.postJobInfo(jobInfo);
        jobsInfo.push(jobInfo);
      }

      this.jobsInfo.set(platform.name, jobsInfo);
      await page.close();
    }
  }

  private async postJobInfo(jobInfo: JobInfo) {
    let db: Datasource | null = null;
    if (datasource.startsWith("mongodb://")) {
      db = MongoDb;
    }
    if (!db) {
      throw new Error("Datasource not supported");
    }

    if (!db?.tables.jobInfoTable.is_created) {
      await db.tables.jobInfoTable.create();
    }
    if (db?.tables.jobInfoTable.is_created) {
      log("debug", "writeJobInfo", "Inserting job info into database...");
      await db?.tables.jobInfoTable.postRow(jobInfo);
    }
    db?.tables.jobInfoTable.getRows((job) => job);
  }

  private async run() {
    if (!this.browser) {
      throw new Error("Browser not initialized.");
    }
    await this.getJobLinks();
    await this.getJobInfo();
    await this.browser.close();
  }
}

async function main() {
  JobScraper.registerPlatform(Computrabajo);
  new JobScraper();
}

main();
