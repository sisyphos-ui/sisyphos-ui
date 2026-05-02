---
"@sisyphos-ui/table": minor
"@sisyphos-ui/ui": minor
---

`<Table>` gains a handful of polish features that cover real-world data-table needs without forcing apps to wrap or reimplement the component:

- `truncate` on `TableColumn` clips a cell to one line with an ellipsis. When the cell actually overflows, the rendered text is exposed as a native `title` tooltip so the full value remains discoverable — no extra dependency required.
- `loadingDelay` defers the skeleton until `loading` has stayed `true` for the configured duration, eliminating the flicker you see on fast network responses.
- `rowClassName(row, index)` returns an extra class on the rendered `<tr>`, useful for state-driven highlighting (warning rows, drafts, and so on).
- `onRowDoubleClick(row, index)` is a first-class double-click handler that runs independently of `rowSelectionMode` — so you can wire row activation without losing checkbox-driven selection semantics.

Skeleton placeholder widths now vary across columns for a more realistic loading shimmer.
