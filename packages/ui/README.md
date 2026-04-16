# @sisyphos-ui/ui

Umbrella package — installs every Sisyphos component in one go and re-exports them from a single import path.

Use this if you want the whole library. If you only need a few components, install them individually for the smallest possible bundle.

## Install

```bash
pnpm add @sisyphos-ui/ui
```

## Usage

```tsx
// One stylesheet that bundles every component's CSS
import "@sisyphos-ui/ui/styles.css";

import {
  Button,
  Input,
  Dialog,
  toast,
  Toaster,
  Table,
  // …everything else
} from "@sisyphos-ui/ui";
```

## What's included

`@sisyphos-ui/ui` re-exports every public component, hook, and type from the following packages:

- **Foundation** — `core`, `portal`, `form-control`
- **Inputs** — `button`, `input`, `textarea`, `checkbox`, `switch`, `radio`, `select`, `tree-select`, `number-input`, `slider`, `datepicker`, `file-upload`
- **Display** — `chip`, `avatar`, `spinner`, `skeleton`, `empty-state`, `alert`, `breadcrumb`, `card`, `accordion`, `tabs`, `table`, `carousel`
- **Overlay** — `tooltip`, `popover`, `dropdown-menu`, `dialog`, `toast`

## Tree shaking

Modern bundlers will tree-shake unused components — but importing only the packages you need still produces a smaller production bundle and a smaller dev install. Prefer the per-package install for production apps; use this umbrella for prototypes and exploration.

## Custom theming

Sisyphos UI is themed through CSS variables. See `@sisyphos-ui/core` for the theme API (`applyTheme`, `setThemeMode`, `createTheme`, `themes`).

```ts
import { applyTheme } from "@sisyphos-ui/ui";

applyTheme({
  colors: { primary: "#0284c7" },
});
```
