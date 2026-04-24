---
"@sisyphos-ui/table": minor
---

Added `rowSelectionMode` and `onRowContextMenu` to `<Table>`.

- `rowSelectionMode`: `"checkbox"` (default, unchanged), `"click"` (single click anywhere on the row toggles selection), or `"doubleClick"` (double-click toggles; single click still fires `onRowClick`). Useful for list-picker UIs where hunting for the checkbox column is annoying.
- `onRowContextMenu(event, row, index)`: fires on right-click of a row. Pairs with the new `<ContextMenu>` component for row-level actions, or any consumer can wire it however they want.
