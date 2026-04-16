/**
 * Table — generic data table with optional sorting, row selection, loading
 * skeletons, and an empty state.
 *
 * Pagination is intentionally a separate primitive (`<Pagination>`) so the
 * table stays focused on data rendering.
 */
import React, { useCallback } from "react";
import { cx } from "@sisyphos-ui/core/internal";
import type { RowId, SortDirection, SortState, TableColumn } from "./types";
import "./Table.scss";

export interface TableProps<T> {
  /** Row data. */
  data: T[];
  /** Column definitions. */
  columns: TableColumn<T>[];
  /** Returns a unique id for a row. Required when `selectable` is true. */
  rowKey?: (row: T, index: number) => RowId;

  /** When true, renders skeleton rows instead of data. */
  loading?: boolean;
  /** Number of skeleton rows to render while loading. Default 5. */
  skeletonRows?: number;
  /** Content rendered when `data` is empty. */
  empty?: React.ReactNode;

  /** Show a checkbox column for selecting rows. */
  selectable?: boolean;
  /** Controlled list of selected row ids. */
  selectedIds?: RowId[];
  /** Called with the next selection when it changes. */
  onSelectionChange?: (ids: RowId[]) => void;

  /** Current sort state (controlled). */
  sort?: SortState;
  /** Called with the next sort state when a sortable header is clicked. */
  onSortChange?: (sort: SortState | null) => void;

  /** Renderer for the rightmost actions cell. */
  actions?: (row: T, index: number) => React.ReactNode;
  /** Header text for the actions column. */
  actionsHeader?: React.ReactNode;

  /** Invoked when a row body is clicked (ignored for checkbox/actions cells). */
  onRowClick?: (row: T, index: number) => void;

  size?: "sm" | "md" | "lg";
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  /** Pin the header row when scrolling a constrained container. */
  stickyHeader?: boolean;
  className?: string;
}

const SortIcon: React.FC<{ direction?: SortDirection }> = ({ direction }) => (
  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
    <path
      d="M8 2l4 5H4l4-5zM8 14l-4-5h8l-4 5z"
      fill="currentColor"
      opacity={direction === "asc" || direction === "desc" ? 1 : 0.4}
      transform={direction === "desc" ? "rotate(180 8 8)" : undefined}
    />
  </svg>
);

export function Table<T>(props: TableProps<T>) {
  const {
    data,
    columns,
    rowKey,
    loading = false,
    skeletonRows = 5,
    empty = "No data",
    selectable = false,
    selectedIds = [],
    onSelectionChange,
    sort,
    onSortChange,
    actions,
    actionsHeader = "Actions",
    onRowClick,
    size = "md",
    striped = false,
    hoverable = true,
    bordered = false,
    stickyHeader = false,
    className,
  } = props;

  const getId = useCallback(
    (row: T, idx: number): RowId => (rowKey ? rowKey(row, idx) : idx),
    [rowKey]
  );

  const allSelected = data.length > 0 && data.every((r, i) => selectedIds.includes(getId(r, i)));
  const someSelected = !allSelected && data.some((r, i) => selectedIds.includes(getId(r, i)));

  const toggleAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) onSelectionChange(data.map((r, i) => getId(r, i)));
    else onSelectionChange([]);
  };

  const toggleRow = (row: T, idx: number) => {
    if (!onSelectionChange) return;
    const id = getId(row, idx);
    onSelectionChange(
      selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]
    );
  };

  const handleSort = (col: TableColumn<T>) => {
    if (!col.sortable || !onSortChange) return;
    const key = col.sortKey ?? col.id;
    if (sort?.key !== key) onSortChange({ key, direction: "asc" });
    else if (sort.direction === "asc") onSortChange({ key, direction: "desc" });
    else onSortChange(null);
  };

  const headerCheckRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    if (headerCheckRef.current) headerCheckRef.current.indeterminate = someSelected;
  }, [someSelected]);

  return (
    <div className={cx("sisyphos-table-wrapper", className)}>
      <table
        className={cx(
          "sisyphos-table",
          size,
          striped && "striped",
          hoverable && "hoverable",
          bordered && "bordered",
          stickyHeader && "sticky-header"
        )}
      >
        <thead>
          <tr>
            {selectable && (
              <th className="sisyphos-table-select-cell">
                <input
                  ref={headerCheckRef}
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={allSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                  disabled={data.length === 0}
                />
              </th>
            )}
            {columns.map((col) => {
              const sortKey = col.sortKey ?? col.id;
              const isSorted = sort?.key === sortKey;
              const ariaSort: React.AriaAttributes["aria-sort"] = !col.sortable
                ? undefined
                : isSorted
                  ? sort!.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none";
              return (
                <th
                  key={col.id}
                  scope="col"
                  className={cx(`align-${col.align ?? "left"}`, col.sortable && "sortable", col.className)}
                  style={col.style ? { ...col.style, width: col.width } : { width: col.width }}
                  aria-sort={ariaSort}
                  onClick={() => handleSort(col)}
                >
                  <span className="sisyphos-table-header-content">
                    {col.header}
                    {col.sortable && <SortIcon direction={isSorted ? sort!.direction : undefined} />}
                  </span>
                </th>
              );
            })}
            {actions && <th className="sisyphos-table-actions-cell">{actionsHeader}</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="sisyphos-table-skeleton-row">
                {selectable && <td className="sisyphos-table-select-cell"><span className="sisyphos-table-skeleton" /></td>}
                {columns.map((c) => (
                  <td key={c.id} className={cx(`align-${c.align ?? "left"}`)}>
                    <span className="sisyphos-table-skeleton" />
                  </td>
                ))}
                {actions && <td><span className="sisyphos-table-skeleton" /></td>}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td className="sisyphos-table-empty" colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
                {empty}
              </td>
            </tr>
          ) : (
            data.map((row, i) => {
              const id = getId(row, i);
              const selected = selectedIds.includes(id);
              return (
                <tr
                  key={String(id)}
                  className={cx(selected && "selected", onRowClick && "clickable")}
                  onClick={onRowClick ? () => onRowClick(row, i) : undefined}
                  aria-selected={selected || undefined}
                >
                  {selectable && (
                    <td className="sisyphos-table-select-cell" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label={`Select row ${i + 1}`}
                        checked={selected}
                        onChange={() => toggleRow(row, i)}
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const value = col.render
                      ? col.render(row)
                      : typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor as keyof T] as unknown as React.ReactNode);
                    return (
                      <td
                        key={col.id}
                        className={cx(`align-${col.align ?? "left"}`, col.className)}
                        style={col.style}
                      >
                        {value}
                      </td>
                    );
                  })}
                  {actions && (
                    <td className="sisyphos-table-actions-cell" onClick={(e) => e.stopPropagation()}>
                      {actions(row, i)}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
