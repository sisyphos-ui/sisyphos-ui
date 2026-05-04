/**
 * Table types — Angular API. The Angular version takes plain string headers
 * and primitive accessors; for rich cell content, consumers register a
 * `<ng-template>` per column via the `cellTemplates` map (see Table docs).
 */
export type SortDirection = "asc" | "desc";

export interface SortState {
  key: string;
  direction: SortDirection;
}

export type RowId = string | number;

export interface TableColumn<T = Record<string, unknown>> {
  /** Stable column id (also used as default sort key). */
  id: string;
  /** Header text. */
  header: string;
  /** Reads the cell value from a row — a key or a getter. */
  accessor: keyof T | ((row: T) => unknown);
  align?: "left" | "center" | "right";
  width?: number | string;
  className?: string;
  sortable?: boolean;
  /** Override sort key when different from `id`. */
  sortKey?: string;
  /** Truncate cell content to a single line with an ellipsis. */
  truncate?: boolean;
}

export interface TablePaginationConfig {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  total?: number;
  siblings?: number;
  boundaries?: number;
}

export interface TableFilterField {
  key: string;
  label?: string;
  active?: boolean;
}
