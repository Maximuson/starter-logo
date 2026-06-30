/**
 * Marks a function as GitHub Pages only.
 * It is removed before `npm run build` and used as getStaticProps in `npm run build:github-pages`.
 *
 * To drop GitHub Pages: delete functions wrapped with GithubOnly + scripts/github-pages/.
 */
function GithubOnly(fn) {
  fn.__githubOnly = true;
  return fn;
}

module.exports = { GithubOnly };
