#!/usr/bin/env node
/**
 * Core SCSS → CSS build
 * - src/styles.scss        → dist/styles.css
 * - src/theme/default-theme.scss → dist/theme/default-theme.css
 */
import { compile } from "sass";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const targets = [
  { in: "src/styles.scss", out: "dist/styles.css" },
  { in: "src/theme/default-theme.scss", out: "dist/theme/default-theme.css" },
];

for (const t of targets) {
  const result = compile(resolve(root, t.in), {
    loadPaths: [resolve(root, "node_modules"), resolve(root, "../../node_modules")],
    style: "compressed",
    sourceMap: true,
  });
  const outPath = resolve(root, t.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, result.css);
  if (result.sourceMap) {
    writeFileSync(outPath + ".map", JSON.stringify(result.sourceMap));
  }
  console.log(`[core] built ${t.out}`);
}
