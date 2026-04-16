# @sisyphos-ui/eslint-config

Shared ESLint preset used by every Sisyphos UI package. Opinionated for TypeScript + React component libraries — strict on unused vars, type-only imports, and React hooks rules; relaxed on prop-types (TypeScript covers it) and explicit-any (warning, not error).

## Install

```bash
pnpm add -D @sisyphos-ui/eslint-config eslint
```

## Usage

Create `.eslintrc.cjs` in your package root:

```cjs
module.exports = {
  root: true,
  extends: ["@sisyphos-ui/eslint-config"],
};
```

That's it — the preset brings its own parser (`@typescript-eslint/parser`), plugins (`@typescript-eslint`, `react`, `react-hooks`), and rule set.

## What it enables

- `eslint:recommended`
- `plugin:@typescript-eslint/recommended`
- `plugin:react/recommended`
- `plugin:react/jsx-runtime`
- `plugin:react-hooks/recommended`

## Notable rules

| Rule | Setting | Why |
|------|---------|-----|
| `react/prop-types` | `off` | TypeScript handles prop validation. |
| `@typescript-eslint/no-unused-vars` | `warn` (allow `_`-prefixed) | Underscore is the convention for intentionally unused arguments. |
| `@typescript-eslint/consistent-type-imports` | `warn` | Keeps the runtime bundle leaner and signals type-only intent. |
| `@typescript-eslint/no-explicit-any` | `warn` | Discouraged but not blocking — sometimes you genuinely need it. |

`dist`, `node_modules`, `storybook-static`, `*.config.ts`, `*.config.mjs`, and `scripts/**` are ignored by default.
