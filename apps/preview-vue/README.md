# @sisyphos-ui/preview-vue

Static Vue 3 preview app that renders sisyphos-ui demos inside the docs
site iframe. Each demo is a small `.vue` file under `src/demos/` keyed
to a docs-site slug; the host `main.ts` reads `?demo=<slug>` from the
URL and mounts the matching component.

## Stack

Vue 3 + Vite, library imports come from `@sisyphos-ui/vue` workspace.
The build emits a single static SPA (one HTML + JS + CSS bundle) ready
to drop behind a CDN.

## Commands

```bash
pnpm --filter @sisyphos-ui/preview-vue build    # production bundle → dist/
pnpm --filter @sisyphos-ui/preview-vue dev      # vite dev on http://localhost:4480
pnpm --filter @sisyphos-ui/preview-vue preview  # static preview on http://localhost:4480
```

## Adding a demo

1. Drop a `.vue` file in `src/demos/` (e.g. `dropdown-menu-default.vue`).
2. Register it under the matching slug in `src/demos/registry.ts`.
3. Re-build. The docs site iframe picks it up automatically via the
   slug — no further wiring needed.

The slug must match the React `getDemos()` registry in
`sisyphosui-landing/src/components/demos/registry.tsx` (or the
`previewSlug` override on a `DemoExample`) so the docs page swaps in
the right URL when the user picks Vue.

## URL contract

```
GET /?demo=button-default    → renders <ButtonDefault />
GET /?demo=missing-slug      → renders "Vue preview for ... is coming soon."
GET /                        → renders "Pass a ?demo=<slug> query parameter."
```

The docs site sets `NEXT_PUBLIC_PREVIEW_VUE_URL` to this app's deploy
URL; the default fallback is `http://localhost:4480`.
