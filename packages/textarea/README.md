# @sisyphos-ui/textarea

Multiline text input with label/error, auto-resize, and character count.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/textarea/styles.css";
import { Textarea } from "@sisyphos-ui/textarea";

<Textarea label="Description" placeholder="Write something…" />

<Textarea
  label="Bio"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  maxLength={280}
  showCharacterCount
  autoResize
  minRows={2}
  maxRows={8}
/>

<Textarea label="Notes" error errorMessage="Required" />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"standard" \| "outlined" \| "underline"` | `"outlined"` |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` |
| `radius` | `Scale` | `"sm"` |
| `label` | `string` | – |
| `error` | `boolean` | `false` |
| `errorMessage` | `string` | – |
| `maxLength` | `number` | – |
| `showCharacterCount` | `boolean` | `false` |
| `autoResize` | `boolean` | `false` |
| `minRows` | `number` | `3` |
| `maxRows` | `number` | – |
| `resize` | `"none" \| "vertical" \| "horizontal" \| "both"` | `"vertical"` |
| `fullWidth` | `boolean` | `false` |

Supports both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`).
