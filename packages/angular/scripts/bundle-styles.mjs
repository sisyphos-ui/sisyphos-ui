/**
 * After ng-packagr finishes, copy the bundled stylesheet from
 * @sisyphos-ui/vue (built first via the workspace topological order) into
 * the Angular dist as `styles.css`.
 *
 * Why: Angular components in this repo intentionally don't use `styleUrl` —
 * they ship class names matching the framework-agnostic SCSS authored once
 * in the Vue package. Vue's Vite library build emits the merged stylesheet,
 * and we re-publish that exact byte stream from the Angular package so
 * Angular consumers can `import "@sisyphos-ui/angular/styles.css"` without
 * pulling Vue in as a runtime dependency.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "..");
const src = resolve(root, "../vue/dist/style.css");
const dest = resolve(root, "dist/styles.css");

if (!existsSync(src)) {
  console.error(
    `[bundle-styles] expected upstream stylesheet at ${src}; build @sisyphos-ui/vue first.`
  );
  process.exit(1);
}

if (!existsSync(dirname(dest))) {
  mkdirSync(dirname(dest), { recursive: true });
}

copyFileSync(src, dest);
const bytes = (await import("node:fs")).statSync(dest).size;
console.log(`[bundle-styles] wrote ${dest} (${bytes} bytes)`);
