# @sisyphos-ui/accordion

Accessible accordion (single or multi-expand) with compound `Accordion.Item` / `Accordion.Trigger` / `Accordion.Content`.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/accordion/styles.css";
import { Accordion } from "@sisyphos-ui/accordion";

<Accordion defaultValue="overview">
  <Accordion.Item value="overview">
    <Accordion.Trigger>Overview</Accordion.Trigger>
    <Accordion.Content>Some content.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="settings">
    <Accordion.Trigger>Settings</Accordion.Trigger>
    <Accordion.Content>More content.</Accordion.Content>
  </Accordion.Item>
</Accordion>

{/* Multi-expand */}
<Accordion multiple defaultValue={["a", "c"]}>…</Accordion>

{/* Controlled */}
<Accordion value={open} onValueChange={setOpen}>…</Accordion>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"outlined" \| "ghost"` | `"outlined"` |
| `multiple` | `boolean` | `false` |
| `value` / `defaultValue` / `onValueChange` | depends on `multiple` | – |

`Trigger` exposes `aria-expanded` + `aria-controls`; `Content` is `role="region"` linked via `aria-labelledby`. Closed content uses the native `hidden` attribute.
