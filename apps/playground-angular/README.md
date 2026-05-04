# @sisyphos-ui/playground-angular

Angular 18 consumer app for `@sisyphos-ui/angular`. Mirrors the React +
Vue playground apps so all three frameworks demonstrate the same
components in real browsers.

## Stack

Standard **Angular CLI 18** workspace using the `@angular/build`
esbuild-based application builder. The package consumes
`@sisyphos-ui/angular` exactly the way a downstream `ng new` consumer
would — through the published Partial-Ivy FESM2022 artifact, with
Angular CLI auto-running the Linker on import.

## Requirements

Angular CLI 18 requires **Node.js ≥ 18.19**. If your local Node is older,
use a 22.x toolchain (`.nvmrc` recommended). With nvm:

```bash
nvm use 22
```

## Commands

```bash
# Build the production bundle (esbuild)
pnpm --filter @sisyphos-ui/playground-angular build

# Dev server with HMR on http://localhost:4380
pnpm --filter @sisyphos-ui/playground-angular dev

# Preview the production build on http://localhost:4380
pnpm --filter @sisyphos-ui/playground-angular preview
```

## End-to-end smoke

A real headless-Chrome render verifies the published artifact mounts:

```bash
pnpm --filter @sisyphos-ui/playground-angular preview &
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --dump-dom http://localhost:4380/ \
  | grep -oE 'sisyphos-[a-z]+' | sort -u
```

That dump returns 13+ unique component classes (Button, Card,
Checkbox, Chip, DatePicker, Dialog, Avatar, Spinner, Switch, Table,
Tabs, Toaster, …) — confirming the Angular package is consumable
end-to-end from a fresh CLI workspace.

## Notes

- The bundled stylesheet is wired through `angular.json` →
  `architect.build.options.styles[]` pointing at
  `node_modules/@sisyphos-ui/angular/dist/styles.css`.
- `Table`'s `TableColumn<T>` generic erases to
  `TableColumn<Record<string, unknown>>` after ng-packagr Partial-Ivy
  emit (Angular 18 d.ts limitation), so the playground casts at the
  binding boundary. Production consumers can do the same or wrap in
  a generic factory function.
