import type { VNode } from "vue";

export type SortDirection = "asc" | "desc";

export interface SortState {
  key: string;
  direction: SortDirection;
}

export type RowId = string | number;

export interface TableColumn<T = Record<string, unknown>> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => unknown);
  render?: (row: T) => VNode | string | number | null;
  align?: "left" | "center" | "right";
  width?: number | string;
  className?: string;
  sortable?: boolean;
  sortKey?: string;
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
