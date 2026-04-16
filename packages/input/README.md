# @sisyphos-ui/input

Accessible text input with three variants, label/error states, start icon, password reveal, and character count.

## Install

```bash
pnpm add @sisyphos-ui/input @sisyphos-ui/core
```

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/input/styles.css";
import { Input } from "@sisyphos-ui/input";
```

## Usage

```tsx
<Input label="Email" type="email" placeholder="name@example.com" />

<Input
  label="Password"
  type="password"
  defaultValue="…"
/>

<Input
  label="Bio"
  maxLength={140}
  showCharacterCount
/>

<Input
  label="Search"
  startIcon={<SearchIcon />}
/>

<Input
  label="Email"
  error
  errorMessage="Please enter a valid email"
/>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"standard" \| "outlined" \| "underline"` | `"standard"` |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` |
| `radius` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"sm"` |
| `label` | `string` | – |
| `error` / `errorMessage` | `boolean` / `string` | – |
| `startIcon` | `ReactNode` | – |
| `showCharacterCount` | `boolean` | `false` (requires `maxLength`) |
| `fullWidth` | `boolean` | `false` |

All other native `<input>` attributes are forwarded.

## Accessibility

- `<label htmlFor={id}>` is auto-linked to the input.
- `aria-invalid` mirrors `error`; the error message is `role="alert"` and referenced via `aria-describedby`.
- The character counter is also referenced via `aria-describedby`.
- For `type="password"`, the reveal toggle has `aria-label` and is `tabIndex={-1}` so it doesn't disrupt tab order.

## Controlled / uncontrolled

Native React semantics — pass `value`+`onChange` for controlled, `defaultValue` for uncontrolled.
