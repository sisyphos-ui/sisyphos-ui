# @sisyphos-ui/tabs

Compound `Tabs` (`Tabs.List`, `Tabs.Trigger`, `Tabs.Panel`) with roving tabindex, arrow-key navigation, and an animated active indicator.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/tabs/styles.css";
import { Tabs } from "@sisyphos-ui/tabs";

<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
    <Tabs.Trigger value="logs" disabled>Logs</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="overview">…</Tabs.Panel>
  <Tabs.Panel value="settings">…</Tabs.Panel>
  <Tabs.Panel value="logs">…</Tabs.Panel>
</Tabs>

{/* Controlled */}
<Tabs value={tab} onValueChange={setTab}>…</Tabs>

{/* Variants */}
<Tabs variant="pill">…</Tabs>
<Tabs orientation="vertical">…</Tabs>
```

## `<Tabs>` props

| Prop | Type | Default |
|------|------|---------|
| `value` / `defaultValue` / `onValueChange` | controlled or uncontrolled | – |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `variant` | `"underline" \| "pill" \| "soft"` | `"underline"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `fullWidth` | `boolean` | `false` |

## `<Tabs.Trigger>` props

| Prop | Type |
|------|------|
| `value` | `string` (required) |
| `icon` | `ReactNode` |
| `disabled` | `boolean` |

## `<Tabs.Panel>` props

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | required |
| `forceMount` | `boolean` (always render, hide via `hidden`) | `true` |

## Keyboard

| Key | Action |
|-----|--------|
| ArrowRight / ArrowDown | Next tab |
| ArrowLeft / ArrowUp | Previous tab (wraps) |
| Home / End | First / last tab |

ARIA roles: `tablist`, `tab`, `tabpanel`. Selected trigger has `tabindex=0`, others `-1` (roving focus).
