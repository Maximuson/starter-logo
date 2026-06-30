#!/usr/bin/env node
/**
 * Activates @GithubStatic / removes @GithubRemove loaders for GitHub Pages build.
 *
 * Run via: npm run build:github-pages
 *
 * TO DROP GITHUB PAGES LATER:
 * - Delete scripts/github-pages/
 * - Delete lib/githubPageDecorators.js
 * - Delete pageDataStrategies.github
 * - In pages/index.js remove GithubStatic loader; keep only:
 *     export async function getServerSideProps() {
 *       return pageDataStrategies.server.getProps();
 *     }
 */
const fs = require("fs");
const path = require("path");

const pagePath = path.join(__dirname, "../../pages/index.js");
const source = fs.readFileSync(pagePath, "utf8");

const staticMatch = source.match(/const (\w+) = GithubStatic\(/);
const removeMatch = source.match(/const (\w+) = GithubRemove\(/);

if (!staticMatch) {
  throw new Error("pages/index.js: missing const ... = GithubStatic(...)");
}

if (!removeMatch) {
  throw new Error("pages/index.js: missing const ... = GithubRemove(...)");
}

const staticLoaderName = staticMatch[1];
const removeLoaderName = removeMatch[1];

let updated = source;

// Drop the GithubRemove loader (SSR-only).
updated = updated.replace(
  new RegExp(`const ${removeLoaderName} = GithubRemove\\([\\s\\S]*?\\n\\);\\n`),
  "",
);

// Replace getServerSideProps export with getStaticProps (uses GithubStatic loader).
updated = updated.replace(
  /export async function getServerSideProps\(\) \{[\s\S]*?\n\}/,
  `export async function getStaticProps() {\n  return ${staticLoaderName}();\n}`,
);

fs.writeFileSync(pagePath, updated);

console.log(
  `GitHub Pages build: getStaticProps → ${staticLoaderName}(), removed ${removeLoaderName}`,
);
