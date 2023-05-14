import type {
  GetJobInfoCallback,
  GetJobLinksCallback,
  TJobInfo,
  Platform,
} from "../lib/platform";
import { pages } from "../lib/arguments";
import { log } from "../lib/io";
import {
  getListItemsByXPath,
  getMultipleTextByXPath,
  getTextByXPath,
  sleep,
} from "../lib/helpers";
import { getTechnologies } from "../lib/search";

const WAIT_TIME = 0;

export const getJobLinks: GetJobLinksCallback = async (urlPP) => {
  log("info", "getJobLinks", `Getting job links for role...`);
  let jobs: string[] = [];
  for (let i = 0; i < pages; i++) {
    log("debug", "getJobLinks", `Getting job links for page ${i + 1}...`);
    await urlPP.page.goto(urlPP.data + `?p=${i + 1}`);
    const jobLinks: string[] = await urlPP.page.evaluate(() => {
      const links: string[] = [];
      document
        .querySelectorAll(
          'a[href^="/ofertas-de-trabajo/oferta-de-trabajo-de-"]'
        )
        .forEach((link) => {
          links.push((link as HTMLAnchorElement).href);
        });
      return links;
    });
    log(
      "debug",
      "getJobLinks",
      `Found ${jobLinks.length} job links for page ${i + 1}.`
    );
    jobs = jobs.concat(jobLinks);
    log("debug", "getJobLinks", `Found ${jobs.length} job links for role.`);
    await sleep(WAIT_TIME);
  }
  return jobs;
};

export const getJobInfo: GetJobInfoCallback = async (urlPP) => {
  await urlPP.page.goto(urlPP.data);
  log("info", "main", `Getting info for job ${urlPP.data}...`);

  const jobInfo: TJobInfo = {
    title: await getTextByXPath(urlPP.page, "/html/body/main/div[1]/h1"),
    subtitle: await getTextByXPath(urlPP.page, "/html/body/main/div[1]/p"),
    tags: await getMultipleTextByXPath(
      urlPP.page,
      "/html/body/main/div[2]/div/div[2]/div[2]/div[1]/span"
    ),
    requirements: await getListItemsByXPath(
      urlPP.page,
      "/html/body/main/div[2]/div/div[2]/div[2]/ul"
    ),
    company: (await getTextByXPath(urlPP.page, "/html/body/main/div[1]/p"))
      .split("-")[0]
      .trim(),
    location: (await getTextByXPath(urlPP.page, "/html/body/main/div[1]/p"))
      .split("-")[1]
      .trim(),
    salary: (
      await getMultipleTextByXPath(
        urlPP.page,
        "/html/body/main/div[2]/div/div[2]/div[2]/div[1]/span"
      )
    ).filter((tag) => tag.includes("$"))[0],
    experience: (
      await getListItemsByXPath(
        urlPP.page,
        "/html/body/main/div[2]/div/div[2]/div[2]/ul"
      )
    ).filter((tag) => tag.includes("experiencia"))[0],
    technologies: await getTechnologies(
      await getTextByXPath(
        urlPP.page,
        "/html/body/main/div[2]/div/div[2]/div[2]/p[1]"
      )
    ),
    url: urlPP.data,
  };

  await sleep(WAIT_TIME);
  return jobInfo;
};

const platform: Platform = {
  name: "computrabajo",
  getUrl: (role: string) =>
    `https://co.computrabajo.com/trabajo-de-${role}-en-medellin`,
  getJobLinks,
  getJobInfo,
};

export default platform;
