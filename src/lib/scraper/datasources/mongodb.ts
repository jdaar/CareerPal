import type { GetRowsCallback, PostRowCallback, Table, TablesWithKey } from "../lib/datasource";
import type { TJobInfo } from "../lib/platform";
import mongoose, { Schema, model, connect, Connection, Model } from "mongoose";
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


class JobInfoTable implements Table<TJobInfo> {
  public Created = false;
  private connection: Connection | null = null;
  private jobInfoModel: Model<TJobInfo> | null = null;

  public SetConnection(conn: Connection) {
     this.connection = conn;
     this.jobInfoModel = this.connection.model<TJobInfo>("job-info", JobInfoSchema);
  }

  public Create = async () => {
    if (this.jobInfoModel == null) throw new Error('Model should not be null');
    if (this.Created) return;
    await this.jobInfoModel.createCollection();
    this.Created = true;
  };

  public GetRows: GetRowsCallback<TJobInfo> = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _filter = (job) => true 
  ) => {
    if (this.jobInfoModel == null) throw new Error('Model should not be null');
    const documents = await this.jobInfoModel.find();
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

  public PostRow: PostRowCallback<TJobInfo> = async (row) => {
    if (this.jobInfoModel == null) throw new Error('Model should not be null');
    log("info", "jobInfoPostRow", `Posting row to table JobInfo...`);
    const newJobInfo = new this.jobInfoModel(row);
    log(
      "debug",
      "jobInfoPostRow",
      `Row posted to table JobInfo: ${JSON.stringify(newJobInfo)}`
    );
    await newJobInfo.save();
  }
}

class Datasource implements Datasource {
  public Name = "mongodb";
  private connection: Connection | null = null;
  public Tables: TablesWithKey

  constructor() {
    this.Tables = {
      JobInfo: new JobInfoTable()
    }
  }

  public async Connect(conn_str: string) {
    await connect(conn_str);
    this.connection = mongoose.connection;
    this.connection.on("error", console.error.bind(console, "Connection error: "));
    this.connection.once("open", function () {
      console.log("Connected successfully");
    });
    this.Tables.JobInfo.SetConnection(this.connection);
  }

  public async EnsureCreated() {
    if (!this.Tables.JobInfo.Created)
      await this.Tables.JobInfo.Create();
  }
}

export default Datasource;
