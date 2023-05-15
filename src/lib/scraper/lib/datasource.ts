/**
 * Datasources should really be a class
 */

import mongoose, { Connection } from "mongoose";
import type { TJobInfo } from "./platform";

export type TablesWithKey = {
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
export type GetRowsCallback<T> = (filter: (value: T) => boolean) => Promise<T[]>;


export abstract class Table<T> {
  public abstract Created: boolean;
  public abstract PostRow: PostRowCallback<T>;
  public abstract GetRows: GetRowsCallback<T>;
  public abstract SetConnection: (conn: any) => void;

  public abstract Create: () => void;
};

export abstract class Datasource {
  public abstract Name: string;
  public abstract Connect: (connection_string: string) => void;
  public abstract EnsureCreated: () => void;
  public abstract Tables: TablesWithKey
};
