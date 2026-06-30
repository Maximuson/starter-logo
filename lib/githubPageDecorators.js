/**
 * GitHub Pages "decorators" for Next.js page loaders.
 *
 * Next.js cannot use real decorators here — it statically requires either
 * getStaticProps OR getServerSideProps, not both. These helpers tag loader
 * functions so `npm run build:github-pages` knows what to swap.
 *
 * Usage in pages/index.js:
 *
 *   const loadGithubPage = GithubStatic(async () => pageDataStrategies.github.getProps());
 *   const loadServerPage = GithubRemove(async () => pageDataStrategies.server.getProps());
 *
 *   export async function getServerSideProps() {
 *     return loadServerPage();
 *   }
 *
 * To drop GitHub Pages: delete GithubStatic loader + this file + scripts/github-pages/.
 */

const GITHUB_STATIC = Symbol("githubStatic");
const GITHUB_REMOVE = Symbol("githubRemove");

function GithubStatic(loader) {
  loader[GITHUB_STATIC] = true;
  return loader;
}

function GithubRemove(loader) {
  loader[GITHUB_REMOVE] = true;
  return loader;
}

module.exports = {
  GithubStatic,
  GithubRemove,
  GITHUB_STATIC,
  GITHUB_REMOVE,
};
