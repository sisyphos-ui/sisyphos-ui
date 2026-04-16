#!/usr/bin/env node
/**
 * Normalizes every package.json under packages/* to a publishable shape.
 * Idempotent — safe to re-run after edits.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const PACKAGES_DIR = join(ROOT, "packages");

const REPO_BASE = "https://github.com/sisyphos-ui/sisyphos-ui";
const HOMEPAGE = `${REPO_BASE}#readme`;
const BUGS = `${REPO_BASE}/issues`;
const REACT_PEER = "^17.0.0 || ^18.0.0 || ^19.0.0";
const AUTHOR = "Sisyphos UI Contributors";
const ENGINES = { node: ">=18" };

/** Field order — produces a clean, predictable package.json. */
const ORDER = [
  "name",
  "version",
  "description",
  "keywords",
  "homepage",
  "bugs",
  "repository",
  "license",
  "author",
  "sideEffects",
  "type",
  "main",
  "module",
  "types",
  "exports",
  "files",
  "scripts",
  "dependencies",
  "peerDependencies",
  "peerDependenciesMeta",
  "devDependencies",
  "engines",
  "publishConfig",
];

function reorder(pkg) {
  const out = {};
  for (const k of ORDER) if (k in pkg) out[k] = pkg[k];
  for (const k of Object.keys(pkg)) if (!(k in out)) out[k] = pkg[k];
  return out;
}

function ensureKeyword(arr, kw) {
  if (!arr.includes(kw)) arr.push(kw);
}

function normalize(pkgPath, dirName) {
  const raw = readFileSync(pkgPath, "utf8");
  const pkg = JSON.parse(raw);

  // ── identity / discovery ────────────────────────────────────────────
  pkg.license = pkg.license ?? "MIT";
  pkg.author = pkg.author ?? AUTHOR;
  pkg.homepage = HOMEPAGE;
  pkg.bugs = { url: BUGS };
  pkg.repository = {
    type: "git",
    url: `git+${REPO_BASE}.git`,
    directory: `packages/${dirName}`,
  };

  // ── keywords (preserve, dedupe, ensure baseline) ───────────────────
  pkg.keywords = Array.isArray(pkg.keywords) ? Array.from(new Set(pkg.keywords)) : [];
  ensureKeyword(pkg.keywords, "react");
  ensureKeyword(pkg.keywords, "design-system");
  ensureKeyword(pkg.keywords, "sisyphos-ui");
  ensureKeyword(pkg.keywords, "typescript");
  ensureKeyword(pkg.keywords, "ui");
  pkg.keywords.sort();

  // ── peer dependencies ──────────────────────────────────────────────
  if (pkg.peerDependencies?.react) {
    pkg.peerDependencies.react = REACT_PEER;
  }
  if (pkg.peerDependencies?.["react-dom"]) {
    pkg.peerDependencies["react-dom"] = REACT_PEER;
  }

  // ── publish config ─────────────────────────────────────────────────
  pkg.publishConfig = { access: "public", ...(pkg.publishConfig ?? {}) };

  // ── engines ────────────────────────────────────────────────────────
  pkg.engines = pkg.engines ?? ENGINES;

  // ── files (dist + README + LICENSE + CHANGELOG always shipped) ─────
  if (Array.isArray(pkg.files)) {
    const set = new Set(pkg.files);
    set.add("dist");
    set.add("README.md");
    set.add("LICENSE");
    set.add("CHANGELOG.md");
    // core ships raw scss for sass consumers
    if (dirName === "core") {
      set.add("src/**/*.scss");
    }
    pkg.files = [...set].sort();
  }

  const reordered = reorder(pkg);
  const next = JSON.stringify(reordered, null, 2) + "\n";
  if (next !== raw) {
    writeFileSync(pkgPath, next);
    return true;
  }
  return false;
}

let changed = 0;
let total = 0;
for (const entry of readdirSync(PACKAGES_DIR)) {
  const dir = join(PACKAGES_DIR, entry);
  if (!statSync(dir).isDirectory()) continue;
  const pkgPath = join(dir, "package.json");
  try {
    statSync(pkgPath);
  } catch {
    continue;
  }
  total += 1;
  if (normalize(pkgPath, entry)) {
    changed += 1;
    console.log(`✓ ${entry}`);
  } else {
    console.log(`· ${entry} (no change)`);
  }
}

console.log(`\nNormalized ${changed}/${total} package.json files.`);
