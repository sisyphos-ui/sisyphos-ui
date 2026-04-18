#!/usr/bin/env node
/**
 * Bundle all component CSS files into a single dist/styles.css
 * Consumer can: import "@sisyphos-ui/ui/styles.css"
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const monorepo = resolve(root, "../..");

const sources = [
  "packages/core/dist/styles.css",
  "packages/form-control/dist/index.css",
  "packages/button/dist/index.css",
  "packages/input/dist/index.css",
  "packages/switch/dist/index.css",
  "packages/checkbox/dist/index.css",
  "packages/chip/dist/index.css",
  "packages/avatar/dist/index.css",
  "packages/spinner/dist/index.css",
  "packages/skeleton/dist/index.css",
  "packages/empty-state/dist/index.css",
  "packages/textarea/dist/index.css",
  "packages/radio/dist/index.css",
  "packages/breadcrumb/dist/index.css",
  "packages/alert/dist/index.css",
  "packages/tooltip/dist/index.css",
  "packages/popover/dist/index.css",
  "packages/select/dist/index.css",
  "packages/dropdown-menu/dist/index.css",
  "packages/dialog/dist/index.css",
  "packages/toast/dist/index.css",
  "packages/datepicker/dist/index.css",
  "packages/number-input/dist/index.css",
  "packages/slider/dist/index.css",
  "packages/tree-select/dist/index.css",
  "packages/file-upload/dist/index.css",
  "packages/tabs/dist/index.css",
  "packages/card/dist/index.css",
  "packages/accordion/dist/index.css",
  "packages/table/dist/index.css",
  "packages/carousel/dist/index.css",
];

const stripNoise = (css) =>
  css
    .replace(/^\uFEFF/, "")
    .replace(/@charset\s+"[^"]*"\s*;?\s*/gi, "")
    .replace(/\/\*#\s*sourceMappingURL=[^*]+\*\/\s*/g, "")
    .trim();

const chunks = sources.map((s) => {
  const p = resolve(monorepo, s);
  return `/* ── ${s} ── */\n` + stripNoise(readFileSync(p, "utf8"));
});

const outPath = resolve(root, "dist/styles.css");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `@charset "UTF-8";\n\n` + chunks.join("\n\n") + "\n");
console.log(`[ui] bundled styles.css (${chunks.length} sources)`);
