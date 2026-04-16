# @sisyphos-ui/chip

Compact label/tag component with optional avatar, icons, and delete button.

## Install

```bash
pnpm add @sisyphos-ui/chip
# or the umbrella:
pnpm add @sisyphos-ui/ui
```

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/chip/styles.css";
import { Chip } from "@sisyphos-ui/chip";
```

## Usage

```tsx
<Chip>Default</Chip>
<Chip variant="outlined" color="success">Active</Chip>
<Chip variant="contained" color="error" onDelete={() => remove(id)}>Removable</Chip>
<Chip avatar={<img src={user.avatar} />}>{user.name}</Chip>
<Chip clickable onClick={select}>Selectable</Chip>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"contained" \| "outlined" \| "soft"` | `"soft"` | Visual style |
| `color` | `"primary" \| "success" \| "error" \| "warning" \| "info"` | `"primary"` | Semantic color |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Scale |
| `radius` | `"xxs" \| "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "full"` | `"full"` | Border radius |
| `avatar` | `ReactNode` | – | 24×24 circular slot before label |
| `startIcon` | `ReactNode` | – | Icon before label (ignored when `avatar` set) |
| `endIcon` | `ReactNode` | – | Icon after label (ignored when `onDelete` set) |
| `onDelete` | `(e) => void` | – | Adds a dedicated delete button |
| `deleteAriaLabel` | `string` | `"Remove"` | Accessible name for delete button |
| `clickable` | `boolean` | `false` | Makes the chip itself a button (keyboard + role) |
| `disabled` | `boolean` | `false` | Disable interactions |

## Accessibility

- Delete button is a separate `<button>` with `aria-label`; delete click does not bubble to chip `onClick`.
- Clickable chips get `role="button"`, `tabIndex=0`, Enter/Space activation.
- Non-interactive chips are not focusable and have no role.
