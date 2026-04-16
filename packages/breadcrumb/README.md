# @sisyphos-ui/breadcrumb

Accessible breadcrumb navigation with optional middle collapse and custom separator.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/breadcrumb/styles.css";
import { Breadcrumb } from "@sisyphos-ui/breadcrumb";

<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Sisyphos UI" },
  ]}
/>

{/* Collapsed */}
<Breadcrumb maxItems={3} items={[…]} />

{/* Custom separator + icon */}
<Breadcrumb
  separator={<ChevronRight />}
  items={[{ label: "Home", icon: <HomeIcon />, href: "/" }, …]}
/>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `items` | `BreadcrumbItem[]` | – |
| `separator` | `ReactNode` | `"/"` |
| `maxItems` | `number` | – (no collapse) |
| `itemsBeforeCollapse` | `number` | `1` |
| `itemsAfterCollapse` | `number` | `1` |

### `BreadcrumbItem`

| Field | Type |
|-------|------|
| `label` | `ReactNode` (required) |
| `href` | `string` |
| `onClick` | `(e) => void` |
| `icon` | `ReactNode` |
| `key` | `string` |

The last item always renders as `aria-current="page"` text (not a link/button).
