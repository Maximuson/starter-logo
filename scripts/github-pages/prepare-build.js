#!/usr/bin/env node
/**
 * GitHub Pages build:
 * 1. Remove getServerSideProps
 * 2. Keep existing getStaticProps if present (no duplicate)
 * 3. Otherwise create getStaticProps from // GithubOnly loader function
 */
const fs = require("fs");
const path = require("path");

const pagePath = path.join(__dirname, "../../pages/index.js");
let source = fs.readFileSync(pagePath, "utf8");

const hasGetStaticProps = /^export async function getStaticProps/m.test(source);

source = source.replace(
  /export async function getServerSideProps\(\) \{[\s\S]*?\n\}\n\n?/,
  "",
);

if (!hasGetStaticProps) {
  const loaderMatch = source.match(
    /\/\/ GithubOnly[^\n]*\nasync function (\w+)\(/,
  );

  if (!loaderMatch) {
    throw new Error(
      "pages/index.js: need // GithubOnly loader or export async function getStaticProps",
    );
  }

  const loaderName = loaderMatch[1];
  source = source.replace(
    /export default Home;/,
    `export async function getStaticProps() {\n  return ${loaderName}();\n}\n\nexport default Home;`,
  );

  console.log(`GitHub Pages build: added getStaticProps → ${loaderName}()`);
} else {
  console.log("GitHub Pages build: kept existing getStaticProps");
}

fs.writeFileSync(pagePath, source);
