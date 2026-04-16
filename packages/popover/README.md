# @sisyphos-ui/popover

Interactive floating panel with portal rendering, auto-flip, outside-click dismiss, and keyboard support.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/popover/styles.css";
import { Popover } from "@sisyphos-ui/popover";

<Popover content={<HelpContents />}>
  <Button>Help</Button>
</Popover>

{/* Controlled */}
<Popover open={open} onOpenChange={setOpen} content={<Filter />}>
  <Button>Filter</Button>
</Popover>

{/* Hover trigger */}
<Popover trigger="hover" content={<UserCard />}>
  <Avatar name="Volkan" />
</Popover>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `content` | `ReactNode` | – |
| `placement` | `"top" \| "bottom" \| "left" \| "right" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end"` | `"bottom"` |
| `offset` | `number` | `8` |
| `trigger` | `"click" \| "hover" \| "manual"` | `"click"` |
| `openDelay` / `closeDelay` | `number` | `100` / `150` (hover) |
| `arrow` | `boolean` | `true` |
| `open` / `defaultOpen` / `onOpenChange` | controlled/uncontrolled | – |
| `closeOnEscape` / `closeOnOutsideClick` | `boolean` | `true` / `true` |
| `disabled` | `boolean` | `false` |

## Tooltip vs Popover

| | Tooltip | Popover |
|--|--|--|
| Interaction | read-only | interactive |
| Trigger | hover / focus | click (default) / hover / manual |
| Dismissal | mouse leave | outside click / Escape |
| Use for | shortcuts, hints | filters, menus, forms, help |
