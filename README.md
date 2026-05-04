<div align="center">

# Sisyphos UI

**A modern, accessible, themeable design system for React, Vue, and Angular.**

Thirty-three components shipped as a single tree-shakable package per
framework — built on CSS variables, strict TypeScript, and zero runtime
dependencies beyond your framework.

[![npm — react](https://img.shields.io/npm/v/@sisyphos-ui/react?style=flat-square&color=ff7022&label=%40sisyphos-ui%2Freact)](https://www.npmjs.com/package/@sisyphos-ui/react)
[![npm — vue](https://img.shields.io/npm/v/@sisyphos-ui/vue?style=flat-square&color=42b883&label=%40sisyphos-ui%2Fvue)](https://www.npmjs.com/package/@sisyphos-ui/vue)
[![npm — angular](https://img.shields.io/npm/v/@sisyphos-ui/angular?style=flat-square&color=dd0031&label=%40sisyphos-ui%2Fangular)](https://www.npmjs.com/package/@sisyphos-ui/angular)
[![license](https://img.shields.io/npm/l/@sisyphos-ui/react?style=flat-square&color=22c55e)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

[Docs](https://sisyphosui.com/docs) · [Installation](https://sisyphosui.com/docs/installation) · [Changelog](./packages/react/CHANGELOG.md) · [Discussions](https://github.com/sisyphos-ui/sisyphos-ui/discussions) · [Contributing](./CONTRIBUTING.md)

</div>

---

## Features

- **One design system, three frameworks** — `@sisyphos-ui/react`,
  `@sisyphos-ui/vue`, and `@sisyphos-ui/angular` share the same class
  names, ARIA semantics, keyboard behavior, and CSS tokens. Pick the
  binding that matches your stack — the visual + interaction contract
  is identical.
- **Accessible by default** — focus trap, scroll lock, keyboard
  navigation, WAI-ARIA roles built in. Verified against keyboard and
  screen-reader expectations across all three frameworks (1038 tests).
- **Themeable at runtime** — CSS custom properties under `--sisyphos-*`.
  `applyTheme()` flips colors, spacing, typography, and radii for the
  whole library. One call, every framework.
- **Light + dark mode** out of the box. `setThemeMode()` /
  `toggleThemeMode()` — no wrapper required.
- **Zero runtime deps** beyond your chosen framework. No lodash, no
  emotion, no date libraries.
- **Compound APIs** — `Dialog`, `Tabs`, `Accordion`, `Card`, and
  friends ship composable subcomponents so markup stays readable.
- **Controlled + uncontrolled** — every interactive component supports
  both modes through standard `value` / `defaultValue` / `onChange`
  (or `v-model:*` / `[(value)]` in Vue and Angular).
- **Strict TypeScript** — full types, prop JSDoc. IntelliSense knows
  the API.

---

## Installation

Pick the package that matches your framework — every binding ships its
own bundled stylesheet.

### React

```bash
pnpm add @sisyphos-ui/react
```

```tsx
import "@sisyphos-ui/react/styles.css";
import { Button, Toaster, toast } from "@sisyphos-ui/react";

export function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Button onClick={() => toast.success("Ready to ship")}>Click me</Button>
    </>
  );
}
```

### Vue 3

```bash
pnpm add @sisyphos-ui/vue
```

```vue
<script setup lang="ts">
import "@sisyphos-ui/vue/styles.css";
import { Button, Toaster, toast } from "@sisyphos-ui/vue";
</script>

<template>
  <Toaster position="bottom-right" />
  <Button @click="toast.success('Ready to ship')">Click me</Button>
</template>
```

### Angular 18

```bash
pnpm add @sisyphos-ui/angular
```

```ts
// styles.css (or angular.json "styles" array)
// @import "@sisyphos-ui/angular/styles.css";

import { Component } from "@angular/core";
import { Button, Toaster, toast } from "@sisyphos-ui/angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [Button, Toaster],
  template: `
    <sui-toaster position="bottom-right" />
    <sui-button (buttonClick)="hi()">Click me</sui-button>
  `,
})
export class AppComponent {
  hi() { toast.success("Ready to ship"); }
}
```

Works with **React 18+**, **Vue 3+**, **Angular 18+**, Node **≥ 18**,
and any bundler that supports ES modules.

<details>
<summary><strong>Legacy v0.5 per-component packages (React only)</strong></summary>

<br />

Pre-1.0 consumers used per-component React packages. They remain on npm
at their last 0.5.x release for back-compat — new projects should adopt
the v1.0 framework umbrellas above.

```bash
# v0.5 (React only, deprecated)
pnpm add @sisyphos-ui/button @sisyphos-ui/core
```

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/button/styles.css";
import { Button } from "@sisyphos-ui/button";
```

</details>

---

## Components

33 components, identical surface across React, Vue, and Angular.

| Category | Components |
|----------|------------|
| **Inputs** | Button · Input · Textarea · Checkbox · Switch · Radio · Select · TreeSelect · NumberInput · Slider · DatePicker · FileUpload |
| **Display** | Chip · Avatar · Spinner · Skeleton · EmptyState · Alert · Breadcrumb · Card · Accordion · Tabs · Table · Carousel |
| **Overlay** | Tooltip · Popover · DropdownMenu · ContextMenu · Dialog · Toast · Command |
| **Foundation** | Core · Portal · FormControl |

Browse the full API and per-component code panels (React/Vue/Angular)
at [sisyphosui.com/docs/components](https://sisyphosui.com/docs/components).

The framework bindings live under:

- `packages/react/` — React 18 binding (`@sisyphos-ui/react`)
- `packages/vue/` — Vue 3 binding (`@sisyphos-ui/vue`)
- `packages/angular/` — Angular 18 standalone binding (`@sisyphos-ui/angular`)
- `packages/core/` — design tokens + framework-agnostic utilities

---

## Theming

Every token is a CSS variable, so consumers can override at runtime, per-route, or per-component.

```ts
import { applyTheme } from "@sisyphos-ui/core";
// or from your framework umbrella:
//   import { applyTheme } from "@sisyphos-ui/react";

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
import { setThemeMode, toggleThemeMode } from "@sisyphos-ui/core";

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
