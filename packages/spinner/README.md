# @sisyphos-ui/spinner

Minimal `Spinner` primitive + `LoadingOverlay` (fullscreen / overlay / inline) with portal-based fullscreen rendering.

## Install

```bash
pnpm add @sisyphos-ui/spinner
```

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/spinner/styles.css";
import { Spinner, LoadingOverlay } from "@sisyphos-ui/spinner";
```

## Usage

```tsx
<Spinner size="md" color="primary" />

{/* Inside a Button */}
<button><Spinner size="sm" color="inherit" /> Saving…</button>

<LoadingOverlay variant="fullscreen" text="Loading dashboard…" />

{/* Scoped overlay */}
<div style={{ position: "relative" }}>
  {isFetching && <LoadingOverlay variant="overlay" />}
  <Table data={...} />
</div>

{/* Brand icon instead of default spinner */}
<LoadingOverlay
  variant="fullscreen"
  icon={<BrandLogo animating />}
  text="Initializing…"
/>
```

## `<Spinner>` props

| Prop | Type | Default |
|------|------|---------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` |
| `color` | `"primary" \| "success" \| "error" \| "warning" \| "info" \| "neutral" \| "inherit"` | `"primary"` |
| `thickness` | `number` | `3` |
| `label` | `string` | `"Loading"` |

Rendered as `<span role="status" aria-label={label} />`.

## `<LoadingOverlay>` props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"fullscreen" \| "overlay" \| "inline"` | `"inline"` |
| `open` | `boolean` | `true` |
| `text` | `ReactNode` | – |
| `icon` | `ReactNode` | default `<Spinner size="lg" />` |
| `spinnerProps` | `SpinnerProps` | – |
| `blur` | `boolean` | `true` |

`fullscreen` mounts through `@sisyphos-ui/portal`.
