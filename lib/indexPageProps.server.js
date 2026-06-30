/**
 * Server-side loader for Docker, Cursor Cloud, and normal builds.
 * Fetches users from Postgres on every request.
 */
const { prisma } = require("./prisma");

async function fetchUsers() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  } catch (error) {
    console.error("Failed to load users:", error);
    return [];
  }
}

export async function getServerSideProps() {
  const users = await fetchUsers();
  return {
    props: {
      users,
      usersUnavailableReason: null,
    },
  };
}
