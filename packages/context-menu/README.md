# @sisyphos-ui/context-menu

Right-click menu anchored at the pointer. Portal-mounted, keyboard-navigable, viewport-clamped.

## Install

```bash
pnpm add @sisyphos-ui/context-menu
```

Already included in `@sisyphos-ui/ui`.

## Usage

```tsx
import { ContextMenu } from "@sisyphos-ui/context-menu";
import "@sisyphos-ui/context-menu/styles.css";

<ContextMenu
  items={[
    { label: "Edit", onSelect: () => edit(row) },
    { label: "Duplicate", onSelect: () => duplicate(row) },
    { type: "separator" },
    { label: "Delete", destructive: true, onSelect: () => remove(row) },
  ]}
>
  <div>Right-click me</div>
</ContextMenu>
```

### Pairing with `<Table>`

```tsx
<Table
  data={rows}
  columns={columns}
  rowKey={(r) => r.id}
  onRowContextMenu={(event, row) => {
    setMenuRow(row);
    setMenuCoords({ x: event.clientX, y: event.clientY });
  }}
/>
```

Or wrap your row in `<ContextMenu>` directly if you only have one row type.

## Items

The `items` array accepts three shapes:

- `{ label, onSelect, icon?, shortcut?, disabled?, destructive? }` — a regular action.
- `{ type: "separator" }` — a divider.
- `{ type: "label", label }` — a non-interactive section header.

`shortcut` accepts `ReactNode` — pair with `<Kbd shortcut="cmd+k" />` for platform-aware glyphs.

## Accessibility

- The menu is keyboard-navigable: `ArrowUp` / `ArrowDown`, `Home` / `End`, `Enter` / `Space` to activate, `Escape` to close, `Tab` to dismiss.
- Items have `role="menuitem"`. Separators have `role="separator"`. The list has `role="menu"`.
- Focus returns to the trigger element when the menu closes.
