#!/usr/bin/env node
/**
 * Removes @GithubOnly functions before normal `npm run build`.
 * Restored after build by scripts/restore-github-only.js.
 */
const fs = require("fs");
const path = require("path");

const pagePath = path.join(__dirname, "../pages/index.js");
const backupPath = `${pagePath}.github-only.bak`;

const source = fs.readFileSync(pagePath, "utf8");
fs.writeFileSync(backupPath, source);

const stripped = source
  .replace(/GithubOnly\nasync function \w+\(\) \{[\s\S]*?\n\}\n\n/, "")
  .replace(
    /import \{ GithubOnly \} from "\.\.\/lib\/githubPageDecorators";\n/,
    "",
  );

fs.writeFileSync(pagePath, stripped);
console.log("Removed GithubOnly loader before build");
