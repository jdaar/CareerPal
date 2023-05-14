import * as fs from "fs/promises";
import { dirname } from "path";
import { verbose } from "./arguments";

/**
 * Gets an array of objects and writes them to a csv file.
 * @param objects The array of objects to write to the csv file.
 * @param filePath The path to the output csv file.
 * @example
 * objectsToCsv([{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }], './out.csv')
 * @since 1.0.0
 */
export async function objectsToCsv(
  objects: Record<string, string | string[]>[],
  filePath: string
): Promise<void> {
  log(
    "info",
    "objectsToCsv",
    `Writing ${objects.length} objects to ${filePath}...`
  );
  const csvHeaders = Object.keys(objects[0]).join(",") + "\n";
  const csvRows = objects
    .map(
      (object) =>
        Object.values(object)
          .map((v: string[] | string) =>
            Array.isArray(v)
              ? v.map((_v) => _v.replace(",", ";")).join(";")
              : v !== undefined
              ? v.replace(",", ";")
              : ""
          )
          .join(",") + "\n"
    )
    .join("");
  const csvData = csvHeaders + csvRows;

  try {
    await fs.mkdir(dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, csvData, "utf8");
  } catch (error) {
    log(
      "error",
      "objectsToCsv",
      `Error writing ${objects.length} objects to ${filePath}: ${
        (error as Error).message
      }`
    );
    throw error;
  }
  log(
    "info",
    "objectsToCsv",
    `Done writing ${objects.length} objects to ${filePath}.`
  );
}

/**
 * Logs a message to the console.
 * @param level The log level.
 * @param functionName The name of the function that is logging.
 * @param message The message to log.
 * @example
 * log('info', 'getJobLinks', 'Getting job links for role ingeniero de software...')
 * @since 1.0.0
 */
export function log(
  level: "debug" | "info" | "warn" | "error",
  functionName: string,
  message: string
): void {
  const colors = {
    debug: "\x1b[34m", // blue
    info: "\x1b[32m", // green
    warn: "\x1b[33m", // yellow
    error: "\x1b[31m", // red
    reset: "\x1b[0m", // reset
  };

  const logPrefix = `${new Date().toISOString()} ${
    colors[level]
  }[${level.toUpperCase()}]${colors.reset} ${colors.debug}[${functionName}]${
    colors.reset
  }`;

  switch (level) {
    case "debug":
      if (!verbose) {
        return;
      }
      console.debug(`${logPrefix} ${message}`);
      break;
    case "info":
      console.info(`${logPrefix} ${message}`);
      break;
    case "warn":
      console.warn(`${logPrefix} ${message}`);
      break;
    case "error":
      console.error(`${logPrefix} ${message}`);
      break;
    default:
      throw new Error(`Invalid log level: ${level}`);
  }
}
