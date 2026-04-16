# @sisyphos-ui/tooltip

Accessible tooltip with portal rendering, auto-flip placement, and keyboard support.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/tooltip/styles.css";
import { Tooltip } from "@sisyphos-ui/tooltip";

<Tooltip content="Search (⌘K)">
  <button>Search</button>
</Tooltip>

<Tooltip content="Delete" placement="bottom-end" openDelay={0}>
  <IconButton icon={<TrashIcon />} />
</Tooltip>

{/* Controlled */}
<Tooltip content="Hi" open={open} onOpenChange={setOpen}>
  <button>Target</button>
</Tooltip>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `content` | `ReactNode` | – (falsy disables) |
| `placement` | `"top" \| "bottom" \| "left" \| "right" \| "top-start" \| "top-end" \| "bottom-start" \| "bottom-end"` | `"top"` |
| `offset` | `number` | `8` |
| `openDelay` / `closeDelay` | `number` | `200` / `100` |
| `arrow` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `open` / `onOpenChange` | `boolean` / `(open) => void` | – |

## Behavior

- Portal-mounted (via `@sisyphos-ui/portal`), `z-index: tooltip` token.
- **Auto-flips** to the opposite edge when the chosen placement overflows the viewport.
- Hover + focus triggers (keyboard users get tooltips too).
- Escape closes.
- Adds `aria-describedby` to the child linking the tooltip's `id` — trigger must be a single focusable element.
