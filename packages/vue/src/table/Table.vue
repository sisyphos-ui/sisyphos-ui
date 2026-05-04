<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref, watch } from "vue";
import Pagination from "./Pagination.vue";
import type { RowId, SortState, TableColumn, TablePaginationConfig, TableFilterField } from "./types";

const props = withDefaults(defineProps<{
  data: T[];
  columns: TableColumn<T>[];
  rowKey?: (row: T, index: number) => RowId;
  loading?: boolean;
  skeletonRows?: number;
  loadingDelay?: number;
  empty?: string;
  selectable?: boolean;
  selectedIds?: RowId[];
  rowSelectionMode?: "checkbox" | "click" | "doubleClick";
  sort?: SortState;
  actionsHeader?: string;
  filters?: TableFilterField[];
  showClearAllFilters?: boolean;
  heightMode?: "auto" | "flex" | "content";
  searchable?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  searchPlaceholder?: string;
  expandable?: boolean;
  expandedIds?: RowId[];
  defaultExpandedIds?: RowId[];
  rowExpandable?: (row: T, index: number) => boolean;
  pagination?: TablePaginationConfig;
  size?: "sm" | "md" | "lg";
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  stickyHeader?: boolean;
  className?: string;
}>(), {
  loading: false,
  skeletonRows: 5,
  loadingDelay: 0,
  empty: "No data",
  selectable: false,
  selectedIds: () => [],
  rowSelectionMode: "checkbox",
  actionsHeader: "Actions",
  showClearAllFilters: false,
  heightMode: "auto",
  searchable: false,
  defaultSearchValue: "",
  searchPlaceholder: "Search…",
  expandable: false,
  defaultExpandedIds: () => [],
  size: "md",
  striped: false,
  hoverable: true,
  bordered: false,
  stickyHeader: false,
});

const emit = defineEmits<{
  (e: "update:selectedIds", ids: RowId[]): void;
  (e: "update:sort", sort: SortState | null): void;
  (e: "update:searchValue", value: string): void;
  (e: "update:expandedIds", ids: RowId[]): void;
  (e: "rowClick", row: T, index: number): void;
  (e: "rowDoubleClick", row: T, index: number): void;
  (e: "rowContextMenu", event: MouseEvent, row: T, index: number): void;
  (e: "filterClear", key: string): void;
  (e: "clearAllFilters"): void;
}>();

// Slots
defineSlots<{
  actions(props: { row: T; index: number }): unknown;
  expanded(props: { row: T; index: number }): unknown;
  filterControl(props: { filter: TableFilterField }): unknown;
  toolbar(): unknown;
}>();

const getId = (row: T, idx: number): RowId => (props.rowKey ? props.rowKey(row, idx) : idx);

// Selection
const allSelected = computed(
  () => props.data.length > 0 && props.data.every((r, i) => props.selectedIds!.includes(getId(r, i)))
);
const someSelected = computed(
  () => !allSelected.value && props.data.some((r, i) => props.selectedIds!.includes(getId(r, i)))
);

const headerCheckRef = ref<HTMLInputElement | null>(null);
watch(someSelected, (val) => {
  if (headerCheckRef.value) headerCheckRef.value.indeterminate = val;
}, { immediate: true });

function toggleAll(checked: boolean) {
  emit("update:selectedIds", checked ? props.data.map((r, i) => getId(r, i)) : []);
}
function toggleRow(row: T, idx: number) {
  const id = getId(row, idx);
  const next = props.selectedIds!.includes(id)
    ? props.selectedIds!.filter((x) => x !== id)
    : [...props.selectedIds!, id];
  emit("update:selectedIds", next);
}

// Sort
function handleSort(col: TableColumn<T>) {
  if (!col.sortable) return;
  const key = col.sortKey ?? col.id;
  if (props.sort?.key !== key) emit("update:sort", { key, direction: "asc" });
  else if (props.sort.direction === "asc") emit("update:sort", { key, direction: "desc" });
  else emit("update:sort", null);
}

// Search
const internalSearch = ref(props.defaultSearchValue);
const currentSearch = computed(() =>
  props.searchValue !== undefined ? props.searchValue : internalSearch.value
);
function handleSearchInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  internalSearch.value = val;
  emit("update:searchValue", val);
}

// Expand
const internalExpanded = ref<RowId[]>(props.defaultExpandedIds);
const expandedIds = computed(() =>
  props.expandedIds !== undefined ? props.expandedIds : internalExpanded.value
);
function toggleExpanded(id: RowId) {
  const next = expandedIds.value.includes(id)
    ? expandedIds.value.filter((x) => x !== id)
    : [...expandedIds.value, id];
  internalExpanded.value = next;
  emit("update:expandedIds", next);
}

// Loading delay
const showSkeleton = ref(props.loading && props.loadingDelay <= 0);
let skeletonTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  () => props.loading,
  (loading) => {
    if (skeletonTimer) clearTimeout(skeletonTimer);
    if (!loading) { showSkeleton.value = false; return; }
    if (props.loadingDelay <= 0) { showSkeleton.value = true; return; }
    skeletonTimer = setTimeout(() => { showSkeleton.value = true; }, props.loadingDelay);
  },
  { immediate: true }
);

const colCount = computed(
  () => props.columns.length + (props.selectable ? 1 : 0) + (props.expandable ? 1 : 0)
);

function getCellValue(col: TableColumn<T>, row: T): unknown {
  if (col.render) return col.render(row);
  if (typeof col.accessor === "function") return col.accessor(row);
  return row[col.accessor as keyof T];
}

function getSortAria(col: TableColumn<T>): "ascending" | "descending" | "none" | undefined {
  if (!col.sortable) return undefined;
  const key = col.sortKey ?? col.id;
  if (props.sort?.key !== key) return "none";
  return props.sort.direction === "asc" ? "ascending" : "descending";
}

const hasFilters = computed(() => Boolean(props.filters && props.filters.length > 0));
const anyFilterActive = computed(() => hasFilters.value && props.filters!.some((f) => f.active));

// Pagination
function handlePageChange(page: number) {
  props.pagination?.onPageChange(page);
}

function handlePageSizeChange(e: Event) {
  const val = Number((e.target as HTMLSelectElement).value);
  props.pagination?.onPageSizeChange?.(val);
}

const paginationFrom = computed(() => {
  const p = props.pagination;
  if (!p || typeof p.total !== "number" || typeof p.pageSize !== "number") return 0;
  return (p.page - 1) * p.pageSize + 1;
});
const paginationTo = computed(() => {
  const p = props.pagination;
  if (!p || typeof p.total !== "number" || typeof p.pageSize !== "number") return 0;
  return Math.min(p.page * p.pageSize, p.total);
});
</script>

<template>
  <div :class="['sisyphos-table-wrapper', `height-${heightMode}`, className]">
    <!-- Toolbar -->
    <div v-if="searchable || $slots.toolbar" class="sisyphos-table-toolbar">
      <div v-if="searchable" class="sisyphos-table-search">
        <span class="sisyphos-table-search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M10 18a8 8 0 115.29-14A8 8 0 0110 18zm11 3l-5.2-5.2a10 10 0 10-1.4 1.4L19.6 22.4z" fill="currentColor" />
          </svg>
        </span>
        <input
          type="search"
          role="searchbox"
          class="sisyphos-table-search-input"
          :placeholder="searchPlaceholder"
          :value="currentSearch"
          :aria-label="searchPlaceholder"
          @input="handleSearchInput"
        />
      </div>
      <div v-if="$slots.toolbar" class="sisyphos-table-toolbar-extras">
        <slot name="toolbar" />
      </div>
    </div>

    <!-- Filters -->
    <div v-if="hasFilters" class="sisyphos-table-filters">
      <div
        v-for="f in filters"
        :key="f.key"
        :class="['sisyphos-table-filter', f.active && 'active']"
      >
        <span v-if="f.label" class="sisyphos-table-filter-label">{{ f.label }}</span>
        <div class="sisyphos-table-filter-control">
          <slot name="filterControl" :filter="f" />
        </div>
        <button
          v-if="f.active"
          type="button"
          class="sisyphos-table-filter-clear"
          :aria-label="`Clear ${f.label ?? f.key}`"
          @click="emit('filterClear', f.key)"
        >×</button>
      </div>
      <button
        v-if="showClearAllFilters && anyFilterActive"
        type="button"
        class="sisyphos-table-filter-clear-all"
        @click="emit('clearAllFilters')"
      >Clear all</button>
    </div>

    <!-- Table -->
    <div class="sisyphos-table-scroll">
      <table
        :class="[
          'sisyphos-table',
          size,
          striped && 'striped',
          hoverable && 'hoverable',
          bordered && 'bordered',
          stickyHeader && 'sticky-header',
        ]"
      >
        <thead>
          <tr>
            <th v-if="expandable" class="sisyphos-table-expand-cell" aria-hidden="true" />
            <th v-if="selectable" class="sisyphos-table-select-cell">
              <input
                ref="headerCheckRef"
                type="checkbox"
                aria-label="Select all rows"
                :checked="allSelected"
                :disabled="data.length === 0"
                @change="toggleAll(($event.target as HTMLInputElement).checked)"
              />
            </th>
            <th
              v-for="col in columns"
              :key="col.id"
              scope="col"
              :class="[`align-${col.align ?? 'left'}`, col.sortable && 'sortable', col.className]"
              :style="col.width ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width } : undefined"
              :aria-sort="getSortAria(col)"
              @click="handleSort(col)"
            >
              <span class="sisyphos-table-header-content">
                {{ col.header }}
                <svg v-if="col.sortable" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                  <path
                    d="M8 2l4 5H4l4-5zM8 14l-4-5h8l-4 5z"
                    fill="currentColor"
                    :opacity="sort?.key === (col.sortKey ?? col.id) ? 1 : 0.4"
                    :transform="sort?.key === (col.sortKey ?? col.id) && sort?.direction === 'desc' ? 'rotate(180 8 8)' : undefined"
                  />
                </svg>
              </span>
            </th>
            <th v-if="$slots.actions" class="sisyphos-table-actions-cell">{{ actionsHeader }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Skeleton -->
          <template v-if="showSkeleton">
            <tr v-for="i in skeletonRows" :key="`sk-${i}`" class="sisyphos-table-skeleton-row">
              <td v-if="expandable" class="sisyphos-table-expand-cell" />
              <td v-if="selectable" class="sisyphos-table-select-cell">
                <span class="sisyphos-table-skeleton" />
              </td>
              <td v-for="(col, ci) in columns" :key="col.id" :class="`align-${col.align ?? 'left'}`">
                <span :class="['sisyphos-table-skeleton', `width-${ci % 3}`]" />
              </td>
              <td v-if="$slots.actions">
                <span class="sisyphos-table-skeleton width-actions" />
              </td>
            </tr>
          </template>

          <!-- Empty -->
          <tr v-else-if="data.length === 0">
            <td class="sisyphos-table-empty" :colspan="colCount">{{ empty }}</td>
          </tr>

          <!-- Data rows -->
          <template v-else>
            <template v-for="(row, i) in data" :key="String(getId(row, i))">
              <tr
                :class="[
                  selectedIds?.includes(getId(row, i)) && 'selected',
                  (rowSelectionMode !== 'checkbox' || $slots.actions) && 'clickable',
                ]"
                :aria-selected="selectedIds?.includes(getId(row, i)) || undefined"
                @click="() => {
                  if (selectable && rowSelectionMode === 'click') toggleRow(row, i);
                  emit('rowClick', row, i);
                }"
                @dblclick="() => {
                  if (selectable && rowSelectionMode === 'doubleClick') toggleRow(row, i);
                  emit('rowDoubleClick', row, i);
                }"
                @contextmenu="(e) => emit('rowContextMenu', e, row, i)"
              >
                <td
                  v-if="expandable"
                  class="sisyphos-table-expand-cell"
                  @click.stop
                >
                  <button
                    v-if="!rowExpandable || rowExpandable(row, i)"
                    type="button"
                    class="sisyphos-table-expand-button"
                    :aria-expanded="expandedIds.includes(getId(row, i))"
                    :aria-label="expandedIds.includes(getId(row, i)) ? 'Collapse row' : 'Expand row'"
                    @click="toggleExpanded(getId(row, i))"
                  >
                    <svg
                      viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"
                      :class="['sisyphos-table-expand-chevron', expandedIds.includes(getId(row, i)) && 'open']"
                    >
                      <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </td>
                <td
                  v-if="selectable"
                  class="sisyphos-table-select-cell"
                  @click.stop
                >
                  <input
                    type="checkbox"
                    :aria-label="`Select row ${i + 1}`"
                    :checked="selectedIds?.includes(getId(row, i))"
                    @change="toggleRow(row, i)"
                  />
                </td>
                <td
                  v-for="col in columns"
                  :key="col.id"
                  :class="[`align-${col.align ?? 'left'}`, col.truncate && 'truncate', col.className]"
                >
                  <div v-if="col.truncate" class="sisyphos-table-cell-truncate">
                    {{ getCellValue(col, row) }}
                  </div>
                  <template v-else>{{ getCellValue(col, row) }}</template>
                </td>
                <td
                  v-if="$slots.actions"
                  class="sisyphos-table-actions-cell"
                  @click.stop
                >
                  <slot name="actions" :row="row" :index="i" />
                </td>
              </tr>
              <tr
                v-if="expandable && expandedIds.includes(getId(row, i)) && (!rowExpandable || rowExpandable(row, i))"
                class="sisyphos-table-expanded-row"
              >
                <td :colspan="colCount">
                  <slot name="expanded" :row="row" :index="i" />
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Footer / Pagination -->
    <div v-if="pagination" class="sisyphos-table-footer">
      <div class="sisyphos-table-footer-summary">
        <template v-if="typeof pagination.total === 'number' && typeof pagination.pageSize === 'number'">
          Showing {{ paginationFrom }}–{{ paginationTo }} of {{ pagination.total }}
        </template>
      </div>
      <Pagination
        :page="pagination.page"
        :page-count="pagination.pageCount"
        :siblings="pagination.siblings"
        :boundaries="pagination.boundaries"
        @change="handlePageChange"
      />
      <label v-if="pagination.pageSizeOptions?.length" class="sisyphos-table-footer-pagesize">
        <span class="sisyphos-table-footer-pagesize-label">Rows</span>
        <select
          class="sisyphos-table-footer-pagesize-select"
          :value="String(pagination.pageSize ?? pagination.pageSizeOptions[0])"
          @change="handlePageSizeChange"
        >
          <option v-for="n in pagination.pageSizeOptions" :key="n" :value="n">{{ n }}</option>
        </select>
      </label>
    </div>
  </div>
</template>

<style src="./Table.scss"></style>
