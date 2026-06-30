const { prisma } = require("./prisma");

const GITHUB_PAGES_MESSAGE =
  "Database demo is not available on static GitHub Pages hosting. Run with Docker locally or in Cursor Cloud to see live data.";

/**
 * Strategy pattern for page data loading.
 *
 * Each strategy has:
 * - static: true  → used for GitHub Pages static export (getStaticProps)
 * - static: false → used for normal SSR (getServerSideProps)
 *
 * To drop GitHub Pages later: delete the `github` entry and scripts/github-pages/.
 */
const pageDataStrategies = {
  github: {
    static: true,
    getProps: async () => ({
      props: {
        users: [],
        usersUnavailableReason: GITHUB_PAGES_MESSAGE,
      },
    }),
  },

  server: {
    static: false,
    getProps: async () => {
      let users = [];

      if (process.env.DATABASE_URL) {
        try {
          users = await prisma.user.findMany({
            orderBy: { id: "asc" },
            select: {
              id: true,
              name: true,
              email: true,
            },
          });
        } catch (error) {
          console.error("Failed to load users:", error);
        }
      }

      return {
        props: {
          users,
          usersUnavailableReason: null,
        },
      };
    },
  },
};

function getStrategy({ static: isStatic }) {
  const strategy = Object.entries(pageDataStrategies).find(
    ([, config]) => config.static === isStatic,
  );

  if (!strategy) {
    throw new Error(
      `No page data strategy found for static=${isStatic}`,
    );
  }

  const [name, config] = strategy;
  return { name, ...config };
}

module.exports = {
  pageDataStrategies,
  getStaticStrategy: () => getStrategy({ static: true }),
  getServerStrategy: () => getStrategy({ static: false }),
};
