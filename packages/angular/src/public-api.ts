/**
 * @sisyphos-ui/angular — Angular 17 standalone bindings.
 *
 * v1.0 layout: every component lives under `./<component>/` and is
 * re-exported from this barrel. Standalone components — no NgModule
 * wrapping — so consumers can import directly:
 *
 *   import { Checkbox } from '@sisyphos-ui/angular';
 *   @Component({ standalone: true, imports: [Checkbox], ... })
 */
export * from "./checkbox";
