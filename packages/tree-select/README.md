# @sisyphos-ui/tree-select

Tree-structured multi-select with search, cascade selection, and partial state for parent nodes. Portal-mounted dropdown.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/tree-select/styles.css";
import { TreeSelect } from "@sisyphos-ui/tree-select";

const nodes = [
  {
    id: "eng",
    label: "Engineering",
    children: [
      { id: "u1", label: "Volkan" },
      { id: "u2", label: "Ada" },
    ],
  },
  { id: "design", label: "Design", children: [{ id: "u3", label: "Donald" }] },
];

const [v, setV] = useState<(string | number)[]>([]);
<TreeSelect nodes={nodes} value={v} onChange={setV} clearable searchable />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `nodes` | `TreeNode[]` | – |
| `value` / `defaultValue` / `onChange` | `(string \| number)[]` | – |
| `label` / `placeholder` / `triggerLabel` | strings | – |
| `error` / `errorMessage` | – | – |
| `disabled` / `required` | `boolean` | `false` |
| `searchable` / `searchPlaceholder` | `boolean` / `string` | `true` / `"Search…"` |
| `clearable` | `boolean` | `false` |
| `cascade` | `boolean` (parent toggle selects all descendants) | `true` |
| `maxTagCount` | `number` (tags before "+N more") | `3` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `placement` | `Placement` | `"bottom-start"` |

### `TreeNode`

```ts
interface TreeNode {
  id: string | number;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
}
```

## Selection semantics

- **Cascade on**: toggling a parent selects/deselects all its descendants. The parent's checkbox shows `partial` when only some descendants are selected.
- **Cascade off**: each node is independent.
- Parent partial state is computed automatically from descendant selection.
