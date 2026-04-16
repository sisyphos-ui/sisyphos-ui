#!/usr/bin/env node
/**
 * Seeds LICENSE + CHANGELOG.md into every package that doesn't already have them.
 * Idempotent — only writes files that are missing.
 */
import { readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const PACKAGES_DIR = join(ROOT, "packages");
const YEAR = new Date().getUTCFullYear();
const HOLDER = "Sisyphos UI Contributors";

const LICENSE = `MIT License

Copyright (c) ${YEAR} ${HOLDER}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

const CHANGELOG = `# Changelog

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial public release.
`;

let seeded = 0;
let total = 0;
for (const entry of readdirSync(PACKAGES_DIR)) {
  const dir = join(PACKAGES_DIR, entry);
  if (!statSync(dir).isDirectory()) continue;
  if (!existsSync(join(dir, "package.json"))) continue;
  total += 1;

  const licensePath = join(dir, "LICENSE");
  const changelogPath = join(dir, "CHANGELOG.md");
  let touched = false;
  if (!existsSync(licensePath)) {
    writeFileSync(licensePath, LICENSE);
    touched = true;
  }
  if (!existsSync(changelogPath)) {
    writeFileSync(changelogPath, CHANGELOG);
    touched = true;
  }
  if (touched) {
    seeded += 1;
    console.log(`✓ ${entry}`);
  } else {
    console.log(`· ${entry} (already had LICENSE + CHANGELOG)`);
  }
}

console.log(`\nSeeded ${seeded}/${total} packages.`);
