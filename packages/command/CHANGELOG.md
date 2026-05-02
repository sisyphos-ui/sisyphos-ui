# @sisyphos-ui/command

## 0.2.1

### Patch Changes

- Updated dependencies [5dadf8c]
  - @sisyphos-ui/core@0.3.0

## 0.2.0

### Minor Changes

- 041628b: Added `<Command>` — a keyboard-first command palette / filterable menu. Compound API: `Command.Input` for typing, `Command.List` for results, `Command.Group` with an optional `heading`, `Command.Item` for selectable rows, `Command.Empty` for no-match states, `Command.Separator` for dividers. Case-insensitive substring filtering out of the box; items that don't match unmount entirely, and groups whose items all unmount hide their heading too. Arrow-up/down (wrapping), Home/End, and Enter on the input drive navigation. Fully accessible (combobox/listbox/option roles, `aria-activedescendant`). No runtime dependencies beyond React.
