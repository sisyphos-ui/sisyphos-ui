#!/usr/bin/env node
/**
 * Format only files that are staged, modified, or added relative to origin/master
 * — instead of formatting the entire repo, which would churn 100+ files
 * for a single-component contribution.
 *
 * Fallbacks in order:
 *   1. Staged files (git diff --cached --name-only) — what you're about to commit.
 *   2. Unstaged + untracked files (git status --porcelain) — your working tree.
 *   3. Files changed vs. the repo's default branch — for PR-style workflows.
 *
 * To format the entire repo intentionally, run `pnpm format:all`.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const EXTENSIONS = new Set([".ts", ".tsx", ".scss", ".css", ".md", ".json"]);
const FOLDERS = ["packages/", "apps/"];

function sh(cmd, args) {
  const res = spawnSync(cmd, args, { encoding: "utf8" });
  if (res.error) throw res.error;
  if (res.status !== 0) return "";
  return res.stdout.trim();
}

function stagedFiles() {
  return sh("git", ["diff", "--cached", "--name-only", "--diff-filter=AM"])
    .split("\n")
    .filter(Boolean);
}

function workingTreeFiles() {
  const lines = sh("git", ["status", "--porcelain"])
    .split("\n")
    .filter(Boolean);
  return lines
    .map((line) => {
      // Format: "XY path" — the 2-char status column is followed by a space.
      const trimmed = line.replace(/^..\s+/, "").trim();
      // Handle rename "old -> new".
      const parts = trimmed.split(" -> ");
      return parts[parts.length - 1];
    })
    .filter(Boolean);
}

function branchChangedFiles() {
  // Detect base branch (main or master).
  const base =
    sh("git", ["rev-parse", "--verify", "origin/main"]) ||
    sh("git", ["rev-parse", "--verify", "main"]) ||
    sh("git", ["rev-parse", "--verify", "origin/master"]) ||
    sh("git", ["rev-parse", "--verify", "master"]);
  if (!base) return [];
  return sh("git", ["diff", "--name-only", "--diff-filter=AM", base])
    .split("\n")
    .filter(Boolean);
}

function filter(files) {
  return files.filter((file) => {
    if (!existsSync(file)) return false;
    if (!FOLDERS.some((f) => file.startsWith(f))) return false;
    return EXTENSIONS.has(path.extname(file));
  });
}

let files = filter(stagedFiles());
let source = "staged";

if (files.length === 0) {
  files = filter(workingTreeFiles());
  source = "working tree";
}

if (files.length === 0) {
  files = filter(branchChangedFiles());
  source = "changed vs. base branch";
}

if (files.length === 0) {
  console.log(
    "No changed files under packages/ or apps/ to format. " +
      "Run `pnpm format:all` to format the entire repo."
  );
  process.exit(0);
}

console.log(`Formatting ${files.length} file(s) (source: ${source})`);
const result = spawnSync("npx", ["prettier", "--write", ...files], {
  stdio: "inherit",
});
process.exit(result.status ?? 0);
