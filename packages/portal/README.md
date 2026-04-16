# @sisyphos-ui/portal

Tiny SSR-safe portal primitive plus two overlay hooks (`useFocusTrap`, `useScrollLock`). Used by every Sisyphos overlay (Tooltip, Popover, Dialog, Toast, DropdownMenu, Select, …).

## Install

```bash
pnpm add @sisyphos-ui/portal
```

## API

```tsx
import { Portal, useFocusTrap, useScrollLock } from "@sisyphos-ui/portal";
```

### `<Portal container?={Element | string}>`

Renders children into the given DOM node or selector. Defaults to `document.body`. SSR-safe — returns `null` until the component mounts on the client.

```tsx
<Portal>
  <div className="my-overlay">…</div>
</Portal>
```

### `useFocusTrap(ref, active?)`

Traps Tab focus within the ref element while `active` is `true`. Restores focus to the previously focused element on unmount or when disabled.

```tsx
const ref = useRef<HTMLDivElement>(null);
useFocusTrap(ref, open);
```

### `useScrollLock(active?)`

Locks `document.body` scroll while `active` is `true`. Reference-counted, so multiple stacked overlays cooperate. Compensates the scrollbar width to avoid layout shift.

```tsx
useScrollLock(modalOpen);
```

## Why a dedicated package

Overlays must not import each other. Centralising portal + focus trap + scroll lock in one zero-dependency package keeps the dependency graph flat and the bundle small.
