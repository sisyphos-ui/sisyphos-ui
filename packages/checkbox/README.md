# @sisyphos-ui/checkbox

Accessible checkbox with optional label, semantic colors, and five sizes.

## Install

```bash
pnpm add @sisyphos-ui/checkbox @sisyphos-ui/core
```

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/checkbox/styles.css";
import { Checkbox } from "@sisyphos-ui/checkbox";
```

## Usage

```tsx
const [checked, setChecked] = useState(false);

<Checkbox
  label="I agree to the terms"
  checked={checked}
  onChange={setChecked}
/>

<Checkbox checked={false} color="error" label="Destructive option" />
<Checkbox checked disabled label="Locked" />
<Checkbox checked size="lg" /> {/* label optional */}
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean` | required |
| `onChange` | `(checked: boolean) => void` | – |
| `label` | `ReactNode` | – |
| `color` | `"neutral" \| "primary" \| "success" \| "error" \| "warning" \| "info"` | `"primary"` |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` |
| `radius` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"sm"` |
| `disabled` | `boolean` | `false` |

All other native `<input type="checkbox">` attributes are forwarded.

## Accessibility

- The label is wrapped in a `<label htmlFor={id}>`, making the entire row clickable.
- `aria-checked` mirrors the `checked` state.
- `aria-disabled` is applied alongside the native `disabled` for assistive tech that ignores `disabled`.

## Controlled only

`Checkbox` is controlled — pass both `checked` and `onChange`. For an uncontrolled UX, manage state in the parent with `useState(initialValue)`.
