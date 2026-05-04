# @sisyphos-ui/preview-angular

Static Angular 18 preview app that renders sisyphos-ui demos inside the
docs site iframe. Each demo is a standalone `*.component.ts` under
`src/demos/` keyed to a docs-site slug; the host component reads
`?demo=<slug>` from the URL and dynamically mounts the matching demo
into a `ViewContainerRef`.

## Stack

Angular CLI 18 + `@angular/build` (esbuild builder). Library imports
come from `@sisyphos-ui/angular` workspace. The build emits a single
static SPA ready to drop behind a CDN.

**Requires Node ≥ 22** (Angular CLI 18 minimum). Use `nvm use 22`.

## Commands

```bash
pnpm --filter @sisyphos-ui/preview-angular build    # production bundle → dist/
pnpm --filter @sisyphos-ui/preview-angular dev      # ng serve on http://localhost:4580
pnpm --filter @sisyphos-ui/preview-angular preview  # static preview on http://localhost:4580
```

## Adding a demo

1. Drop a `*.component.ts` standalone component in `src/demos/` (e.g.
   `dropdown-menu-default.component.ts`).
2. Register it in `src/demos/registry.ts`.
3. Re-build. The docs site iframe picks it up automatically via the
   slug — no further wiring needed.

The slug must match the React `getDemos()` registry in
`sisyphosui-landing/src/components/demos/registry.tsx` (or the
`previewSlug` override on a `DemoExample`) so the docs page swaps in
the right URL when the user picks Angular.

## URL contract

```
GET /?demo=button-default    → renders <ButtonDefaultDemo />
GET /?demo=missing-slug      → renders "Angular preview for ... is coming soon."
GET /                        → renders "Pass a ?demo=<slug> query parameter."
```

The docs site sets `NEXT_PUBLIC_PREVIEW_ANGULAR_URL` to this app's
deploy URL; the default fallback is `http://localhost:4580`.

## Caveat

`Table`'s `TableColumn<T>` generic erases to
`TableColumn<Record<string, unknown>>` after ng-packagr Partial-Ivy
emit (Angular 18 d.ts limitation), so any Table demo must cast row +
column data at the binding boundary. See `playground-angular`'s
`app.component.ts` for the canonical pattern.
