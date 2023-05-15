import type { Datasource, Table } from "../lib/datasource";
import type { TJobInfo } from "../lib/platform";
import { Schema, model, connect } from "mongoose";
import { log } from "../lib/io";
import { mean, standardDeviation } from "../lib/helpers";

const JobInfoSchema = new Schema<TJobInfo>({
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

const JobInfoModel = model<TJobInfo>("job-info", JobInfoSchema);

const jobInfoTable: Table<TJobInfo> = {
  created: false,
  create: async () => {
    if (jobInfoTable.created) return;
    await JobInfoModel.createCollection();
    jobInfoTable.created = true;
  },
  postRow: async (row) => {
    log("info", "jobInfoPostRow", `Posting row to table JobInfo...`);
    const newJobInfo = new JobInfoModel(row);
    log(
      "debug",
      "jobInfoPostRow",
      `Row posted to table JobInfo: ${JSON.stringify(newJobInfo)}`
    );
    await newJobInfo.save();
  },
  getRows: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _filter = (job) => true 
  ) => {
    const documents = await JobInfoModel.find();
    console.log(documents)
    /*
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
    */
    return documents;
  }
};

const datasource: Datasource = {
  name: "mongodb",
  connect: async (conn_str: string) => {
    await connect(conn_str);
  },
  ensureCreated: async () => {
    if (!jobInfoTable.created)
      await jobInfoTable.create();
  },
  tables: {
    JobInfo: jobInfoTable,
  }
};

export default datasource;
