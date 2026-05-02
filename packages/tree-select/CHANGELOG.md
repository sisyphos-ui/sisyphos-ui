# Changelog

## 0.3.1

### Patch Changes

- 5dadf8c: Nested overlays now close one layer at a time when the user presses Escape. Previously every active `useEscapeKey` subscription received the keystroke and collapsed every layer at once — a Popover opened inside a Dialog would close both, a DatePicker opened inside a Dialog would close both, and so on. The internal hook is now backed by a stack so only the topmost (most recently opened) overlay handles the event, which matches WAI-ARIA expectations and how every native browser dialog behaves.

  This is a transparent improvement for callers — `useEscapeKey`'s signature is unchanged. Re-renders no longer churn the stack thanks to a stable wrapper that always points at the latest callback via a ref.

- c445b53: `<TreeSelect>` now auto-expands matched ancestors while a search term is active. The recursive filter already returned only the matched paths, but collapsed parents kept hiding the very rows the user typed to find — confusing for deep trees. While `search` is non-empty every visible node is treated as expanded; clearing the search restores the user's manual expand/collapse state intact.
- Updated dependencies [5dadf8c]
  - @sisyphos-ui/core@0.3.0
  - @sisyphos-ui/portal@0.2.1

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

- @sisyphos-ui/core@0.2.0
- @sisyphos-ui/portal@0.2.0

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
  - @sisyphos-ui/core@0.2.0
  - @sisyphos-ui/portal@0.2.0

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial public release.
