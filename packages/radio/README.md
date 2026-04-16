# @sisyphos-ui/radio

Compound `RadioGroup` + `Radio` with controlled/uncontrolled state, `standard`/`card` variants, 5 sizes, semantic colors.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/radio/styles.css";
import { Radio, RadioGroup } from "@sisyphos-ui/radio";

<RadioGroup label="Plan" defaultValue="basic">
  <Radio value="basic" label="Basic" />
  <Radio value="pro" label="Pro" />
  <Radio value="enterprise" label="Enterprise" disabled />
</RadioGroup>

{/* Controlled */}
<RadioGroup value={plan} onChange={setPlan}>…</RadioGroup>

{/* Card variant with descriptions */}
<RadioGroup variant="card" label="Billing">
  <Radio value="monthly" label="Monthly" description="$10/mo" />
  <Radio value="yearly" label="Yearly" description="$96/yr" />
</RadioGroup>
```

## `<RadioGroup>` props

| Prop | Type | Default |
|------|------|---------|
| `value` / `defaultValue` | `string \| number` | – |
| `onChange` | `(value) => void` | – |
| `name` | `string` | auto-generated |
| `label` | `string` | – |
| `error` / `errorMessage` | `boolean` / `string` | – |
| `required` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `direction` | `"vertical" \| "horizontal"` | `"vertical"` |
| `size` | `Scale` | `"md"` |
| `color` | `SemanticColor` | `"primary"` |
| `variant` | `"standard" \| "card"` | `"standard"` |

## `<Radio>` props

| Prop | Type |
|------|------|
| `value` | `string \| number` (required) |
| `label` | `ReactNode` |
| `description` | `ReactNode` |
| `icon` | `ReactNode` |
| `disabled` | `boolean` |

`<Radio>` throws outside `<RadioGroup>`. Selection is group-managed.
