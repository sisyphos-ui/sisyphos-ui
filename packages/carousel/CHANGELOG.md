# Changelog

## 0.3.1

### Patch Changes

- Updated dependencies [5dadf8c]
  - @sisyphos-ui/core@0.3.0

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
