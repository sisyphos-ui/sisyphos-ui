# @sisyphos-ui/number-input

Numeric input with locale-aware formatting, optional `+/-` stepper, prefix/suffix slots, and `min/max/step/precision` constraints.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/number-input/styles.css";
import { NumberInput } from "@sisyphos-ui/number-input";

const [qty, setQty] = useState<number | null>(0);
<NumberInput label="Quantity" value={qty} onChange={setQty} min={0} />

{/* Currency (suffix slot) */}
<NumberInput
  label="Amount"
  value={amount}
  onChange={setAmount}
  step={100}
  suffix="₺"
/>

{/* Decimals + English locale */}
<NumberInput
  label="Price"
  value={price}
  onChange={setPrice}
  precision={2}
  step={0.5}
  locale="en-US"
  suffix="USD"
/>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `value` / `defaultValue` | `number \| null` | – |
| `onChange` | `(value: number \| null) => void` | – |
| `min` / `max` / `step` | `number` | `step=1` |
| `precision` | `number` (decimal places) | `0` |
| `locale` | string (BCP 47) | `"tr-TR"` |
| `numberFormatOptions` | `Intl.NumberFormatOptions` | overrides `precision` |
| `withStepper` | `boolean` | `true` |
| `prefix` / `suffix` | `ReactNode` | – |
| `variant` | `"standard" \| "outlined" \| "underline"` | `"outlined"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `label` | `string` | – |
| `error` / `errorMessage` | `boolean` / `string` | – |
| `fullWidth` | `boolean` | `false` |

Display uses `Intl.NumberFormat` while focused input remains free-form to allow typing. On blur the value is re-formatted. Invalid input falls back to `null`.
