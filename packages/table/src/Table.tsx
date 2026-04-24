/**
 * Table — generic data table with optional sorting, row selection, loading
 * skeletons, and an empty state.
 *
 * Optional batteries-included props layer on top of the primitive API:
 *   - `toolbar` / `searchable` render a toolbar row above the header.
 *   - `expandable` / `renderExpanded` enable expandable detail rows.
 *   - `pagination` renders a `<Pagination>` footer with optional page-size.
 *
 * When these are omitted the component is pure data rendering — compose with
 * your own search, filters, and `<Pagination>` wherever you want.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cx } from "@sisyphos-ui/core/internal";
import type { RowId, SortDirection, SortState, TableColumn } from "./types";
import { Pagination } from "./Pagination";
import "./Table.scss";

export interface TableFilterField {
  /** Stable identifier used by onFilterClear. */
  key: string;
  /** Label rendered above the control. */
  label?: React.ReactNode;
  /** The actual filter control (e.g. `<Select>`, `<DatePicker>`, `<Chip>` group). */
  control: React.ReactNode;
  /** Whether this filter currently has a value — drives the per-filter clear button visibility. */
  active?: boolean;
}

export interface TablePaginationConfig {
  /** Current page (1-based). */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Called with the next page when a page control is activated. */
  onPageChange: (page: number) => void;
  /** Current page size (rows per page). Enables the page-size selector when paired with `pageSizeOptions`. */
  pageSize?: number;
  /** Available page sizes rendered in the page-size selector. */
  pageSizeOptions?: number[];
  /** Called with the chosen page size. */
  onPageSizeChange?: (size: number) => void;
  /** Total item count — used for the "Showing N–M of T" summary. */
  total?: number;
  /** Forwarded to `<Pagination>`. */
  siblings?: number;
  /** Forwarded to `<Pagination>`. */
  boundaries?: number;
}

export interface TableProps<T> {
  /** Row data. */
  data: T[];
  /** Column definitions. */
  columns: TableColumn<T>[];
  /** Returns a unique id for a row. Required for selection and expansion. */
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
  /**
   * How row selection is toggled when `selectable` is true.
   * - `checkbox` (default): only the checkbox toggles selection.
   * - `click`: single click anywhere on the row toggles the selection.
   * - `doubleClick`: double-click toggles. Single click still fires `onRowClick`.
   */
  rowSelectionMode?: "checkbox" | "click" | "doubleClick";

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
  /** Fired on right-click of a row. Useful for wiring a context menu. */
  onRowContextMenu?: (event: React.MouseEvent<HTMLTableRowElement>, row: T, index: number) => void;

  /** Arbitrary toolbar content rendered above the header (filters, buttons, …). */
  toolbar?: React.ReactNode;
  /**
   * Declarative filter slots rendered as a second toolbar row. Each entry
   * becomes a labeled control — pass any ReactNode (Select, DatePicker, Chip
   * group, …). Useful when you want a structured filter bar without writing
   * all the layout yourself.
   */
  filters?: TableFilterField[];
  /** Called with the current active filter key when a filter clear button is clicked. */
  onFilterClear?: (key: string) => void;
  /** Show "Clear all filters" button when at least one filter has a value. */
  showClearAllFilters?: boolean;
  /** Called when the user activates "Clear all filters". */
  onClearAllFilters?: () => void;
  /**
   * Height mode.
   *   `auto`    — default, table fits content height.
   *   `flex`    — table body fills remaining vertical space (good for dashboards).
   *   `content` — explicitly fit to content, no scroll (for embedded/modal tables).
   */
  heightMode?: "auto" | "flex" | "content";
  /** Built-in search input inside the toolbar row. */
  searchable?: boolean;
  /** Controlled search value. */
  searchValue?: string;
  /** Initial search value when uncontrolled. */
  defaultSearchValue?: string;
  /** Called whenever the search input changes. */
  onSearchChange?: (query: string) => void;
  /** Placeholder for the built-in search input. */
  searchPlaceholder?: string;

  /** Enables an expand chevron column and per-row expanded content. */
  expandable?: boolean;
  /** Renderer for the expanded content row. Required when `expandable`. */
  renderExpanded?: (row: T, index: number) => React.ReactNode;
  /** Controlled list of expanded row ids. */
  expandedIds?: RowId[];
  /** Initial expanded ids when uncontrolled. */
  defaultExpandedIds?: RowId[];
  /** Called whenever the expanded set changes. */
  onExpandedChange?: (ids: RowId[]) => void;
  /** Hide a row's expand control when the row has nothing to reveal. */
  rowExpandable?: (row: T, index: number) => boolean;

  /** Renders a `<Pagination>` footer wired to the supplied config. */
  pagination?: TablePaginationConfig;
  /** Custom format for the "Showing N–M of T" summary. */
  paginationSummary?: (range: { from: number; to: number; total: number }) => React.ReactNode;

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

const ExpandChevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    viewBox="0 0 16 16"
    width="14"
    height="14"
    aria-hidden="true"
    className={cx("sisyphos-table-expand-chevron", open && "open")}
  >
    <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      d="M10 18a8 8 0 115.29-14A8 8 0 0110 18zm11 3l-5.2-5.2a10 10 0 10-1.4 1.4L19.6 22.4z"
      fill="currentColor"
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
    rowSelectionMode = "checkbox",
    sort,
    onSortChange,
    actions,
    actionsHeader = "Actions",
    onRowClick,
    onRowContextMenu,
    toolbar,
    filters,
    onFilterClear,
    showClearAllFilters = false,
    onClearAllFilters,
    heightMode = "auto",
    searchable = false,
    searchValue,
    defaultSearchValue = "",
    onSearchChange,
    searchPlaceholder = "Search…",
    expandable = false,
    renderExpanded,
    expandedIds: controlledExpandedIds,
    defaultExpandedIds = [],
    onExpandedChange,
    rowExpandable,
    pagination,
    paginationSummary,
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

  /* ── selection ── */
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

  /* ── sort ── */
  const handleSort = (col: TableColumn<T>) => {
    if (!col.sortable || !onSortChange) return;
    const key = col.sortKey ?? col.id;
    if (sort?.key !== key) onSortChange({ key, direction: "asc" });
    else if (sort.direction === "asc") onSortChange({ key, direction: "desc" });
    else onSortChange(null);
  };

  /* ── search (controlled or uncontrolled) ── */
  const isSearchControlled = searchValue !== undefined;
  const [internalSearch, setInternalSearch] = useState(defaultSearchValue);
  const currentSearch = isSearchControlled ? (searchValue as string) : internalSearch;
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (!isSearchControlled) setInternalSearch(next);
    onSearchChange?.(next);
  };

  /* ── expand (controlled or uncontrolled) ── */
  const isExpandControlled = controlledExpandedIds !== undefined;
  const [internalExpanded, setInternalExpanded] = useState<RowId[]>(defaultExpandedIds);
  const expandedIds = isExpandControlled ? (controlledExpandedIds as RowId[]) : internalExpanded;
  const toggleExpanded = (id: RowId) => {
    const next = expandedIds.includes(id)
      ? expandedIds.filter((x) => x !== id)
      : [...expandedIds, id];
    if (!isExpandControlled) setInternalExpanded(next);
    onExpandedChange?.(next);
  };

  const headerCheckRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (headerCheckRef.current) headerCheckRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const colCount =
    columns.length +
    (selectable ? 1 : 0) +
    (actions ? 1 : 0) +
    (expandable ? 1 : 0);

  const showToolbar = searchable || toolbar;
  const hasFilters = Boolean(filters && filters.length > 0);
  const anyFilterActive = hasFilters && filters!.some((f) => f.active);

  return (
    <div className={cx("sisyphos-table-wrapper", `height-${heightMode}`, className)}>
      {showToolbar && (
        <div className="sisyphos-table-toolbar">
          {searchable && (
            <div className="sisyphos-table-search">
              <span className="sisyphos-table-search-icon">
                <SearchIcon />
              </span>
              <input
                type="search"
                role="searchbox"
                className="sisyphos-table-search-input"
                placeholder={searchPlaceholder}
                value={currentSearch}
                onChange={handleSearchInput}
                aria-label={searchPlaceholder}
              />
            </div>
          )}
          {toolbar && <div className="sisyphos-table-toolbar-extras">{toolbar}</div>}
        </div>
      )}

      {hasFilters && (
        <div className="sisyphos-table-filters">
          {filters!.map((f) => (
            <div key={f.key} className={cx("sisyphos-table-filter", f.active && "active")}>
              {f.label && (
                <span className="sisyphos-table-filter-label">{f.label}</span>
              )}
              <div className="sisyphos-table-filter-control">{f.control}</div>
              {f.active && onFilterClear && (
                <button
                  type="button"
                  className="sisyphos-table-filter-clear"
                  onClick={() => onFilterClear(f.key)}
                  aria-label={`Clear ${
                    typeof f.label === "string" ? f.label : f.key
                  }`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {showClearAllFilters && anyFilterActive && onClearAllFilters && (
            <button
              type="button"
              className="sisyphos-table-filter-clear-all"
              onClick={onClearAllFilters}
            >
              Clear all
            </button>
          )}
        </div>
      )}

      <div className="sisyphos-table-scroll">
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
              {expandable && <th className="sisyphos-table-expand-cell" aria-hidden="true" />}
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
                  {expandable && <td className="sisyphos-table-expand-cell" />}
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
                <td className="sisyphos-table-empty" colSpan={colCount}>
                  {empty}
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
                const id = getId(row, i);
                const selected = selectedIds.includes(id);
                const canExpand =
                  expandable && renderExpanded !== undefined && (rowExpandable ? rowExpandable(row, i) : true);
                const isExpanded = canExpand && expandedIds.includes(id);
                return (
                  <React.Fragment key={String(id)}>
                    <tr
                      className={cx(
                        selected && "selected",
                        (onRowClick || (selectable && rowSelectionMode !== "checkbox")) && "clickable",
                      )}
                      onClick={(() => {
                        const selectOnClick = selectable && rowSelectionMode === "click";
                        if (!onRowClick && !selectOnClick) return undefined;
                        return () => {
                          if (selectOnClick) toggleRow(row, i);
                          onRowClick?.(row, i);
                        };
                      })()}
                      onDoubleClick={
                        selectable && rowSelectionMode === "doubleClick"
                          ? () => toggleRow(row, i)
                          : undefined
                      }
                      onContextMenu={onRowContextMenu ? (e) => onRowContextMenu(e, row, i) : undefined}
                      aria-selected={selected || undefined}
                    >
                      {expandable && (
                        <td className="sisyphos-table-expand-cell" onClick={(e) => e.stopPropagation()}>
                          {canExpand ? (
                            <button
                              type="button"
                              className="sisyphos-table-expand-button"
                              aria-expanded={isExpanded}
                              aria-label={isExpanded ? "Collapse row" : "Expand row"}
                              onClick={() => toggleExpanded(id)}
                            >
                              <ExpandChevron open={isExpanded} />
                            </button>
                          ) : null}
                        </td>
                      )}
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
                    {isExpanded && (
                      <tr className="sisyphos-table-expanded-row">
                        <td colSpan={colCount}>{renderExpanded!(row, i)}</td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <TableFooter config={pagination} paginationSummary={paginationSummary} />
      )}
    </div>
  );
}

function TableFooter({
  config,
  paginationSummary,
}: {
  config: TablePaginationConfig;
  paginationSummary?: (range: { from: number; to: number; total: number }) => React.ReactNode;
}) {
  const { page, pageCount, onPageChange, pageSize, pageSizeOptions, onPageSizeChange, total, siblings, boundaries } =
    config;

  const showSummary = typeof total === "number" && typeof pageSize === "number";
  const from = showSummary ? (page - 1) * (pageSize as number) + 1 : 0;
  const to = showSummary ? Math.min(page * (pageSize as number), total as number) : 0;

  return (
    <div className="sisyphos-table-footer">
      <div className="sisyphos-table-footer-summary">
        {showSummary && (
          paginationSummary
            ? paginationSummary({ from, to, total: total as number })
            : `Showing ${from}–${to} of ${total}`
        )}
      </div>
      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={onPageChange}
        siblings={siblings}
        boundaries={boundaries}
      />
      {pageSizeOptions && pageSizeOptions.length > 0 && (
        <label className="sisyphos-table-footer-pagesize">
          <span className="sisyphos-table-footer-pagesize-label">Rows</span>
          <select
            className="sisyphos-table-footer-pagesize-select"
            value={String(pageSize ?? pageSizeOptions[0])}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
