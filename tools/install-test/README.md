# install-test — real-install smoke harness

Tests each `@sisyphos-ui/*` package the way an **end user** would install it:

1. `npm pack` produces a `.tgz` from the built `dist/`.
2. A throwaway Vite + React + TypeScript project is created in a temp dir.
3. The tarball is installed into that project with `npm install`.
4. A minimal `App.tsx` that imports the main export is rendered.
5. The project is `tsc`-checked and `vite build`-built.

This catches problems that **`pnpm -r build` can't catch**:

- Missing `peerDependencies` (monorepo link hides them).
- Missing `"sideEffects"` entries → bundlers drop the stylesheet.
- Broken `"exports"` map (CSS entry, subpath imports, dual CJS/ESM).
- Unintentional `workspace:*` deps in a `dependencies` block.
- Untranspiled JSX or TS leaking into `dist/`.

## Usage

Before running, make sure all packages are built:

```sh
pnpm -r build
```

Then:

```sh
# One package
node tools/install-test/run-install-tests.mjs --only button

# All packages (slow — roughly 10-30s per package)
node tools/install-test/run-install-tests.mjs

# Only test the umbrella (covers tree-shaking of all sub-packages)
node tools/install-test/run-install-tests.mjs --only ui
```

Output:

- `tools/install-test/results/<pkg>.log` — full stdout/stderr for the run.
- `tools/install-test/results/_summary.json` — pass/fail rollup.
- Exit code is non-zero if any package failed.

## Notes

- This harness intentionally uses **npm** (not pnpm) for the consumer side, because that's what most end users run and it more faithfully reports peer-dep issues.
- Temp projects are deleted after each package unless `--keep` is passed (`--keep` is useful for debugging a specific failure).
- The harness is **not** part of CI by default — it is too slow for PR gating. Run it before a release or when changing package wiring (`exports`, peers, side-effects).
