# Contributing to Sisyphos UI

Thanks for your interest in contributing! This guide covers the workflow, the component-authoring checklist, and how releases work.

By participating you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## Quick start

```bash
git clone https://github.com/sisyphos-ui/sisyphos-ui.git
cd sisyphos-ui
pnpm install
pnpm build
pnpm test
pnpm storybook        # component playground at :6006
pnpm dev:playground   # standalone Vite app for ad-hoc testing
```

Requires **Node ≥ 18** and **pnpm ≥ 8**.

---

## Workflow

1. Open or pick up an issue. For non-trivial changes, please discuss scope first so no one duplicates work.
2. Fork, then branch from `master`:
   ```bash
   git checkout -b feat/your-change
   ```
3. Make the change. Add or update tests and stories.
4. Run the full suite locally:
   ```bash
   pnpm lint
   pnpm type-check
   pnpm test
   pnpm build
   ```
5. Add a changeset (required for anything that touches a published package):
   ```bash
   pnpm changeset
   ```
   Pick the affected packages and a semver bump (`patch` / `minor` / `major`). Write the changelog entry in past tense — it ships verbatim to npm.
6. Open a PR against `master`. CI runs lint, type-check, tests, and the full build matrix.

---

## Component-authoring checklist

When adding a new component or a major feature to an existing one:

- [ ] **Accessible** — keyboard navigation, focus management, and appropriate ARIA roles/attributes. Overlay components trap focus and restore it on close.
- [ ] **Controlled + uncontrolled** — accepts `value` / `defaultValue` (or `open` / `defaultOpen`) with `onChange` / `onOpenChange`.
- [ ] **`forwardRef`** — consumers can grab the underlying DOM node. Set `displayName` for DevTools.
- [ ] **Strict types** — no `any`. Props documented with JSDoc where non-obvious.
- [ ] **Themed via CSS variables** — colors, spacing, radii come from `--sisyphos-*`. No hard-coded hex/px beyond the variables.
- [ ] **Light + dark** — verify both modes in Storybook.
- [ ] **Unit tests** — cover keyboard interaction, ARIA expectations, controlled + uncontrolled, and edge cases.
- [ ] **Storybook story** — default + relevant variants. The a11y addon must pass.
- [ ] **README** — install, basic usage, props table, accessibility notes.
- [ ] **Changeset** — see Workflow step 5.

---

## Architecture notes

- Monorepo managed by **pnpm workspaces** + **Turborepo**. Each component is its own package under `packages/*` and ships independently to npm.
- `@sisyphos-ui/ui` is a meta package that re-exports every component. Users who want DX install this; users who want minimum footprint install components individually.
- `@sisyphos-ui/core` owns design tokens (`applyTheme`, CSS variables) and small shared primitives. Most component packages depend on it.
- Components are built with **tsup** (ESM + CJS + `.d.ts`) and styles are emitted as a single `styles.css` per package.
- Tests run in **Vitest + jsdom** with `@testing-library/react`.
- Storybook is the interactive spec. A story without the `a11y` addon passing is not ready to ship.

---

## Releases

Releases are driven by **Changesets**:

1. Every user-facing change lands with a changeset in the PR.
2. After merge, the `Version Packages` PR opens automatically, bumping versions and updating CHANGELOGs.
3. Merging that PR triggers `pnpm release`, which runs the full build then `changeset publish` — publishing every package that changed to npm, and pushing git tags.

Maintainers: do not publish manually unless you are recovering from a failed release.

---

## Reporting bugs and proposing features

- **Bugs** — use the [Bug report](.github/ISSUE_TEMPLATE/bug_report.yml) template. A minimal reproduction (CodeSandbox / StackBlitz) is worth ten screenshots.
- **Features** — use the [Feature request](.github/ISSUE_TEMPLATE/feature_request.yml) template. Start a [Discussion](https://github.com/sisyphos-ui/sisyphos-ui/discussions) first if you're unsure whether it fits the library's scope.
- **Security** — please follow the private disclosure flow described in [SECURITY.md](./SECURITY.md). Do not open public issues for vulnerabilities.

---

## Code style

- **Prettier** and **ESLint** run in CI. `pnpm format` fixes style before you commit.
- Follow the component patterns in existing packages (e.g. [`packages/button`](./packages/button)) — `forwardRef` default export, `Component.scss` co-located, tests in `Component.test.tsx`, stories in `Component.stories.tsx`.
- Keep public APIs small. If you're adding a prop, check whether the behavior belongs under an existing one first.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
