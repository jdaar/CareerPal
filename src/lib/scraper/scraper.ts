import * as puppeteer from 'puppeteer';
import type { TJobInfo, Platform, TJobScraperParameters } from './lib/platform';
import { log } from './lib/io';

import Computrabajo from './platforms/computrabajo';
import type { Datasource } from './lib/datasource';
import { GenerateGuid } from './lib/helpers';

export type TJobScraperStatus = 'queued' | 'running' | 'finished';
export type TJobScraperResponseStatus = 'none' | 'success' | 'error';

/**
 * Metadata for needed for JobScraper to be added in the queue (generated)
 * @since 1.1.0
 */
export type TJobScraperWithMetadata = {
	id: string;
	scraper: JobScraper;
	status: TJobScraperStatus;
	response_status: TJobScraperResponseStatus;
};

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
	};
	return jobScraperMetadata;
}

/**
 * Execution parameters for JobScraperQueue
 * @since 1.1.0
 */
export type TJobScraperQueueParameters = {
	batch_size: number;
	connection_string: string;
};

/**
 * Creates a new error with template
 * @param message Message to be appended
 * @returns Error instance with templated applied
 * @since 1.1.0
 */
function newScrapingError(message: string, error?: Error) {
	return new Error(
		`An error ocurred while scraping the data (JobScraper): ${message}\n${error?.message}`
	);
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
	public queue: TJobScraperWithMetadata[] = [];
	public InstancedQueue: TJobScraperWithMetadata[] = [];
	private parameters: TJobScraperQueueParameters;
	private empty = true;
	public Datasource: Datasource | null = null;

	private static instance: JobScraperQueue | null = null;

	public static GetInstance(
		parameters: TJobScraperQueueParameters,
		datasource: Datasource
	): JobScraperQueue {
		if (JobScraperQueue.instance === null) {
			JobScraperQueue.instance = new JobScraperQueue(parameters, datasource);
		}
		return JobScraperQueue.instance;
	}

	constructor(parameters: TJobScraperQueueParameters, datasource: Datasource) {
		this.parameters = parameters;
		this.Datasource = datasource;
	}

	public SetDatasource(datasource: Datasource) {
		this.Datasource = datasource;
	}

	/**
	 * Add scraper to queue
	 * @param scraper Scraper to add
	 * @since 1.1.0
	 */
	public Add(scraper: JobScraper) {
		this.queue.push(WrapJobScraperWithMetadata(scraper));
		this.empty = false;
	}

	/**
	 * Execute a batch by batch_size parameter
	 * @since 1.1.0
	 */
	public async ExecuteBatch() {
		console.log(this);
		if (this.empty) throw newScrapingError('Queue should not be empty');

		for (let i = 0; i < this.parameters.batch_size; i++) {
			try {
				await this.executeHead();
			} catch (error) {
				throw newScrapingError('Head execution failed', error as Error);
			}
		}
	}

	/**
	 * Execute queue head and drop
	 * @since 1.1.0
	 */
	private async executeHead() {
		if (!this.Datasource) return;

		const id = this.queue[0].id;

		await this.queue[0].scraper.SetDatasource(this.Datasource);
		this.queue[0].scraper.RegisterPlatform(Computrabajo);
		this.queue[0].scraper.RegisterExecutionCallback(() => this.RegisterExecution(id));

		try {
			await this.queue[0].scraper.Init();
			this.queue[0].status = 'running';
			this.InstancedQueue.push(this.queue[0]);
			this.queue.shift();
		} catch (error) {
			throw newScrapingError('Scraper execution failed', error as Error);
		}
		this.empty = false;
	}

	/**
	 * Acts as a callback for execution ack
	 * @param id JobScraper id (generated)
	 */
	public RegisterExecution(id: string) {
		if (this.empty) throw newScrapingError('Queue should be empty');

		console.log(`Job with id: ${id} ended`);

		this.InstancedQueue.reduce<TJobScraperWithMetadata[]>((acc, value) => {
			if (value.id == id) {
				value.status = 'finished';
			}
			acc.push(value);
			return acc;
		}, []);
		if (this.InstancedQueue.find((value) => value.status == 'running') == undefined) {
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
	private platforms: Platform[] = [];
	private browser: puppeteer.Browser | null;
	private jobsLinks: Map<string, string[]>;
	private jobsInfo: Map<string, TJobInfo[]>;
	private executionCallback: () => void;
	public Parameters: TJobScraperParameters;
	public datasource: Datasource | null = null;

	constructor(parameters: TJobScraperParameters) {
		this.browser = null;
		this.jobsLinks = new Map();
		this.jobsInfo = new Map();
		this.executionCallback = () => {
			return;
		};

		this.Parameters = parameters;
	}

	public async Init() {
		this.browser = await puppeteer.launch({
			//executablePath: "/usr/bin/chromium",
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
			headless: true
		});
		this.run();
	}

	public RegisterPlatform(platform: Platform) {
		this.platforms.push(platform);
	}

	public RegisterExecutionCallback(exec_cb: () => void) {
		this.executionCallback = exec_cb;
	}

	private async getJobLinks() {
		for (const platform of this.platforms) {
			if (!this.browser) {
				throw new Error('Browser not found.');
			}

			const page = await this.browser.newPage();

			try {
				const jobLinks = await platform.getJobLinks({
					data: platform.getUrl(this.Parameters.role),
					page,
					parameters: this.Parameters
				});
				this.jobsLinks.set(platform.name, jobLinks);
			} catch (error) {
				throw newScrapingError("Couldn't retrieve job links", error as Error);
			}

			await page.close();
		}
	}

	private async getJobInfo() {
		for (const _platform of Array.from(this.jobsLinks.keys())) {
			const jobsLinks = this.jobsLinks.get(_platform);

			if (!this.browser) {
				throw new Error('Browser not found.');
			}
			if (!jobsLinks) {
				throw new Error('Jobs links not found.');
			}

			const platform = this.platforms.find((p) => p.name === _platform);
			const page = await this.browser.newPage();

			if (!platform) {
				throw new Error(`Platform ${_platform} not found.`);
			}

			const jobsInfo: TJobInfo[] = [];
			for (const jobLink of jobsLinks) {
				try {
					const jobInfo = await platform.getJobInfo({
						data: jobLink,
						page,
						parameters: this.Parameters
					});
					this.postJobInfo(jobInfo);
					jobsInfo.push(jobInfo);
				} catch (error) {
					console.error(
						newScrapingError(`Couldn't retrieve job info for job ${jobLink}`, error as Error)
					);
					continue;
				}
			}

			this.jobsInfo.set(platform.name, jobsInfo);
			await page.close();
		}
	}

	public async SetDatasource(datasource: Datasource) {
		this.datasource = datasource;
	}

	private async postJobInfo(jobInfo: TJobInfo) {
		if (this.datasource?.Tables.JobInfo.Created) {
			log('debug', 'writeJobInfo', 'Inserting job info into database...');
			try {
				await this.datasource?.Tables.JobInfo.PostRow(jobInfo);
			} catch (error) {
				throw newScrapingError("Couldn't post JobInfo row", error as Error);
			}
		}
	}

	private async run() {
		if (!this.browser) {
			throw newScrapingError('Browser not initialized.');
		}
		await this.getJobLinks();
		await this.getJobInfo();
		await this.executionCallback();
		await this.browser.close();
	}
}

/*
async function main() {
  JobScraper.RegisterPlatform(Computrabajo);
  new JobScraper();
}

main();
*/
