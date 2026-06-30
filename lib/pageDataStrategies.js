const { prisma } = require("./prisma");

const GITHUB_PAGES_MESSAGE =
  "Database demo is not available on static GitHub Pages hosting. Run with Docker locally or in Cursor Cloud to see live data.";

/**
 * Page data strategies — used by loaders in pages/index.js.
 *
 * static: true  → GitHub Pages (GithubStatic)
 * static: false → SSR (GithubRemove / getServerSideProps)
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

module.exports = { pageDataStrategies };
