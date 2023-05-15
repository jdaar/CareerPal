import type { Page } from "puppeteer";
import { log } from "./io";

/**
 * Helper function to sleep for a given number of milliseconds.
 * @param ms The number of milliseconds to wait.
 * @example
 * await sleep(5000)
 * @since 1.0.0
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates a guid
 * @since 1.1.0
 * @see http://slavik.meltser.info/the-efficient-way-to-create-guid-uuid-in-javascript-with-explanation/
 */
export function GenerateGuid() {  
   function _p8(s: boolean) {  
      const p = (Math.random().toString(16)+"000000000").substring(2,8);  
      return s ? "-" + p.substring(0,4) + "-" + p.substring(4,4) : p ;  
   }  
   return _p8(false) + _p8(true) + _p8(false) + _p8(true);  
}  

/**
 * Get the text for the first element that matches a given xpath.
 * @param page - The page to use.
 * @param url - The url to navigate to.
 * @param xpath - The xpath to use.
 * @returns The text for the first element that matches the given xpath.
 * @example
 * const text = await getTextByXPath(page, 'https://example.com', '//div[@id="text"]')
 * console.log(text) // 'text'
 * @since 1.0.0
 */
export async function getTextByXPath(
  page: Page,
  xpath: string
): Promise<string> {
  log("info", "getTextByXPath", `Getting text for xpath ${xpath}...`);
  const element = await page.$x(xpath);
  if (element.length === 0) {
    throw new Error(`Element for xpath ${xpath} not found.`);
  }
  const text = await element[0].getProperty("textContent");
  log("debug", "getTextByXPath", `Found text ${text} for xpath ${xpath}.`);

  const returnValue = await text.jsonValue();
  if (returnValue === null)
    throw new Error(`Text for xpath ${xpath} is undefined.`);

  return returnValue;
}

/**
 * Get the text for all elements that match a given xpath.
 * @param page - The page to use.
 * @param url - The url to navigate to.
 * @param xpath - The xpath to use.
 * @returns The text for all elements that match the given xpath.
 * @example
 * const texts = await getMultipleTextByXPath(page, 'https://example.com', '//div[@id="text"]')
 * console.log(texts) // ['text1', 'text2']
 * @since 1.0.0
 */
export async function getMultipleTextByXPath(
  page: Page,
  xpath: string
): Promise<string[]> {
  log("info", "getMultipleTextByXPath", `Getting text for xpath ${xpath}...`);
  const elements = await page.$x(xpath);
  if (elements.length === 0) {
    throw new Error(`Element for xpath ${xpath} not found.`);
  }
  log(
    "debug",
    "getMultipleTextByXPath",
    `Found ${elements.length} elements for xpath ${xpath}.`
  );
  const texts = await Promise.all(
    elements.map(async (element: any) => {
      const text = await element.getProperty("textContent");
      return text.jsonValue() as Promise<string>;
    })
  );
  if (texts === null || texts === undefined || texts.length === 0) {
    throw new Error(`Text for xpath ${xpath} is undefined.`);
  }
  log(
    "debug",
    "getMultipleTextByXPath",
    `Found texts ${texts} for xpath ${xpath}.`
  );
  return texts;
}

/**
 * Get the list items for a given xpath.
 * @param page - The page to use.
 * @param url - The url to navigate to.
 * @param xpath - The xpath to use.
 * @returns The list items or null if the xpath is not found.
 * @example
 * const items = await getListItemsByXPath(page, 'https://example.com', '//ul[@id="list"]')
 * console.log(items) // ['item1', 'item2', 'item3']
 * @since 1.0.0
 */
export async function getListItemsByXPath(
  page: Page,
  xpath: string
): Promise<string[]> {
  log(
    "info",
    "getListItemsByXPath",
    `Getting list items for xpath ${xpath}...`
  );
  const element = await page.$x(xpath);
  if (element.length === 0) {
    throw new Error(`Element for xpath ${xpath} not found.`);
  }
  const items = await element[0].$$eval("li", (nodes: any) =>
    nodes.map((node: any) => node.textContent?.trim() ?? "")
  );
  if (items === null || items === undefined || items.length === 0) {
    throw new Error(`List items for xpath ${xpath} is undefined.`);
  }
  log(
    "debug",
    "getListItemsByXPath",
    `Found items ${items} for xpath ${xpath}.`
  );
  return items;
}

/**
 * Gets the standard deviation of an array of numbers.
 * @param arr Array of numbers
 * @param usePopulation Wheter to use population or sample standard deviation
 * @returns The standard deviation of the given array
 * @see https://decipher.dev/30-seconds-of-typescript/docs/standardDeviation/
 * @since 1.0.1
 */
export function standardDeviation(arr: number[], usePopulation = false) {
  const _mean = mean(arr)
  return Math.sqrt(
    arr
      .reduce((acc: number[], val) => acc.concat((val - _mean) ** 2), [])
      .reduce((acc, val) => acc + val, 0) /
      (arr.length - (usePopulation ? 0 : 1))
  );
}
 
/**
 * Gets the mean of an array of numbers.
 * @param arr Array of numbers
 * @returns The mean of the given array
 * @since 1.0.1 
 */
export function mean(arr: number[]) {return arr.reduce((acc, val) => acc + val, 0) / arr.length;}