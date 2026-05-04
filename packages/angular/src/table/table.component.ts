/**
 * Table — Angular 18 standalone data table with optional sorting, row
 * selection, loading skeletons, expandable rows, search, filters, and a
 * pagination footer. Mirrors the React/Vue versions feature-for-feature.
 *
 * Custom cell rendering uses Angular's TemplateRef-per-column pattern:
 *
 *   <sui-table [data]="rows" [columns]="cols" [cellTemplates]="{ status: statusTpl }">
 *     <ng-template #statusTpl let-row>
 *       <sui-chip [color]="row.status === 'ok' ? 'success' : 'error'">
 *         {{ row.status }}
 *       </sui-chip>
 *     </ng-template>
 *   </sui-table>
 *
 * Expanded row content via `[expandedTemplate]`, actions via `[actionsTemplate]`.
 */
import type {
  OnDestroy,
  TemplateRef} from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input as NgInput,
  Output,
  computed,
  effect,
  signal,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { Pagination } from "./pagination.component";
import type {
  RowId,
  SortState,
  TableColumn,
  TableFilterField,
  TablePaginationConfig,
} from "./types";

@Component({
  selector: "sui-table",
  standalone: true,
  imports: [NgTemplateOutlet, Pagination],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="wrapperClasses()">
      @if (showToolbar()) {
        <div class="sisyphos-table-toolbar">
          @if (searchable()) {
            <div class="sisyphos-table-search">
              <span class="sisyphos-table-search-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d="M10 18a8 8 0 115.29-14A8 8 0 0110 18zm11 3l-5.2-5.2a10 10 0 10-1.4 1.4L19.6 22.4z" fill="currentColor" />
                </svg>
              </span>
              <input
                type="search"
                role="searchbox"
                class="sisyphos-table-search-input"
                [placeholder]="searchPlaceholder()"
                [value]="effectiveSearchValue()"
                [attr.aria-label]="searchPlaceholder()"
                (input)="onSearchInput($event)"
              />
            </div>
          }
          @if (toolbarTemplate()) {
            <div class="sisyphos-table-toolbar-extras">
              <ng-container *ngTemplateOutlet="toolbarTemplate()!" />
            </div>
          }
        </div>
      }

      @if (hasFilters()) {
        <div class="sisyphos-table-filters">
          @for (f of filters(); track f.key) {
            <div [class]="filterClasses(f)">
              @if (f.label) {
                <span class="sisyphos-table-filter-label">{{ f.label }}</span>
              }
              <div class="sisyphos-table-filter-control">
                <ng-container
                  *ngTemplateOutlet="filterTemplates()?.[f.key] ?? null; context: { $implicit: f }"
                />
              </div>
              @if (f.active) {
                <button
                  type="button"
                  class="sisyphos-table-filter-clear"
                  [attr.aria-label]="'Clear ' + (f.label ?? f.key)"
                  (click)="filterClear.emit(f.key)"
                >×</button>
              }
            </div>
          }
          @if (showClearAllFilters() && anyFilterActive()) {
            <button type="button" class="sisyphos-table-filter-clear-all" (click)="clearAllFilters.emit()">
              Clear all
            </button>
          }
        </div>
      }

      <div class="sisyphos-table-scroll">
        <table [class]="tableClasses()">
          <thead>
            <tr>
              @if (expandable()) {
                <th class="sisyphos-table-expand-cell" aria-hidden="true"></th>
              }
              @if (selectable()) {
                <th class="sisyphos-table-select-cell">
                  <input
                    #headerCheck
                    type="checkbox"
                    aria-label="Select all rows"
                    [checked]="allSelected()"
                    [disabled]="data().length === 0"
                    (change)="onToggleAll($event)"
                  />
                </th>
              }
              @for (col of columns(); track col.id) {
                <th
                  scope="col"
                  [class]="headerClasses(col)"
                  [style.width]="widthValueOf(col)"
                  [attr.aria-sort]="ariaSort(col)"
                  (click)="onHeaderClick(col)"
                >
                  <span class="sisyphos-table-header-content">
                    {{ col.header }}
                    @if (col.sortable) {
                      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                        <path
                          d="M8 2l4 5H4l4-5zM8 14l-4-5h8l-4 5z"
                          fill="currentColor"
                          [attr.opacity]="sort()?.key === (col.sortKey ?? col.id) ? 1 : 0.4"
                          [attr.transform]="sort()?.key === (col.sortKey ?? col.id) && sort()?.direction === 'desc' ? 'rotate(180 8 8)' : null"
                        />
                      </svg>
                    }
                  </span>
                </th>
              }
              @if (actionsTemplate()) {
                <th class="sisyphos-table-actions-cell">{{ actionsHeader() }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @if (showSkeleton()) {
              @for (i of skeletonIndexes(); track $index) {
                <tr class="sisyphos-table-skeleton-row">
                  @if (expandable()) { <td class="sisyphos-table-expand-cell"></td> }
                  @if (selectable()) {
                    <td class="sisyphos-table-select-cell"><span class="sisyphos-table-skeleton"></span></td>
                  }
                  @for (col of columns(); track col.id; let ci = $index) {
                    <td [class]="'align-' + (col.align ?? 'left')">
                      <span [class]="'sisyphos-table-skeleton width-' + (ci % 3)"></span>
                    </td>
                  }
                  @if (actionsTemplate()) {
                    <td><span class="sisyphos-table-skeleton width-actions"></span></td>
                  }
                </tr>
              }
            } @else if (data().length === 0) {
              <tr>
                <td class="sisyphos-table-empty" [attr.colspan]="colCount()">{{ empty() }}</td>
              </tr>
            } @else {
              @for (row of data(); track rowKeyOf(row, $index); let i = $index) {
                <tr
                  [class]="rowClasses(row, i)"
                  [attr.aria-selected]="isSelected(row, i) || null"
                  (click)="onRowClickInternal(row, i, $event)"
                  (dblclick)="onRowDblclickInternal(row, i, $event)"
                  (contextmenu)="rowContextMenu.emit({ event: $event, row, index: i })"
                >
                  @if (expandable()) {
                    <td class="sisyphos-table-expand-cell" (click)="$event.stopPropagation()">
                      @if (canExpand(row, i)) {
                        <button
                          type="button"
                          class="sisyphos-table-expand-button"
                          [attr.aria-expanded]="isExpanded(row, i)"
                          [attr.aria-label]="isExpanded(row, i) ? 'Collapse row' : 'Expand row'"
                          (click)="toggleExpanded(row, i)"
                        >
                          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"
                               [class]="'sisyphos-table-expand-chevron' + (isExpanded(row, i) ? ' open' : '')">
                            <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </button>
                      }
                    </td>
                  }
                  @if (selectable()) {
                    <td class="sisyphos-table-select-cell" (click)="$event.stopPropagation()">
                      <input
                        type="checkbox"
                        [attr.aria-label]="'Select row ' + (i + 1)"
                        [checked]="isSelected(row, i)"
                        (change)="onToggleRow(row, i)"
                      />
                    </td>
                  }
                  @for (col of columns(); track col.id) {
                    <td [class]="cellClasses(col)">
                      @if (cellTemplates()?.[col.id]) {
                        <ng-container
                          *ngTemplateOutlet="cellTemplates()![col.id]; context: { $implicit: row, row: row, index: i }"
                        />
                      } @else if (col.truncate) {
                        <div
                          class="sisyphos-table-cell-truncate"
                          [title]="cellText(col, row)"
                        >{{ cellText(col, row) }}</div>
                      } @else {
                        {{ cellText(col, row) }}
                      }
                    </td>
                  }
                  @if (actionsTemplate()) {
                    <td class="sisyphos-table-actions-cell" (click)="$event.stopPropagation()">
                      <ng-container
                        *ngTemplateOutlet="actionsTemplate()!; context: { $implicit: row, row: row, index: i }"
                      />
                    </td>
                  }
                </tr>
                @if (expandable() && canExpand(row, i) && isExpanded(row, i)) {
                  <tr class="sisyphos-table-expanded-row">
                    <td [attr.colspan]="colCount()">
                      <ng-container
                        *ngTemplateOutlet="expandedTemplate()!; context: { $implicit: row, row: row, index: i }"
                      />
                    </td>
                  </tr>
                }
              }
            }
          </tbody>
        </table>
      </div>

      @if (pagination()) {
        <div class="sisyphos-table-footer">
          <div class="sisyphos-table-footer-summary">
            @if (showSummary()) {
              Showing {{ summaryFrom() }}–{{ summaryTo() }} of {{ pagination()!.total }}
            }
          </div>
          <sui-pagination
            [page]="pagination()!.page"
            [pageCount]="pagination()!.pageCount"
            [siblings]="pagination()!.siblings ?? 1"
            [boundaries]="pagination()!.boundaries ?? 1"
            (pageChange)="pagination()!.onPageChange($event)"
          />
          @if (pagination()!.pageSizeOptions?.length) {
            <label class="sisyphos-table-footer-pagesize">
              <span class="sisyphos-table-footer-pagesize-label">Rows</span>
              <select
                class="sisyphos-table-footer-pagesize-select"
                [value]="String(pagination()!.pageSize ?? pagination()!.pageSizeOptions![0])"
                (change)="onPageSizeChange($event)"
              >
                @for (n of pagination()!.pageSizeOptions; track n) {
                  <option [value]="n">{{ n }}</option>
                }
              </select>
            </label>
          }
        </div>
      }
    </div>
  `,
})
export class Table<T extends Record<string, unknown> = Record<string, unknown>> implements OnDestroy {
  // ── Inputs ────────────────────────────────────────────────────────────
  private readonly _data = signal<T[]>([]);
  private readonly _columns = signal<TableColumn<T>[]>([]);
  private readonly _rowKey = signal<((row: T, idx: number) => RowId) | undefined>(undefined);
  private readonly _loading = signal(false);
  private readonly _skeletonRows = signal(5);
  private readonly _loadingDelay = signal(0);
  private readonly _empty = signal<string>("No data");
  private readonly _selectable = signal(false);
  private readonly _selectedIds = signal<RowId[]>([]);
  private readonly _rowSelectionMode = signal<"checkbox" | "click" | "doubleClick">("checkbox");
  private readonly _sort = signal<SortState | undefined>(undefined);
  private readonly _actionsHeader = signal<string>("Actions");
  private readonly _filters = signal<TableFilterField[] | undefined>(undefined);
  private readonly _showClearAllFilters = signal(false);
  private readonly _heightMode = signal<"auto" | "flex" | "content">("auto");
  private readonly _searchable = signal(false);
  private readonly _searchValue = signal<string | undefined>(undefined);
  private readonly _internalSearch = signal<string>("");
  private readonly _searchPlaceholder = signal<string>("Search…");
  private readonly _expandable = signal(false);
  private readonly _expandedIds = signal<RowId[] | undefined>(undefined);
  private readonly _internalExpanded = signal<RowId[]>([]);
  private readonly _rowExpandable = signal<((row: T, idx: number) => boolean) | undefined>(undefined);
  private readonly _rowClassName = signal<((row: T, idx: number) => string | undefined) | undefined>(undefined);
  private readonly _pagination = signal<TablePaginationConfig | undefined>(undefined);
  private readonly _size = signal<"sm" | "md" | "lg">("md");
  private readonly _striped = signal(false);
  private readonly _hoverable = signal(true);
  private readonly _bordered = signal(false);
  private readonly _stickyHeader = signal(false);
  private readonly _toolbarTemplate = signal<TemplateRef<unknown> | undefined>(undefined);
  private readonly _cellTemplates = signal<Record<string, TemplateRef<unknown>> | undefined>(undefined);
  private readonly _actionsTemplate = signal<TemplateRef<unknown> | undefined>(undefined);
  private readonly _expandedTemplate = signal<TemplateRef<unknown> | undefined>(undefined);
  private readonly _filterTemplates = signal<Record<string, TemplateRef<unknown>> | undefined>(undefined);

  private readonly _showSkeleton = signal(false);
  private skeletonTimer: ReturnType<typeof setTimeout> | null = null;

  // Public readonlys ────────────────────────────────────────────────────
  readonly data = this._data.asReadonly();
  readonly columns = this._columns.asReadonly();
  readonly empty = this._empty.asReadonly();
  readonly selectable = this._selectable.asReadonly();
  readonly selectedIds = this._selectedIds.asReadonly();
  readonly sort = this._sort.asReadonly();
  readonly actionsHeader = this._actionsHeader.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly showClearAllFilters = this._showClearAllFilters.asReadonly();
  readonly searchable = this._searchable.asReadonly();
  readonly searchPlaceholder = this._searchPlaceholder.asReadonly();
  readonly expandable = this._expandable.asReadonly();
  readonly pagination = this._pagination.asReadonly();
  readonly toolbarTemplate = this._toolbarTemplate.asReadonly();
  readonly cellTemplates = this._cellTemplates.asReadonly();
  readonly actionsTemplate = this._actionsTemplate.asReadonly();
  readonly expandedTemplate = this._expandedTemplate.asReadonly();
  readonly filterTemplates = this._filterTemplates.asReadonly();
  readonly showSkeleton = this._showSkeleton.asReadonly();

  @NgInput("data") set dataInput(v: T[]) { this._data.set(v ?? []); }
  @NgInput("columns") set columnsInput(v: TableColumn<T>[]) { this._columns.set(v ?? []); }
  @NgInput("rowKey") set rowKeyInput(v: ((row: T, idx: number) => RowId) | undefined) {
    this._rowKey.set(v);
  }
  @NgInput("loading") set loadingInput(v: boolean) {
    this._loading.set(v);
    // Mirror eagerly so the skeleton appears synchronously without waiting
    // for the effect to flush (which doesn't reliably happen in JIT tests).
    if (this.skeletonTimer) {
      clearTimeout(this.skeletonTimer);
      this.skeletonTimer = null;
    }
    if (!v) {
      this._showSkeleton.set(false);
      return;
    }
    if (this._loadingDelay() <= 0) {
      this._showSkeleton.set(true);
      return;
    }
    this.skeletonTimer = setTimeout(() => this._showSkeleton.set(true), this._loadingDelay());
  }
  @NgInput("skeletonRows") set skeletonRowsInput(v: number) { this._skeletonRows.set(v); }
  @NgInput("loadingDelay") set loadingDelayInput(v: number) { this._loadingDelay.set(v); }
  @NgInput("empty") set emptyInput(v: string) { this._empty.set(v); }
  @NgInput("selectable") set selectableInput(v: boolean) { this._selectable.set(v); }
  @NgInput("selectedIds") set selectedIdsInput(v: RowId[] | undefined) {
    this._selectedIds.set(v ?? []);
  }
  @NgInput("rowSelectionMode") set rowSelectionModeInput(v: "checkbox" | "click" | "doubleClick") {
    this._rowSelectionMode.set(v);
  }
  @NgInput("sort") set sortInput(v: SortState | undefined) { this._sort.set(v); }
  @NgInput("actionsHeader") set actionsHeaderInput(v: string) { this._actionsHeader.set(v); }
  @NgInput("filters") set filtersInput(v: TableFilterField[] | undefined) { this._filters.set(v); }
  @NgInput("showClearAllFilters") set showClearAllFiltersInput(v: boolean) {
    this._showClearAllFilters.set(v);
  }
  @NgInput("heightMode") set heightModeInput(v: "auto" | "flex" | "content") {
    this._heightMode.set(v);
  }
  @NgInput("searchable") set searchableInput(v: boolean) { this._searchable.set(v); }
  @NgInput("searchValue") set searchValueInput(v: string | undefined) {
    this._searchValue.set(v);
  }
  @NgInput("defaultSearchValue") set defaultSearchValueInput(v: string) {
    if (this._internalSearch() === "") this._internalSearch.set(v);
  }
  @NgInput("searchPlaceholder") set searchPlaceholderInput(v: string) {
    this._searchPlaceholder.set(v);
  }
  @NgInput("expandable") set expandableInput(v: boolean) { this._expandable.set(v); }
  @NgInput("expandedIds") set expandedIdsInput(v: RowId[] | undefined) {
    this._expandedIds.set(v);
  }
  @NgInput("defaultExpandedIds") set defaultExpandedIdsInput(v: RowId[]) {
    if (this._internalExpanded().length === 0) this._internalExpanded.set(v);
  }
  @NgInput("rowExpandable") set rowExpandableInput(v: ((row: T, idx: number) => boolean) | undefined) {
    this._rowExpandable.set(v);
  }
  @NgInput("rowClassName") set rowClassNameInput(v: ((row: T, idx: number) => string | undefined) | undefined) {
    this._rowClassName.set(v);
  }
  @NgInput("pagination") set paginationInput(v: TablePaginationConfig | undefined) {
    this._pagination.set(v);
  }
  @NgInput("size") set sizeInput(v: "sm" | "md" | "lg") { this._size.set(v); }
  @NgInput("striped") set stripedInput(v: boolean) { this._striped.set(v); }
  @NgInput("hoverable") set hoverableInput(v: boolean) { this._hoverable.set(v); }
  @NgInput("bordered") set borderedInput(v: boolean) { this._bordered.set(v); }
  @NgInput("stickyHeader") set stickyHeaderInput(v: boolean) { this._stickyHeader.set(v); }

  // Template-ref slots (TemplateRef<unknown>) ───────────────────────────
  @NgInput("toolbarTemplate") set toolbarTemplateInput(t: TemplateRef<unknown> | undefined) {
    this._toolbarTemplate.set(t);
  }
  @NgInput("cellTemplates") set cellTemplatesInput(t: Record<string, TemplateRef<unknown>> | undefined) {
    this._cellTemplates.set(t);
  }
  @NgInput("actionsTemplate") set actionsTemplateInput(t: TemplateRef<unknown> | undefined) {
    this._actionsTemplate.set(t);
  }
  @NgInput("expandedTemplate") set expandedTemplateInput(t: TemplateRef<unknown> | undefined) {
    this._expandedTemplate.set(t);
  }
  @NgInput("filterTemplates") set filterTemplatesInput(t: Record<string, TemplateRef<unknown>> | undefined) {
    this._filterTemplates.set(t);
  }

  // Outputs ─────────────────────────────────────────────────────────────
  @Output() readonly selectedIdsChange = new EventEmitter<RowId[]>();
  @Output() readonly sortChange = new EventEmitter<SortState | null>();
  @Output() readonly searchChange = new EventEmitter<string>();
  @Output() readonly expandedIdsChange = new EventEmitter<RowId[]>();
  @Output() readonly rowClick = new EventEmitter<{ row: T; index: number }>();
  @Output() readonly rowDoubleClick = new EventEmitter<{ row: T; index: number }>();
  @Output() readonly rowContextMenu = new EventEmitter<{ event: MouseEvent; row: T; index: number }>();
  @Output() readonly filterClear = new EventEmitter<string>();
  @Output() readonly clearAllFilters = new EventEmitter<void>();

  protected readonly String = String;

  constructor() {
    // Loading-delay smoothing — writes _showSkeleton from inside the effect,
    // so we opt in via allowSignalWrites.
    effect(
      () => {
        const loading = this._loading();
        if (this.skeletonTimer) {
          clearTimeout(this.skeletonTimer);
          this.skeletonTimer = null;
        }
        if (!loading) {
          this._showSkeleton.set(false);
          return;
        }
        const delay = this._loadingDelay();
        if (delay <= 0) {
          this._showSkeleton.set(true);
          return;
        }
        this.skeletonTimer = setTimeout(() => this._showSkeleton.set(true), delay);
      },
      { allowSignalWrites: true }
    );
  }

  ngOnDestroy(): void {
    if (this.skeletonTimer) clearTimeout(this.skeletonTimer);
  }

  // ── Helpers ───────────────────────────────────────────────────────────
  rowKeyOf(row: T, idx: number): RowId {
    const fn = this._rowKey();
    return fn ? fn(row, idx) : idx;
  }

  isSelected(row: T, idx: number): boolean {
    return this._selectedIds().includes(this.rowKeyOf(row, idx));
  }

  isExpanded(row: T, idx: number): boolean {
    const list = this._expandedIds() ?? this._internalExpanded();
    return list.includes(this.rowKeyOf(row, idx));
  }

  canExpand(row: T, idx: number): boolean {
    if (!this._expandable() || !this._expandedTemplate()) return false;
    const fn = this._rowExpandable();
    return fn ? fn(row, idx) : true;
  }

  cellText(col: TableColumn<T>, row: T): string {
    if (typeof col.accessor === "function") {
      const v = col.accessor(row);
      return v == null ? "" : String(v);
    }
    const v = (row as Record<string, unknown>)[col.accessor as string];
    return v == null ? "" : String(v);
  }

  widthValueOf(col: TableColumn<T>): string | null {
    if (col.width === undefined) return null;
    return typeof col.width === "number" ? `${col.width}px` : col.width;
  }

  // Selection ───────────────────────────────────────────────────────────
  readonly allSelected = computed(() => {
    const data = this._data();
    if (data.length === 0) return false;
    return data.every((r, i) => this._selectedIds().includes(this.rowKeyOf(r, i)));
  });

  readonly someSelected = computed(() => {
    const all = this.allSelected();
    if (all) return false;
    return this._data().some((r, i) => this._selectedIds().includes(this.rowKeyOf(r, i)));
  });

  onToggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const next = checked ? this._data().map((r, i) => this.rowKeyOf(r, i)) : [];
    this._selectedIds.set(next);
    this.selectedIdsChange.emit(next);
  }

  onToggleRow(row: T, idx: number): void {
    const id = this.rowKeyOf(row, idx);
    const curr = this._selectedIds();
    const next = curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id];
    this._selectedIds.set(next);
    this.selectedIdsChange.emit(next);
  }

  // Sorting ─────────────────────────────────────────────────────────────
  onHeaderClick(col: TableColumn<T>): void {
    if (!col.sortable) return;
    const key = col.sortKey ?? col.id;
    const curr = this._sort();
    let next: SortState | null;
    if (curr?.key !== key) next = { key, direction: "asc" };
    else if (curr.direction === "asc") next = { key, direction: "desc" };
    else next = null;
    this.sortChange.emit(next);
  }

  ariaSort(col: TableColumn<T>): "ascending" | "descending" | "none" | null {
    if (!col.sortable) return null;
    const key = col.sortKey ?? col.id;
    if (this._sort()?.key !== key) return "none";
    return this._sort()!.direction === "asc" ? "ascending" : "descending";
  }

  // Search ──────────────────────────────────────────────────────────────
  readonly effectiveSearchValue = computed(() =>
    this._searchValue() !== undefined ? (this._searchValue() ?? "") : this._internalSearch()
  );

  onSearchInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    if (this._searchValue() === undefined) this._internalSearch.set(v);
    this.searchChange.emit(v);
  }

  // Expansion ───────────────────────────────────────────────────────────
  toggleExpanded(row: T, idx: number): void {
    const id = this.rowKeyOf(row, idx);
    const curr = this._expandedIds() ?? this._internalExpanded();
    const next = curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id];
    if (this._expandedIds() === undefined) this._internalExpanded.set(next);
    this.expandedIdsChange.emit(next);
  }

  // Row event handlers ──────────────────────────────────────────────────
  onRowClickInternal(row: T, idx: number, _event: MouseEvent): void {
    if (this._selectable() && this._rowSelectionMode() === "click") this.onToggleRow(row, idx);
    this.rowClick.emit({ row, index: idx });
  }

  onRowDblclickInternal(row: T, idx: number, _event: MouseEvent): void {
    if (this._selectable() && this._rowSelectionMode() === "doubleClick") this.onToggleRow(row, idx);
    this.rowDoubleClick.emit({ row, index: idx });
  }

  // Pagination ──────────────────────────────────────────────────────────
  readonly showSummary = computed(() => {
    const p = this._pagination();
    return Boolean(p && typeof p.total === "number" && typeof p.pageSize === "number");
  });

  readonly summaryFrom = computed(() => {
    const p = this._pagination()!;
    return (p.page - 1) * p.pageSize! + 1;
  });

  readonly summaryTo = computed(() => {
    const p = this._pagination()!;
    return Math.min(p.page * p.pageSize!, p.total!);
  });

  onPageSizeChange(event: Event): void {
    const v = Number((event.target as HTMLSelectElement).value);
    this._pagination()?.onPageSizeChange?.(v);
  }

  // ── Layout / class computeds ──────────────────────────────────────────
  readonly skeletonIndexes = computed(() =>
    Array.from({ length: this._skeletonRows() }, (_, i) => i)
  );

  readonly colCount = computed(
    () =>
      this._columns().length +
      (this._selectable() ? 1 : 0) +
      (this._actionsTemplate() ? 1 : 0) +
      (this._expandable() ? 1 : 0)
  );

  readonly showToolbar = computed(() => this._searchable() || !!this._toolbarTemplate());

  readonly hasFilters = computed(() => Boolean(this._filters() && this._filters()!.length > 0));
  readonly anyFilterActive = computed(() =>
    this.hasFilters() && this._filters()!.some((f) => f.active)
  );

  readonly wrapperClasses = computed(() =>
    `sisyphos-table-wrapper height-${this._heightMode()}`
  );

  readonly tableClasses = computed(() =>
    [
      "sisyphos-table",
      this._size(),
      this._striped() && "striped",
      this._hoverable() && "hoverable",
      this._bordered() && "bordered",
      this._stickyHeader() && "sticky-header",
    ]
      .filter(Boolean)
      .join(" ")
  );

  headerClasses(col: TableColumn<T>): string {
    return [
      `align-${col.align ?? "left"}`,
      col.sortable && "sortable",
      col.className,
    ]
      .filter(Boolean)
      .join(" ");
  }

  cellClasses(col: TableColumn<T>): string {
    return [
      `align-${col.align ?? "left"}`,
      col.truncate && "truncate",
      col.className,
    ]
      .filter(Boolean)
      .join(" ");
  }

  rowClasses(row: T, idx: number): string {
    const interactive =
      (this._selectable() && this._rowSelectionMode() !== "checkbox") ||
      this.rowClick.observed;
    return [
      this.isSelected(row, idx) && "selected",
      interactive && "clickable",
      this._rowClassName()?.(row, idx),
    ]
      .filter(Boolean)
      .join(" ");
  }

  filterClasses(f: TableFilterField): string {
    return ["sisyphos-table-filter", f.active && "active"].filter(Boolean).join(" ");
  }
}
