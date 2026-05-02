# Changelog

## 0.5.0

### Minor Changes

- 979e26d: `<Checkbox>` gains real tristate support. Pass `indeterminate` to render a horizontal "minus" mark instead of the check; the component sets the DOM `indeterminate` flag and exposes `aria-checked="mixed"` so assistive tech announces the mixed state correctly. Activating an indeterminate checkbox calls `onChange(true)` — the standard "select all" promotion that hierarchical pickers (TreeSelect, multi-row tables) need.

  The visual fill matches the configured `color` token in indeterminate state, so the tristate variant looks right across the full primary / success / warning / error / info palette.

- 62b18ad: `<DatePicker>` learns six new optional props for `showTime` mode: `defaultHour`, `defaultMinute`, and the range-aware `defaultStartHour` / `defaultStartMinute` / `defaultEndHour` / `defaultEndMinute`. They define the time applied the first time the user picks a date, so common cases like "leave from 09:00 to 18:00" no longer require the user to manually adjust both ends from `00:00` after every selection.

  The defaults only apply on first pick. Once a date carries a user-edited time the picker preserves it on subsequent re-picks. In range mode, picking an earlier date than the existing start flips the range without losing the previous start's time.

- ab5cfab: `<FileUpload>` learns two new optional props:
  - `directory` — accepts an entire folder via the non-standard `webkitdirectory` attribute (Chromium / WebKit). Each picked file's `webkitRelativePath` is preserved so the parent app can reconstruct the original folder layout.
  - `onBeforeRemove(file)` — called before a file is removed. Returning `false` (or a `Promise` that resolves to `false`) cancels the removal. Useful when the parent has to confirm with the user or revoke a server-side resource before the row disappears. When omitted, removal stays unconditional.

  The progress / status surface (already on `UploadedFile`) is unchanged — pre-uploaded "existing" files still flow through `value` items that carry a `url` instead of a `file`.

- b8e3ec1: `<Input>` now locks the caret past a mask's fixed prefix. When you click, focus, or arrow-key into the literal portion of a pattern (e.g. `+90 (5` in the `tel-tr` preset), the collapsed caret snaps to the first editable token so users can't accidentally type inside the prefix. Real text selections (Ctrl+A) are left alone so select-all-then-replace still works.

  Exports a new helper, `getMaskPrefixLength(maskSpec)`, for callers that want to compute the same lock position outside of the component.

- 5583084: `<NumberInput>`'s `locale` prop now defaults to `undefined` instead of `"tr-TR"`. The picker formats and parses values against the runtime's default locale unless you pass an explicit BCP 47 tag. This makes `<NumberInput>` work correctly out of the box for international consumers — pass `locale="tr-TR"` (or any other tag) to lock in a specific format that matches a fixed visual design.

  Behavior is otherwise identical: explicit `locale` values pass straight through to `Intl.NumberFormat`, and the parser still derives the decimal separator from the active locale.

- 04b74e0: `<Table>` gains a handful of polish features that cover real-world data-table needs without forcing apps to wrap or reimplement the component:
  - `truncate` on `TableColumn` clips a cell to one line with an ellipsis. When the cell actually overflows, the rendered text is exposed as a native `title` tooltip so the full value remains discoverable — no extra dependency required.
  - `loadingDelay` defers the skeleton until `loading` has stayed `true` for the configured duration, eliminating the flicker you see on fast network responses.
  - `rowClassName(row, index)` returns an extra class on the rendered `<tr>`, useful for state-driven highlighting (warning rows, drafts, and so on).
  - `onRowDoubleClick(row, index)` is a first-class double-click handler that runs independently of `rowSelectionMode` — so you can wire row activation without losing checkbox-driven selection semantics.

  Skeleton placeholder widths now vary across columns for a more realistic loading shimmer.

### Patch Changes

- 5dadf8c: Nested overlays now close one layer at a time when the user presses Escape. Previously every active `useEscapeKey` subscription received the keystroke and collapsed every layer at once — a Popover opened inside a Dialog would close both, a DatePicker opened inside a Dialog would close both, and so on. The internal hook is now backed by a stack so only the topmost (most recently opened) overlay handles the event, which matches WAI-ARIA expectations and how every native browser dialog behaves.

  This is a transparent improvement for callers — `useEscapeKey`'s signature is unchanged. Re-renders no longer churn the stack thanks to a stable wrapper that always points at the latest callback via a ref.

- c445b53: `<TreeSelect>` now auto-expands matched ancestors while a search term is active. The recursive filter already returned only the matched paths, but collapsed parents kept hiding the very rows the user typed to find — confusing for deep trees. While `search` is non-empty every visible node is treated as expanded; clearing the search restores the user's manual expand/collapse state intact.
- Updated dependencies [979e26d]
- Updated dependencies [62b18ad]
- Updated dependencies [5dadf8c]
- Updated dependencies [ab5cfab]
- Updated dependencies [b8e3ec1]
- Updated dependencies [5583084]
- Updated dependencies [04b74e0]
- Updated dependencies [c445b53]
  - @sisyphos-ui/checkbox@0.4.0
  - @sisyphos-ui/datepicker@0.4.0
  - @sisyphos-ui/core@0.3.0
  - @sisyphos-ui/dialog@0.4.1
  - @sisyphos-ui/popover@0.3.1
  - @sisyphos-ui/dropdown-menu@0.3.1
  - @sisyphos-ui/select@0.3.1
  - @sisyphos-ui/tree-select@0.3.1
  - @sisyphos-ui/context-menu@0.2.1
  - @sisyphos-ui/button@0.2.1
  - @sisyphos-ui/file-upload@0.4.0
  - @sisyphos-ui/input@0.4.0
  - @sisyphos-ui/number-input@0.3.0
  - @sisyphos-ui/table@0.5.0
  - @sisyphos-ui/accordion@0.3.2
  - @sisyphos-ui/alert@0.3.1
  - @sisyphos-ui/avatar@0.2.1
  - @sisyphos-ui/breadcrumb@0.2.1
  - @sisyphos-ui/card@0.3.1
  - @sisyphos-ui/carousel@0.3.1
  - @sisyphos-ui/chip@0.2.1
  - @sisyphos-ui/command@0.2.1
  - @sisyphos-ui/empty-state@0.3.1
  - @sisyphos-ui/form-control@0.2.1
  - @sisyphos-ui/kbd@0.2.1
  - @sisyphos-ui/portal@0.2.1
  - @sisyphos-ui/radio@0.3.1
  - @sisyphos-ui/skeleton@0.3.1
  - @sisyphos-ui/slider@0.3.1
  - @sisyphos-ui/spinner@0.3.2
  - @sisyphos-ui/switch@0.2.1
  - @sisyphos-ui/tabs@0.3.1
  - @sisyphos-ui/textarea@0.2.1
  - @sisyphos-ui/toast@0.4.1
  - @sisyphos-ui/tooltip@0.3.1

## 0.4.0

### Minor Changes

- 041628b: Added `<Command>` — a keyboard-first command palette / filterable menu. Compound API: `Command.Input` for typing, `Command.List` for results, `Command.Group` with an optional `heading`, `Command.Item` for selectable rows, `Command.Empty` for no-match states, `Command.Separator` for dividers. Case-insensitive substring filtering out of the box; items that don't match unmount entirely, and groups whose items all unmount hide their heading too. Arrow-up/down (wrapping), Home/End, and Enter on the input drive navigation. Fully accessible (combobox/listbox/option roles, `aria-activedescendant`). No runtime dependencies beyond React.
- de95a9a: Added `<ContextMenu>` — a right-click menu anchored at the pointer. Portal-mounted, viewport-clamped so it never opens off-screen, keyboard-navigable (Arrow/Home/End/Enter/Space/Escape), same item shape as `<DropdownMenu>` (actions, separators, labels, destructive variants, shortcut slot). Pairs with `<Table>`'s new `onRowContextMenu`. No runtime dependencies beyond React and `@sisyphos-ui/portal`.
- 7ec8bc9: Added new `<Kbd>` component for rendering keyboard keys and shortcut combinations. Platform-aware (`mod` resolves to ⌘ on macOS, ⌃ elsewhere), with built-in glyphs for modifier keys, arrows, and Enter/Tab/Esc. Accepts free-form `children`, an explicit `keys` array, or a `shortcut` string parsed on `+` or whitespace. Useful in dropdown menus, tooltips, and command palette rows.

### Patch Changes

- Updated dependencies [98e9d68]
- Updated dependencies [041628b]
- Updated dependencies [de95a9a]
- Updated dependencies [3252749]
- Updated dependencies [7ec8bc9]
- Updated dependencies [47587d7]
- Updated dependencies [c215d62]
- Updated dependencies [e61e76a]
  - @sisyphos-ui/accordion@0.3.1
  - @sisyphos-ui/input@0.3.1
  - @sisyphos-ui/command@0.2.0
  - @sisyphos-ui/context-menu@0.2.0
  - @sisyphos-ui/dialog@0.4.0
  - @sisyphos-ui/kbd@0.2.0
  - @sisyphos-ui/spinner@0.3.1
  - @sisyphos-ui/table@0.4.0
  - @sisyphos-ui/toast@0.4.0

## 0.3.0

### Minor Changes

- Component and tooling improvements across the library.
  - **Input**: input mask support (`mask` prop + new `mask.ts` helpers), expanded variants, refreshed styles, more test coverage.
  - **Table**: richer data-table features — sorting, selection, loading skeleton, empty state, refined pagination, broader test coverage.
  - **DropdownMenu**: improved keyboard navigation, submenus, and styling.
  - **DatePicker**: UX and styling refinements, better edge-case handling.
  - **Checkbox / Radio / RadioGroup**: a11y polish and consistent styling.
  - **Skeleton**: new `PageSkeleton` component and richer skeleton primitives.
  - **FileUpload**: drag-and-drop and file-type filtering polish.
  - **Slider / Carousel / Tabs / Tooltip / Popover / Toast / EmptyState / Alert / Accordion / Card / Dialog / Spinner / Select / TreeSelect**: behavioural fixes and styling refinements.
  - **ui**: `bundle-css.mjs` build tweaks for aggregated stylesheet output.
  - **eslint-config**: ruleset tuning.

### Patch Changes

- Updated dependencies
  - @sisyphos-ui/accordion@0.3.0
  - @sisyphos-ui/alert@0.3.0
  - @sisyphos-ui/card@0.3.0
  - @sisyphos-ui/carousel@0.3.0
  - @sisyphos-ui/checkbox@0.3.0
  - @sisyphos-ui/datepicker@0.3.0
  - @sisyphos-ui/dialog@0.3.0
  - @sisyphos-ui/dropdown-menu@0.3.0
  - @sisyphos-ui/empty-state@0.3.0
  - @sisyphos-ui/file-upload@0.3.0
  - @sisyphos-ui/input@0.3.0
  - @sisyphos-ui/popover@0.3.0
  - @sisyphos-ui/radio@0.3.0
  - @sisyphos-ui/select@0.3.0
  - @sisyphos-ui/skeleton@0.3.0
  - @sisyphos-ui/slider@0.3.0
  - @sisyphos-ui/spinner@0.3.0
  - @sisyphos-ui/table@0.3.0
  - @sisyphos-ui/tabs@0.3.0
  - @sisyphos-ui/toast@0.3.0
  - @sisyphos-ui/tooltip@0.3.0
  - @sisyphos-ui/tree-select@0.3.0
  - @sisyphos-ui/avatar@0.2.0
  - @sisyphos-ui/breadcrumb@0.2.0
  - @sisyphos-ui/button@0.2.0
  - @sisyphos-ui/chip@0.2.0
  - @sisyphos-ui/core@0.2.0
  - @sisyphos-ui/form-control@0.2.0
  - @sisyphos-ui/number-input@0.2.0
  - @sisyphos-ui/portal@0.2.0
  - @sisyphos-ui/switch@0.2.0
  - @sisyphos-ui/textarea@0.2.0

## 0.2.0

### Minor Changes

- Initial public release.

  Sisyphos UI is a headless-flavored, accessible React design system built around CSS variables and SCSS tokens. 30+ components ship as independent, tree-shakable packages, plus a `@sisyphos-ui/ui` umbrella.

  Highlights:
  - **Accessible by default** — WAI-ARIA compliant, keyboard operable, focus-trap / scroll-lock wired into every overlay.
  - **Themeable at runtime** — `applyTheme()`, `setThemeMode()`, and CSS variables under `--sisyphos-*`. Works with any styling stack.
  - **Compound APIs** — `Dialog`, `Tabs`, `Accordion`, `Card`, and `Radio` expose composable subcomponents for structured layouts.
  - **Controlled + uncontrolled** — every interactive component supports both modes through `value` / `defaultValue` / `onChange`.
  - **First-class TypeScript** — strict types, forwardRef + displayName, full prop JSDoc.

### Patch Changes

- Updated dependencies
  - @sisyphos-ui/accordion@0.2.0
  - @sisyphos-ui/alert@0.2.0
  - @sisyphos-ui/avatar@0.2.0
  - @sisyphos-ui/breadcrumb@0.2.0
  - @sisyphos-ui/button@0.2.0
  - @sisyphos-ui/card@0.2.0
  - @sisyphos-ui/carousel@0.2.0
  - @sisyphos-ui/checkbox@0.2.0
  - @sisyphos-ui/chip@0.2.0
  - @sisyphos-ui/core@0.2.0
  - @sisyphos-ui/datepicker@0.2.0
  - @sisyphos-ui/dialog@0.2.0
  - @sisyphos-ui/dropdown-menu@0.2.0
  - @sisyphos-ui/empty-state@0.2.0
  - @sisyphos-ui/file-upload@0.2.0
  - @sisyphos-ui/form-control@0.2.0
  - @sisyphos-ui/input@0.2.0
  - @sisyphos-ui/number-input@0.2.0
  - @sisyphos-ui/popover@0.2.0
  - @sisyphos-ui/portal@0.2.0
  - @sisyphos-ui/radio@0.2.0
  - @sisyphos-ui/select@0.2.0
  - @sisyphos-ui/skeleton@0.2.0
  - @sisyphos-ui/slider@0.2.0
  - @sisyphos-ui/spinner@0.2.0
  - @sisyphos-ui/switch@0.2.0
  - @sisyphos-ui/table@0.2.0
  - @sisyphos-ui/tabs@0.2.0
  - @sisyphos-ui/textarea@0.2.0
  - @sisyphos-ui/toast@0.2.0
  - @sisyphos-ui/tooltip@0.2.0
  - @sisyphos-ui/tree-select@0.2.0

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial public release.
