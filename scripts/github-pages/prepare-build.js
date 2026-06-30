#!/usr/bin/env node
/**
 * GitHub Pages build helper — swaps the page loader before `next build`.
 *
 * Run via: npm run build:github-pages
 *
 * HOW TO REMOVE GITHUB PAGES SUPPORT LATER:
 * 1. Delete this scripts/github-pages/ folder
 * 2. Remove "build:github-pages" from package.json
 * 3. Remove or update .github/workflows/deploy.yml
 * 4. Remove GITHUB_PAGES branch from next.config.js
 * 5. Delete pageDataStrategies.github from lib/pageDataStrategies.js
 * 6. Remove @github-pages-loader markers from pages/index.js (keep getServerSideProps only)
 */
const fs = require("fs");
const path = require("path");

const { getStaticStrategy } = require("../../lib/pageDataStrategies");

const pagePath = path.join(__dirname, "../../pages/index.js");
const source = fs.readFileSync(pagePath, "utf8");

const { name: strategyName } = getStaticStrategy();

const staticLoader = `export async function getStaticProps() {
  const { pageDataStrategies } = require("../lib/pageDataStrategies");
  return pageDataStrategies.${strategyName}.getProps();
}`;

const markerPattern =
  /\/\/ @github-pages-loader-start[\s\S]*?\/\/ @github-pages-loader-end/;

if (!markerPattern.test(source)) {
  throw new Error("pages/index.js is missing @github-pages-loader markers");
}

const updated = source.replace(
  markerPattern,
  `// @github-pages-loader-start\n${staticLoader}\n// @github-pages-loader-end`,
);

fs.writeFileSync(pagePath, updated);

console.log(
  `GitHub Pages build: swapped loader to getStaticProps (${strategyName} strategy)`,
);
