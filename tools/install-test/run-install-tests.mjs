#!/usr/bin/env node
/**
 * Real-install smoke test harness for @sisyphos-ui/* packages.
 *
 * See ./README.md for usage and rationale.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const TEMPLATE = path.join(HERE, "template");
const RESULTS_DIR = path.join(HERE, "results");
const PACKAGES_DIR = path.join(REPO_ROOT, "packages");

const args = process.argv.slice(2);
const only = argOf("--only");
const keep = args.includes("--keep");
const verbose = args.includes("--verbose");

/* ─────────────────────────────────────────────────────────────────────────── */

function argOf(name) {
  const i = args.indexOf(name);
  if (i === -1) return null;
  return args[i + 1];
}

function run(cmd, cmdArgs, { cwd, env } = {}) {
  const res = spawnSync(cmd, cmdArgs, {
    cwd,
    env: { ...process.env, ...(env ?? {}) },
    encoding: "utf8",
  });
  return {
    ok: res.status === 0,
    stdout: res.stdout ?? "",
    stderr: res.stderr ?? "",
    status: res.status ?? -1,
  };
}

function loadPkgJson(dir) {
  return JSON.parse(readFileSync(path.join(dir, "package.json"), "utf8"));
}

function pkgsToTest() {
  const all = readdirSync(PACKAGES_DIR)
    .filter((entry) => {
      const p = path.join(PACKAGES_DIR, entry, "package.json");
      if (!existsSync(p)) return false;
      const json = loadPkgJson(path.join(PACKAGES_DIR, entry));
      // Skip private meta/config packages that consumers don't install.
      if (entry === "eslint-config") return false;
      // Skip packages without a dist (nothing to pack).
      if (!existsSync(path.join(PACKAGES_DIR, entry, "dist", "index.js"))) {
        if (verbose) console.log(`skipping ${entry}: no dist/index.js`);
        return false;
      }
      return json.name && json.name.startsWith("@sisyphos-ui/");
    })
    .sort();

  if (only) return all.filter((p) => p === only);
  return all;
}

/**
 * Minimal usage snippet per package.
 *
 * The goal is not to exercise every prop — just to verify that the import
 * resolves, the main named export is a React component or usable value, and
 * the bundler + CSS import work end-to-end.
 */
const USAGE_BY_PKG = {
  button: `
    import { Button } from "@sisyphos-ui/button";
    import "@sisyphos-ui/button/styles";
    export function App() { return <Button>Click</Button>; }
  `,
  input: `
    import { Input } from "@sisyphos-ui/input";
    import "@sisyphos-ui/input/styles";
    export function App() { return <Input label="Email" />; }
  `,
  dialog: `
    import { Dialog } from "@sisyphos-ui/dialog";
    import "@sisyphos-ui/dialog/styles";
    export function App() {
      return <Dialog open={false} onOpenChange={() => {}}><Dialog.Body>hi</Dialog.Body></Dialog>;
    }
  `,
  ui: `
    import { Button, Input } from "@sisyphos-ui/ui";
    import "@sisyphos-ui/ui/styles";
    export function App() { return <><Button>x</Button><Input label="y" /></>; }
  `,
};

/** Default: import everything named and render the count of exports. */
function defaultUsage(pkgName) {
  return `
    import * as M from "${pkgName}";
    export function App() {
      const keys = Object.keys(M);
      return <div data-count={keys.length}>{keys.length} exports</div>;
    }
  `;
}

/* ─────────────────────────────────────────────────────────────────────────── */

function testOne(pkgFolder) {
  const pkgDir = path.join(PACKAGES_DIR, pkgFolder);
  const json = loadPkgJson(pkgDir);
  const name = json.name;
  const logPath = path.join(RESULTS_DIR, `${pkgFolder}.log`);
  const lines = [`# ${name} @ ${json.version}`, ""];
  const push = (s) => lines.push(s);

  // 1. npm pack
  push(`$ pnpm pack (in ${pkgDir})`);
  // Use pnpm pack so workspace:* protocol is rewritten to real versions.
  const packRes = run("pnpm", ["pack", "--pack-destination", pkgDir], { cwd: pkgDir });
  // pnpm pack prints the tarball name (sometimes relative, sometimes absolute).
  const extractTarball = (out, destDir) => {
    const line = (out || "").trim().split(/\r?\n/).pop()?.trim() || "";
    if (!line || !line.endsWith(".tgz")) return null;
    return path.isAbsolute(line) ? line : path.join(destDir, line);
  };
  if (!packRes.ok) {
    push(packRes.stderr);
    writeFileSync(logPath, lines.join("\n"));
    return { ok: false, reason: "pnpm pack failed" };
  }
  const tarballAbs = extractTarball(packRes.stdout, pkgDir);
  if (!tarballAbs || !existsSync(tarballAbs)) {
    push(`no tarball produced; stdout: ${packRes.stdout}`);
    writeFileSync(logPath, lines.join("\n"));
    return { ok: false, reason: "no tarball" };
  }

  // 2. create a temp project from the template
  const tmpRoot = path.join(os.tmpdir(), `sisyphos-install-${pkgFolder}-${Date.now()}`);
  mkdirSync(tmpRoot, { recursive: true });
  cpSync(TEMPLATE, tmpRoot, { recursive: true });
  push(`tmp project: ${tmpRoot}`);

  // 3. write App.tsx that uses the package
  const usage = (USAGE_BY_PKG[pkgFolder] ?? defaultUsage(name)).trim();
  writeFileSync(path.join(tmpRoot, "src", "App.tsx"), usage + "\n");

  try {
    // 4. install the tarball (and any additional sisyphos peer/dep tarballs)
    push("$ npm install");
    const peers = collectSisyphosDeps(json);
    // Pack every needed sisyphos package and install them all together so
    // workspace:* links don't break the install.
    const extraTarballs = [];
    for (const peer of peers) {
      const peerDir = path.join(PACKAGES_DIR, peer);
      if (!existsSync(peerDir)) continue;
      const peerPack = run("pnpm", ["pack", "--pack-destination", peerDir], { cwd: peerDir });
      if (peerPack.ok) {
        const fname = extractTarball(peerPack.stdout, peerDir);
        if (fname && existsSync(fname)) extraTarballs.push(fname);
      }
    }

    const installRes = run(
      "npm",
      [
        "install",
        "--no-audit",
        "--no-fund",
        "--no-package-lock",
        tarballAbs,
        ...extraTarballs,
      ],
      { cwd: tmpRoot }
    );
    push(installRes.stdout);
    push(installRes.stderr);
    if (!installRes.ok) {
      writeFileSync(logPath, lines.join("\n"));
      return { ok: false, reason: "npm install failed" };
    }

    // 5. tsc --noEmit
    push("$ npx tsc --noEmit");
    const tsRes = run("npx", ["tsc", "--noEmit"], { cwd: tmpRoot });
    push(tsRes.stdout);
    push(tsRes.stderr);
    if (!tsRes.ok) {
      writeFileSync(logPath, lines.join("\n"));
      return { ok: false, reason: "tsc failed" };
    }

    // 6. vite build
    push("$ npx vite build");
    const viteRes = run("npx", ["vite", "build"], { cwd: tmpRoot });
    push(viteRes.stdout);
    push(viteRes.stderr);
    if (!viteRes.ok) {
      writeFileSync(logPath, lines.join("\n"));
      return { ok: false, reason: "vite build failed" };
    }

    writeFileSync(logPath, lines.join("\n"));
    return { ok: true };
  } finally {
    // Clean up the original tarball.
    try { rmSync(tarballAbs); } catch {}
    if (!keep) {
      try { rmSync(tmpRoot, { recursive: true, force: true }); } catch {}
    }
  }
}

function collectSisyphosDeps(pkgJson) {
  const out = new Set();
  for (const field of ["dependencies", "peerDependencies"]) {
    const block = pkgJson[field] ?? {};
    for (const key of Object.keys(block)) {
      if (key.startsWith("@sisyphos-ui/")) {
        out.add(key.replace("@sisyphos-ui/", ""));
      }
    }
  }
  return [...out];
}

/* ─────────────────────────────────────────────────────────────────────────── */

function main() {
  if (!existsSync(RESULTS_DIR)) mkdirSync(RESULTS_DIR, { recursive: true });

  const targets = pkgsToTest();
  if (targets.length === 0) {
    console.error(
      only
        ? `no package matching --only "${only}" (did you forget to build?)`
        : "no packages found — run `pnpm -r build` first"
    );
    process.exit(2);
  }

  console.log(`Running install-test against ${targets.length} package(s):`);
  for (const t of targets) console.log(`  - ${t}`);
  console.log("");

  const summary = { pass: [], fail: [] };
  for (const pkg of targets) {
    process.stdout.write(`→ ${pkg} `);
    const res = testOne(pkg);
    if (res.ok) {
      summary.pass.push(pkg);
      console.log("✓");
    } else {
      summary.fail.push({ pkg, reason: res.reason });
      console.log(`✗ (${res.reason})`);
    }
  }

  writeFileSync(
    path.join(RESULTS_DIR, "_summary.json"),
    JSON.stringify(summary, null, 2)
  );

  console.log("");
  console.log(`Pass: ${summary.pass.length}, Fail: ${summary.fail.length}`);
  console.log(`Logs in ${RESULTS_DIR}`);

  if (summary.fail.length > 0) process.exit(1);
}

main();
