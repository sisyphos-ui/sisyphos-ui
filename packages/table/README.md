# @sisyphos-ui/table

Generic data table with sorting, selection, loading skeleton, empty state, and a sibling `Pagination` primitive.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/table/styles.css";
import { Table, Pagination, type TableColumn } from "@sisyphos-ui/table";

interface User { id: number; name: string; email: string; role: string }

const columns: TableColumn<User>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "email", header: "Email", accessor: "email" },
  { id: "role", header: "Role", accessor: "role", align: "center" },
];

<Table
  data={users}
  columns={columns}
  rowKey={(u) => u.id}
  hoverable
  striped
  selectable
  selectedIds={selected}
  onSelectionChange={setSelected}
  sort={sort ?? undefined}
  onSortChange={setSort}
  actions={(u) => <button onClick={() => edit(u)}>Edit</button>}
/>

<Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
```

## `<Table>` props

| Prop | Type | Default |
|------|------|---------|
| `data` | `T[]` | – |
| `columns` | `TableColumn<T>[]` | – |
| `rowKey` | `(row, index) => string \| number` | index |
| `loading` | `boolean` | `false` |
| `skeletonRows` | `number` | `5` |
| `empty` | `ReactNode` | `"No data"` |
| `selectable` | `boolean` | `false` |
| `selectedIds` / `onSelectionChange` | controlled selection | – |
| `sort` / `onSortChange` | controlled sort | – |
| `actions` | `(row, index) => ReactNode` | – |
| `actionsHeader` | `ReactNode` | `"Actions"` |
| `onRowClick` | `(row, index) => void` | – |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `striped` | `boolean` | `false` |
| `hoverable` | `boolean` | `true` |
| `bordered` | `boolean` | `false` |
| `stickyHeader` | `boolean` | `false` |

### `TableColumn<T>`

| Field | Notes |
|-------|------|
| `id` | required, unique |
| `header` | `ReactNode` |
| `accessor` | `keyof T` or `(row) => ReactNode` |
| `render` | `(row) => ReactNode` (overrides `accessor`) |
| `sortable` / `sortKey` | enable sort cycle |
| `align` | `"left" \| "center" \| "right"` |
| `width` / `style` / `className` | layout extras |

## `<Pagination>` props

| Prop | Type | Default |
|------|------|---------|
| `page` | `number` (1-based) | – |
| `pageCount` | `number` | – |
| `onPageChange` | `(page) => void` | – |
| `siblings` | `number` | `1` |
| `boundaries` | `number` | `1` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |

`Pagination` and `Table` are decoupled — combine as you like with or without `<TablePagination>`-style helpers.
