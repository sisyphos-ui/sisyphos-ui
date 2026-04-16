# @sisyphos-ui/button

Polymorphic, accessible button with semantic colors, four variants, five sizes, loading state, optional dropdown, and `href` support.

## Install

```bash
pnpm add @sisyphos-ui/button @sisyphos-ui/core
# or: npm install / yarn add
```

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/button/styles.css";
import { Button } from "@sisyphos-ui/button";
```

## Usage

```tsx
<Button>Default</Button>
<Button variant="outlined" color="success">Confirm</Button>
<Button variant="soft" color="error">Delete</Button>
<Button variant="text">Cancel</Button>

<Button startIcon={<PlusIcon />}>New</Button>
<Button loading>Saving…</Button>
<Button disabled>Unavailable</Button>

{/* Renders as <a> when href is present */}
<Button href="/settings">Settings</Button>

{/* Inline split-button menu */}
<Button
  dropdownItems={[
    { label: "Duplicate", onClick: () => {} },
    { label: "Archive", onClick: () => {} },
  ]}
>
  Actions
</Button>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"contained" \| "outlined" \| "text" \| "soft"` | `"contained"` |
| `color` | `"primary" \| "success" \| "error" \| "warning" \| "info"` | `"primary"` |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` |
| `radius` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` |
| `startIcon` / `endIcon` | `ReactNode` | – |
| `loading` | `boolean` | `false` |
| `loadingPosition` | `"start" \| "center" \| "end"` | `"start"` |
| `loadingIndicator` | `ReactNode` | built-in spinner |
| `fullWidth` | `boolean` | `false` |
| `href` | `string` | – (renders as `<a>` when set) |
| `dropdownItems` | `ButtonDropdownItem[]` | – |
| `dropdownPosition` | `"top" \| "bottom"` | `"bottom"` |

All other native `<button>` / `<a>` attributes are forwarded.

## Accessibility

- `aria-busy` while loading; click is suppressed.
- `aria-disabled` mirrors `disabled`.
- Dropdown menu uses `aria-haspopup="menu"` + `aria-expanded`; items expose `role="menuitem"` and respond to Enter/Space.
- When `href` is set the trigger renders as `<a>`; the disabled state strips `href` and applies `tabIndex={-1}` so the link is unreachable.
