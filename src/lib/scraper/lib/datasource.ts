import type { TJobInfo } from "./platform";

type TablesWithKey = {
  JobInfo: Table<TJobInfo>
}

/**
 * Posts a row to the table.
 * @param row The row to post.
 * @since 1.0.0
 * @example
 * const tokenTable = datasource.tokenTable;
 * tokenTable.postRow({ token: 'token', excluded: false });
 * @since 1.0.0
 */
export type PostRowCallback<T> = (row: T) => void;

/**
 * Gets the rows from the table.
 * @param filter The filter to apply to the rows.
 * @since 1.0.0
 * @example
 * const tokenTable = datasource.tokenTable;
 * const tokens = tokenTable.getRows((token) => token.excluded === false);
 * console.log(tokens) // [{ token: 'token', excluded: false }]
 * @since 1.0.0
 */
export type GetRowsCallback<T> = (filter: (value: T) => T) => Promise<T[]>;

export type Table<T> = {
  created: boolean;
  create: () => void;
  postRow: PostRowCallback<T>;
  getRows: GetRowsCallback<T>;
};

export type Datasource = {
  name: string;
  connect: (connection_string: string) => void;
  ensureCreated: () => void;
  tables: TablesWithKey
};
