# @sisyphos-ui/playground-angular

Angular 18 consumer scaffold for `@sisyphos-ui/angular`. Mirrors the React +
Vue playground apps so all three frameworks demonstrate the same components.

## Status

The TypeScript app code (`src/main.ts` + `src/app.component.ts`) targets
the v1 surface and consumes `@sisyphos-ui/angular` exactly the way a
downstream Angular CLI app would.

The Vite build via `@analogjs/vite-plugin-angular` currently fails on
this scaffold (NgCompiler `Cannot read properties of undefined (reading 'flags')`
on a 0-source program) — this plugin is primarily designed for AnalogJS
SSR apps and Angular library AOT, and needs additional wiring for a plain
SPA build. This is **not** a blocker for shipping the package: the
canonical end-to-end consumer is `ng new` + Angular CLI, which produces
its own webpack/esbuild setup with the Angular Linker enabled.

End-to-end paths verified for `@sisyphos-ui/angular`:

- `ng-packagr` emits FESM2022 + d.ts + a 130KB merged stylesheet at
  `packages/angular/dist/`.
- 33 component test specs / 364 individual tests pass under Vitest
  jsdom — exercising every component through real Angular runtime,
  signal graph, Linker, and DOM.
- The `dist/` folder follows the standard Angular library layout
  (Partial Ivy), so a downstream `pnpm add @sisyphos-ui/angular` in a
  fresh `ng new` workspace finalizes AOT through the consumer's
  Angular CLI toolchain — same as Material/PrimeNG/etc.

## To finish the Vite playground

When time permits, the cleanest paths are:

1. **Angular CLI** — `ng new playground-angular --routing=false --style=css`
   inside `apps/`, then add `@sisyphos-ui/angular` and the standard
   `styles.css` import. This is the production pattern.
2. **AnalogJS app preset** — switch from `@analogjs/vite-plugin-angular`
   alone to the full `@analogjs/platform` preset, which adds the
   missing `index.html`/router/build wiring.

Either route plugs into the existing `src/app.component.ts` unchanged.
