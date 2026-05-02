# Changelog

## 0.4.0

### Minor Changes

- b8e3ec1: `<Input>` now locks the caret past a mask's fixed prefix. When you click, focus, or arrow-key into the literal portion of a pattern (e.g. `+90 (5` in the `tel-tr` preset), the collapsed caret snaps to the first editable token so users can't accidentally type inside the prefix. Real text selections (Ctrl+A) are left alone so select-all-then-replace still works.

  Exports a new helper, `getMaskPrefixLength(maskSpec)`, for callers that want to compute the same lock position outside of the component.

### Patch Changes

- Updated dependencies [5dadf8c]
  - @sisyphos-ui/core@0.3.0

## 0.3.1

### Patch Changes

- 98e9d68: Polished a couple of spacing rough edges:
  - Accordion trigger vertical padding reduced from `$spacing-md` (16px) to `$spacing-s` (10px) so collapsed items read as a tighter list instead of feeling airy.
  - Input's `startIcon` / `endIcon` wrappers now clamp any direct `<svg>` / `<img>` child to `1.15em`. Consumers were passing 24×24 Lucide defaults which blew out small/xs inputs and pushed the icon off the text baseline.

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

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial public release.
