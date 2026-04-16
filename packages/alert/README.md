# @sisyphos-ui/alert

Static alert/callout with semantic colors, 3 variants, default icon per color, optional close button and action slot.

> For transient, auto-dismissed notifications use a Toast — `Alert` is persistent by design.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/alert/styles.css";
import { Alert } from "@sisyphos-ui/alert";

<Alert title="Saved" description="Your changes are live." color="success" />

<Alert
  color="warning"
  title="Storage almost full"
  description="Upgrade your plan or clean up old files."
  actions={
    <>
      <Button size="sm">Upgrade</Button>
      <Button size="sm" variant="outlined">Manage</Button>
    </>
  }
  onClose={() => dismiss()}
/>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"contained" \| "outlined" \| "soft"` | `"soft"` |
| `color` | `"primary" \| "success" \| "error" \| "warning" \| "info"` | `"info"` |
| `title` | `ReactNode` | – |
| `description` | `ReactNode` | – |
| `icon` | `ReactNode \| null` | default per `color`; `null` hides |
| `actions` | `ReactNode` | – |
| `onClose` | `(e) => void` | – (shows close button when set) |
| `closeAriaLabel` | `string` | `"Close"` |

Role defaults: `alert` for `color="error"`, `status` otherwise.
