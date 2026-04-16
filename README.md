<div align="center">

# Sisyphos UI

**A modern, accessible, themeable React component library.**

Thirty-plus components that ship as independent, tree-shakable packages — built on CSS variables, strict TypeScript, and zero runtime dependencies beyond React.

[![npm](https://img.shields.io/npm/v/@sisyphos-ui/ui?style=flat-square&color=ff7022)](https://www.npmjs.com/package/@sisyphos-ui/ui)
[![license](https://img.shields.io/npm/l/@sisyphos-ui/ui?style=flat-square&color=22c55e)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-17%20%7C%2018%20%7C%2019-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/@sisyphos-ui/ui?style=flat-square&color=0891b2&label=min+gzip)](https://bundlephobia.com/package/@sisyphos-ui/ui)

[Installation](#installation) · [Components](#components) · [Theming](#theming) · [Accessibility](#accessibility) · [Contributing](./CONTRIBUTING.md)

</div>

---

## Why Sisyphos UI?

- **Accessible by default.** Every overlay wires up a focus trap, scroll lock, and keyboard shortcuts. Every form control is WAI-ARIA compliant. Tests include keyboard and screen-reader expectations.
- **Themeable at runtime.** Colors, spacing, typography, and radii are emitted as CSS custom properties under `--sisyphos-*`. Call `applyTheme({ colors: { primary: "#0284c7" } })` and the whole library flips.
- **Independent packages.** Install the full umbrella (`@sisyphos-ui/ui`) or just the one component you need — no barrel imports, no hidden dependencies.
- **Compound APIs where it counts.** `Dialog`, `Tabs`, `Accordion`, `Card`, `Radio`, and more ship the composable subcomponent pattern so your markup stays readable.
- **Controlled *and* uncontrolled.** Every interactive component supports both modes through standard `value` / `defaultValue` / `onChange` props.
- **First-class TypeScript.** Strict types, `forwardRef` + `displayName`, full prop JSDoc. IntelliSense knows more than the docs.

---

## Installation

```bash
# The umbrella package — every component in one install
pnpm add @sisyphos-ui/ui

# Or install only what you need
pnpm add @sisyphos-ui/button @sisyphos-ui/core
```

```tsx
// Import the bundled stylesheet once, at the root of your app
import "@sisyphos-ui/ui/styles.css";

import { Button, Dialog, toast, Toaster } from "@sisyphos-ui/ui";

export function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Button onClick={() => toast.success("Ready to ship")}>Click me</Button>
    </>
  );
}
```

Works with **React 17, 18, and 19**, Node **≥ 18**, and any bundler that supports ES modules.

---

## Components

| Category | Packages |
|----------|----------|
| **Inputs** | [button](./packages/button) · [input](./packages/input) · [textarea](./packages/textarea) · [checkbox](./packages/checkbox) · [switch](./packages/switch) · [radio](./packages/radio) · [select](./packages/select) · [tree-select](./packages/tree-select) · [number-input](./packages/number-input) · [slider](./packages/slider) · [datepicker](./packages/datepicker) · [file-upload](./packages/file-upload) |
| **Display** | [chip](./packages/chip) · [avatar](./packages/avatar) · [spinner](./packages/spinner) · [skeleton](./packages/skeleton) · [empty-state](./packages/empty-state) · [alert](./packages/alert) · [breadcrumb](./packages/breadcrumb) · [card](./packages/card) · [accordion](./packages/accordion) · [tabs](./packages/tabs) · [table](./packages/table) · [carousel](./packages/carousel) |
| **Overlay** | [tooltip](./packages/tooltip) · [popover](./packages/popover) · [dropdown-menu](./packages/dropdown-menu) · [dialog](./packages/dialog) · [toast](./packages/toast) |
| **Foundation** | [core](./packages/core) · [portal](./packages/portal) · [form-control](./packages/form-control) · [ui](./packages/ui) · [eslint-config](./packages/eslint-config) |

Each package has its own README, Changelog, and MIT license. Full API surfaces live in the per-package READMEs.

---

## Theming

Every token is a CSS variable, so consumers can override at runtime, per-route, or per-component.

```ts
import { applyTheme } from "@sisyphos-ui/ui";

applyTheme({
  colors: {
    primary: "#0284c7",    // swap the brand color
    success: "#16a34a",
  },
  borderRadius: { md: 6 }, // tighter corners
});
```

Or set variables directly:

```css
:root {
  --sisyphos-color-primary: #0284c7;
  --sisyphos-spacing-md: 12px;
}
```

Light/dark mode ships out of the box:

```ts
import { setThemeMode, toggleThemeMode } from "@sisyphos-ui/ui";

setThemeMode("dark");
// or
toggleThemeMode();
```

---

## Accessibility

Every component targets [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) where applicable:

- `Dialog` traps focus, locks scroll, and restores focus on close.
- `Tabs`, `Accordion`, and `RadioGroup` use roving tabindex with full keyboard support.
- `Tooltip` exposes `aria-describedby`; `Popover` uses `role="dialog"`; `DropdownMenu` exposes `role="menu"` + `menuitem`.
- `Toast` differentiates `role="alert"` (errors) from `role="status"` (everything else) and respects `aria-live` politeness.
- Form controls are wired to their labels through `id`/`htmlFor` and expose `aria-invalid`/`aria-describedby` when an error is set.

Storybook ships with `@storybook/addon-a11y`. Every story is scanned on each render.

---

## Development

```bash
pnpm install
pnpm build            # build every package
pnpm test             # run vitest across all packages
pnpm storybook        # interactive component playground at :6006
pnpm dev:playground   # standalone Vite app for ad-hoc testing
```

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for architecture notes, release workflow, and the component-authoring checklist.

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari) on the last two major releases. The only hard requirement is CSS custom properties, which means no IE11.

---

## License

[MIT](./LICENSE) — use it anywhere, commercial or otherwise.
