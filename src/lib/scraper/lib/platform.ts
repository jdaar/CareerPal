import type { Page } from "puppeteer";

export type JobLink = string;

export type JobInfo = {
  title: string;
  subtitle: string;
  tags: string[];
  requirements: string[];
  company: string;
  location: string;
  salary: string;
  experience: string;
  technologies: (string | null)[];
  url: string;
};

export type Parameters = {
  role: string,
  pages: number,
  verbose: boolean,
  datasource: string,
}

export type WithPageAndParameters<T> = {
  data: T,
  page: Page,
  parameters: Parameters
}

/**
 * Gets the url for a given role within a given platform.
 * @param role The role to search for.
 * @example
   const queryUrl = Platform.getUrl('ingeniero de software')
   console.log(queryUrl) // https://www.platform.com/jobs/?q=ingeniero+de+software
 */
export type GetUrlCallback = (role: string) => string;

/**
 * Gets the job links for a given role, taking into account the number of pages indicated in the execution argument.
 * @param page The page to use.
 * @param url The url to navigate to.
 * @example
 * const queryUrl = Platform.getUrl('ingeniero de software')
 * const jobLinks = Platform.getJobLinks(page, queryUrl)
 * console.log(jobLinks) // ['https://www.platform.com/job/...', 'https://www.platform.com/job/...']
 * @returns An array of job links.
 * @since 1.0.0
 */
export type GetJobLinksCallback = (
  urlWithPageAndParameters: WithPageAndParameters<string>
) => Promise<JobLink[]>;

/**
 * Gets the job info for a given job link.
 * @param page The page to use.
 * @param url The url to navigate to.
 * @example
 * const queryUrl = Platform.getUrl('ingeniero de software')
 * const jobLinks = Platform.getJobLinks(page, queryUrl)
 * const jobInfo = await getJobInfo(page, jobLinks[0])
 * console.log(jobInfo) // { title: 'Ingeniero de software', ... }
 * @returns An object with the job info.
 * @since 1.0.0
 */
export type GetJobInfoCallback = (
  urlWithPageAndParameters: WithPageAndParameters<string>
) => Promise<JobInfo>;

export type Platform = {
  name: string;
  getUrl: GetUrlCallback;
  getJobLinks: GetJobLinksCallback;
  getJobInfo: GetJobInfoCallback;
};
