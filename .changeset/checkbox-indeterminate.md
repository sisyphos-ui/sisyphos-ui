---
"@sisyphos-ui/checkbox": minor
"@sisyphos-ui/ui": minor
---

`<Checkbox>` gains real tristate support. Pass `indeterminate` to render a horizontal "minus" mark instead of the check; the component sets the DOM `indeterminate` flag and exposes `aria-checked="mixed"` so assistive tech announces the mixed state correctly. Activating an indeterminate checkbox calls `onChange(true)` — the standard "select all" promotion that hierarchical pickers (TreeSelect, multi-row tables) need.

The visual fill matches the configured `color` token in indeterminate state, so the tristate variant looks right across the full primary / success / warning / error / info palette.
