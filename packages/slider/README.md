# @sisyphos-ui/slider

Single-thumb or range slider with mouse, touch, and keyboard support. Semantic colors, three sizes, accessible.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/slider/styles.css";
import { Slider } from "@sisyphos-ui/slider";

const [v, setV] = useState(40);
<Slider value={v} onChange={setV} min={0} max={100} ariaLabel="Volume" />

{/* Range */}
const [r, setR] = useState<[number, number]>([20, 80]);
<Slider range value={r} onChange={setR} ariaLabel={["From", "To"]} minGap={5} />

{/* Show value labels */}
<Slider value={v} onChange={setV} showValue formatValue={(n) => `${n}%`} />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `number` (single) or `[number, number]` (range) | – |
| `defaultValue` | same | – |
| `onChange` | `(value) => void` | – |
| `range` | `boolean` | `false` |
| `min` / `max` / `step` | `number` | `0` / `100` / `1` |
| `minGap` (range) | `number` | `0` |
| `disabled` | `boolean` | `false` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `color` | `SemanticColor` | `"primary"` |
| `showValue` | `boolean` | `false` |
| `formatValue` | `(value: number) => string` | `String` |
| `ariaLabel` | `string` (single) or `[string, string]` (range) | – |

## Keyboard

| Key | Action |
|-----|--------|
| ArrowRight / ArrowUp | + step |
| ArrowLeft / ArrowDown | − step |
| PageUp / PageDown | ± step × 10 |
| Home | thumb-min boundary |
| End | thumb-max boundary |
