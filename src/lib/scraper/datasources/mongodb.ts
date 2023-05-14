import type { Datasource, GetRowsCallback, PostRowCallback, Table } from "../lib/datasource";
import type { JobInfo } from "../lib/platform";
import { Schema, model, connect } from "mongoose";
import { datasource as argDatasource } from "../lib/arguments";
import { log } from "../lib/io";
import { mean, standardDeviation } from "../lib/helpers";
import type { History } from '$lib/scraper/lib/datasource';


const HistorySchema = new Schema<History>({
  date_iso: String,
  value: String,
  type: ['role', 'parameters']
});

const JobInfoSchema = new Schema<JobInfo>({
  title: String,
  subtitle: String,
  tags: [String],
  technologies: [String],
  url: String,
  company: String,
  location: String,
  salary: String,
  experience: String,
  requirements: [String],
});

const JobInfoModel = model<JobInfo>("job-info", JobInfoSchema);
const HistoryModel = model<History>("history", HistorySchema);

const jobInfoPostRow: PostRowCallback<JobInfo> = (row) => {
  log("info", "jobInfoPostRow", `Posting row to table JobInfo...`);
  const newJobInfo = new JobInfoModel(row);
  log(
    "debug",
    "jobInfoPostRow",
    `Row posted to table JobInfo: ${JSON.stringify(newJobInfo)}`
  );
  newJobInfo.save();
};

const jobInfoGetRows: GetRowsCallback<JobInfo> = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _filter = (job) => job
) => {
  const documents = await JobInfoModel.find();
  const words = documents
    .filter(
      (document, index, array) =>
        array.findIndex((_document) => document.url === _document.url) === index
    )
    .map((document) => document.technologies as string[])
    .reduce((acc, val) => {
      val.forEach((word) => {
        if (acc.has(word)) {
          acc.set(word, (acc.get(word) ?? 0) + 1);
        } else {
          acc.set(word, 1);
        }
      });
      return acc;
    }, new Map<string, number>());
  
  const salaries = documents
    .filter(
      (document, index, array) =>
        array.findIndex((_document) => document.url === _document.url) === index
    )
    .map((document) => document.salary as string | null);

  const processedSalaries = salaries.map((salary) =>
    parseInt((salary ?? '0').replace("$ ", "").replace(" (Mensual)", "")
    .replace(/\./g, '').replace(',00', ''))
  ).filter((salary) => salary > 0);

  console.log(processedSalaries)
  console.log('StdDev: ', standardDeviation(processedSalaries));
  console.log('Mean: ', mean(processedSalaries));
  console.log(JSON.stringify(Object.fromEntries(words)));
  return documents;
};

const jobInfoTable: Table<JobInfo> = {
  created: false,
  create: async () => {
    if (jobInfoTable.created) return;
    await connect(argDatasource);
    await JobInfoModel.createCollection();
    jobInfoTable.created = true;
  },
  postRow: jobInfoPostRow,
  getRows: jobInfoGetRows,
};

const historyTable: Table<History> = {
  created: false,
  create: async () => {
    if (historyTable.created) return;
    await connect(argDatasource);
    await JobInfoModel.createCollection();
    jobInfoTable.created = true;
  },
  postRow: async (row: History) => {
    const newHistory = new HistoryModel(row);
    await newHistory.save();
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getRows: async (_filter) => {
    return await HistoryModel.find();
  }
}

const datasource: Datasource = {
  name: "mongodb",
  tables: {
    JobInfo: jobInfoTable,
    History: historyTable
  }
};

console.log(datasource)

export default datasource;
