#!/usr/bin/env node
/**
 * GitHub Pages build: swap getServerSideProps → getStaticProps (GithubOnly loader).
 */
const fs = require("fs");
const path = require("path");

const pagePath = path.join(__dirname, "../../pages/index.js");
const source = fs.readFileSync(pagePath, "utf8");

const fnMatch = source.match(/GithubOnly\nasync function (\w+)\(\)/);

if (!fnMatch) {
  throw new Error("pages/index.js: missing GithubOnly async function");
}

const githubLoaderName = fnMatch[1];

const updated = source.replace(
  /export async function getServerSideProps\(\) \{[\s\S]*?\n\}/,
  `export async function getStaticProps() {\n  return ${githubLoaderName}();\n}`,
);

fs.writeFileSync(pagePath, updated);
console.log(`GitHub Pages build: getStaticProps → ${githubLoaderName}()`);
