# @sisyphos-ui/dropdown-menu

Accessible action menu (menubutton pattern) — click trigger to open a list of actions; arrow-key navigation, Enter/Space to select, Escape/outside click to close. Portal-mounted with auto-flip placement.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/dropdown-menu/styles.css";
import { DropdownMenu } from "@sisyphos-ui/dropdown-menu";

<DropdownMenu
  items={[
    { label: "Edit", icon: <PencilIcon />, onSelect: () => edit() },
    { label: "Duplicate", shortcut: "⌘D", onSelect: () => dup() },
    { type: "separator" },
    { label: "Delete", destructive: true, onSelect: () => remove() },
  ]}
>
  <Button>Actions ▾</Button>
</DropdownMenu>
```

## Item types

```ts
type DropdownMenuItem =
  | { label, icon?, shortcut?, disabled?, destructive?, closeOnSelect?, onSelect }
  | { type: "separator" }
  | { type: "label", label };
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `items` | `DropdownMenuItem[]` | – |
| `placement` | `Placement` | `"bottom-start"` |
| `offset` | `number` | `4` |
| `open` / `defaultOpen` / `onOpenChange` | controlled/uncontrolled | – |
| `disabled` | `boolean` | `false` |

## DropdownMenu vs Select vs Popover

| | DropdownMenu | Select | Popover |
|--|--|--|--|
| Semantics | action menu | form value | arbitrary content |
| Role | `menu` / `menuitem` | `combobox` / `listbox` / `option` | `dialog` |
| Selection | fires callback | binds to value | n/a |

## Keyboard

| Key | Action |
|-----|--------|
| Enter / Space / ArrowDown on trigger | Open |
| ArrowUp / ArrowDown | Move focus |
| Home / End | First / last item |
| Enter / Space | Activate focused item |
| Escape | Close + restore focus to trigger |
| Tab | Close (and let focus continue naturally) |
