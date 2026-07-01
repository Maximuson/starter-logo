#!/usr/bin/env node
/**
 * Removes // GithubOnly blocks before normal `npm run build`.
 * Restored after build by scripts/restore-github-only.js.
 *
 * Removes every block that starts with `// GithubOnly` (helper or export).
 */
const fs = require("fs");
const path = require("path");

const pagePath = path.join(__dirname, "../pages/index.js");
const backupPath = `${pagePath}.github-only.bak`;

// Line may be `// GithubOnly` or `// GithubOnly — explanation`
const GITHUB_ONLY_BLOCK =
  /\/\/ GithubOnly[^\n]*\n(?:(?:export )?async function \w+\([^)]*\) \{[\s\S]*?\n\}\n\n?)/g;

const source = fs.readFileSync(pagePath, "utf8");
fs.writeFileSync(backupPath, source);

const stripped = source.replace(GITHUB_ONLY_BLOCK, "");
fs.writeFileSync(pagePath, stripped);

console.log("Removed // GithubOnly blocks before build");
