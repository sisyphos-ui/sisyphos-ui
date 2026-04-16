# @sisyphos-ui/form-control

Compound primitive that wires `id`, `aria-labelledby`, `aria-describedby`, and required/disabled state across a label, an input, and helper / error text.

Use it whenever you need to compose a form field by hand. Sisyphos's higher-level inputs (Input, Textarea, Select, …) already ship with their own label and error rendering — `FormControl` is the primitive you reach for when you're building custom layouts.

## Install

```bash
pnpm add @sisyphos-ui/form-control
```

## Usage

```tsx
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorText,
} from "@sisyphos-ui/form-control";

<FormControl required error={!!err} disabled={loading}>
  <FormLabel>Email</FormLabel>
  <input {...register("email")} />
  <FormHelperText>We'll never share it.</FormHelperText>
  <FormErrorText>{err}</FormErrorText>
</FormControl>
```

`FormHelperText` hides automatically when `error` is `true`; `FormErrorText` shows only when `error` is `true`.

## API

| Component | Notes |
|-----------|-------|
| `FormControl` | Wraps the field, generates ids, exposes the context. Props: `id`, `required`, `disabled`, `readOnly`, `error`, `fullWidth`. |
| `FormLabel` | Auto-links to the field via `htmlFor`. Adds a red `*` when `required`. |
| `FormHelperText` | Description for the field; hidden when `error` is `true`. |
| `FormErrorText` | `role="alert"`; only renders when `error` is `true`. |
| `useFormControl()` | Read-only access to the context — useful for custom inputs. Returns `null` outside `<FormControl>`. |

## Accessibility

- The input must read `aria-describedby` from `useFormControl()` to be linked to helper / error text — Sisyphos's own inputs do this automatically.
- The label is connected via `htmlFor={ctx.id}`; the input must use the same `id`.
