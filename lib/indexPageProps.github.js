/**
 * GitHub Pages static export loader.
 * Used only when GITHUB_PAGES=true (see scripts/write-index-page.js).
 */
const GITHUB_PAGES_MESSAGE =
  "Database demo is not available on static GitHub Pages hosting. Run with Docker locally or in Cursor Cloud to see live data.";

export async function getStaticProps() {
  return {
    props: {
      users: [],
      usersUnavailableReason: GITHUB_PAGES_MESSAGE,
    },
  };
}
