# Changelog

## 0.3.0

### Minor Changes

- 5583084: `<NumberInput>`'s `locale` prop now defaults to `undefined` instead of `"tr-TR"`. The picker formats and parses values against the runtime's default locale unless you pass an explicit BCP 47 tag. This makes `<NumberInput>` work correctly out of the box for international consumers — pass `locale="tr-TR"` (or any other tag) to lock in a specific format that matches a fixed visual design.

  Behavior is otherwise identical: explicit `locale` values pass straight through to `Intl.NumberFormat`, and the parser still derives the decimal separator from the active locale.

### Patch Changes

- Updated dependencies [5dadf8c]
  - @sisyphos-ui/core@0.3.0

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
