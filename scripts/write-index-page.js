/**
 * Writes pages/index.js with the correct data loader for the build target.
 *
 * - GITHUB_PAGES=true  → getStaticProps (static export)
 * - otherwise          → getServerSideProps (SSR)
 */
const fs = require("fs");
const path = require("path");

const isGithubPages = process.env.GITHUB_PAGES === "true";

const pageSource = isGithubPages
  ? `export { default } from "../components/Home";
export { getStaticProps } from "../lib/indexPageProps.github";
`
  : `export { default } from "../components/Home";
export { getServerSideProps } from "../lib/indexPageProps.server";
`;

const targetPath = path.join(__dirname, "..", "pages", "index.js");
fs.writeFileSync(targetPath, pageSource);

console.log(
  `pages/index.js → ${isGithubPages ? "getStaticProps (GitHub Pages)" : "getServerSideProps (SSR)"}`,
);
