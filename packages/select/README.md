# @sisyphos-ui/select

Single/multi select form control with search, clearable, creatable, and infinite scroll. Portal-mounted listbox with keyboard navigation.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/select/styles.css";
import { Select } from "@sisyphos-ui/select";

<Select
  label="Country"
  options={[
    { value: "tr", label: "Türkiye" },
    { value: "us", label: "United States" },
  ]}
  value={country}
  onChange={setCountry}
  searchable
  clearable
/>

{/* Multiple */}
<Select
  multiple
  label="Tags"
  options={tags}
  value={selected}
  onChange={setSelected}
  creatable
  searchable
/>

{/* Server-side search + infinite scroll */}
<Select
  searchable
  options={options}
  onSearch={term => fetchOptions(term)}
  onLoadMore={fetchNext}
  hasMore={hasMore}
  loading={loading}
/>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `options` | `SelectOption[]` | `[]` |
| `value` / `defaultValue` | `SelectValue \| SelectValue[] \| null` | – |
| `onChange` | depends on `multiple` | – |
| `multiple` | `boolean` | `false` |
| `placeholder` | `string` | `"Select…"` |
| `label` | `string` | – |
| `helperText` / `error` / `errorMessage` | – | – |
| `size` | `Scale` | `"md"` |
| `radius` | `Scale` | `"sm"` |
| `fullWidth` | `boolean` | `false` |
| `searchable` | `boolean` | `false` |
| `onSearch` | `(term: string) => void` | – (server-side filter) |
| `filterOption` | `(opt, term) => boolean` | default (label includes) |
| `clearable` | `boolean` | `false` |
| `creatable` | `boolean` | `false` (multi only) |
| `loading` | `boolean` | `false` |
| `onLoadMore` / `hasMore` | infinite scroll | – |
| `placement` | `Placement` | `"bottom-start"` |

### Keyboard

| Key | Action |
|-----|--------|
| ArrowDown / ArrowUp | Move active option |
| Home / End | First / last option |
| Enter | Select active option (or create value when `creatable`) |
| Escape | Close listbox |
| Space (closed) | Open listbox |

Roles: `combobox` on the trigger, `listbox` on the panel, `option` on items — fully ARIA 1.2 compliant.
