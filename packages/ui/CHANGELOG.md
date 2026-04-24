# Changelog

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
