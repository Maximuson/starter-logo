#!/usr/bin/env node
/**
 * Restores pages/index.js after normal build (GithubOnly strip).
 */
const fs = require("fs");
const path = require("path");

const pagePath = path.join(__dirname, "../pages/index.js");
const backupPath = `${pagePath}.github-only.bak`;

if (!fs.existsSync(backupPath)) {
  process.exit(0);
}

fs.writeFileSync(pagePath, fs.readFileSync(backupPath, "utf8"));
fs.unlinkSync(backupPath);
console.log("Restored pages/index.js after build");
