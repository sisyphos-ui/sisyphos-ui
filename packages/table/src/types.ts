import type { CSSProperties, ReactNode } from "react";

export type SortDirection = "asc" | "desc";

export interface SortState {
  key: string;
  direction: SortDirection;
}

export type RowId = string | number;

export interface TableColumn<T> {
  /** Stable column id (also used as default sort key). */
  id: string;
  /** Header content. */
  header: ReactNode;
  /** Reads the cell value from a row. */
  accessor: keyof T | ((row: T) => ReactNode);
  /** Custom renderer overriding `accessor` output (e.g. status pill). */
  render?: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
  width?: number | string;
  className?: string;
  style?: CSSProperties;
  sortable?: boolean;
  /** Override sort key when different from `id`. */
  sortKey?: string;
}
