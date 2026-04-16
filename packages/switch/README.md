# @sisyphos-ui/switch

Accessible on/off switch with semantic colors and five sizes.

## Install

```bash
pnpm add @sisyphos-ui/switch @sisyphos-ui/core
```

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/switch/styles.css";
import { Switch } from "@sisyphos-ui/switch";
```

## Usage

```tsx
const [enabled, setEnabled] = useState(false);

<Switch
  checked={enabled}
  onChange={setEnabled}
  aria-label="Dark mode"
/>

<Switch checked color="success" aria-label="Notifications" />
<Switch checked={false} disabled aria-label="Beta feature" />
<Switch checked size="lg" aria-label="Auto-sync" />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean` | required |
| `onChange` | `(checked: boolean) => void` | – |
| `color` | `"neutral" \| "primary" \| "success" \| "error" \| "warning" \| "info"` | `"primary"` |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` |
| `disabled` | `boolean` | `false` |
| `aria-label` | `string` | – (required when no visible label) |

All other native `<button>` attributes are forwarded.

## Accessibility

- Renders a `<button role="switch">` with `aria-checked`, the WAI-ARIA pattern for toggle switches.
- Operable with Space and Enter while focused.
- `aria-disabled` mirrors `disabled` for assistive tech that ignores the native attribute.
- **Always provide a name**: pair with a visible `<label>` using a wrapping `<label>` element, or pass `aria-label` / `aria-labelledby`.

## Controlled only

`Switch` is controlled — pass both `checked` and `onChange`. Manage state in the parent (`useState(initialValue)`).
