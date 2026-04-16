# @sisyphos-ui/toast

Imperative toast notifications backed by a tiny pub/sub store. Mount `<Toaster />` once at the app root, then call `toast.*` from anywhere.

## Usage

```tsx
// App.tsx — mount the container once
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/toast/styles.css";
import { Toaster } from "@sisyphos-ui/toast";

<Toaster position="top-right" />

// Anywhere — fire toasts
import { toast } from "@sisyphos-ui/toast";

toast("Simple notification");
toast.success("Changes saved", { description: "All fields synced." });
toast.error("Save failed", { description: "Network error.", duration: 6000 });
toast.warning("Storage almost full");
toast.info("Update ready", {
  action: <button onClick={reload}>Reload</button>,
  duration: Infinity, // persist until dismissed
});

const id = toast("Uploading…", { dismissible: false, duration: Infinity });
// later:
toast.dismiss(id);
toast.clear();
```

## `<Toaster>` props

| Prop | Type | Default |
|------|------|---------|
| `position` | `"top-left" \| "top-center" \| "top-right" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | `"bottom-right"` |
| `max` | `number` | `5` |
| `gap` | `number` | `8` |

## `toast(...)` API

```ts
toast(title, options?): string           // id
toast.success(title, options?): string
toast.error(title, options?): string
toast.warning(title, options?): string
toast.info(title, options?): string
toast.custom(options): string
toast.dismiss(id): void
toast.clear(): void
```

### `ToastOptions`

| Field | Type | Default |
|-------|------|---------|
| `title` | `ReactNode` | – |
| `description` | `ReactNode` | – |
| `icon` | `ReactNode \| null` | default per type; `null` hides |
| `duration` | `number` (ms) | `4000` (use `Infinity` to persist) |
| `action` | `ReactNode` | – |
| `dismissible` | `boolean` | `true` |
| `onDismiss` | `(id) => void` | – |
| `id` | `string` | auto — pass the same id to update an existing toast |

## Accessibility

- `role="alert"` + `aria-live="assertive"` for `error` toasts — screen readers interrupt.
- `role="status"` + `aria-live="polite"` for everything else.
- Hover pauses the auto-dismiss timer.
