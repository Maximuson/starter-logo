/**
 * Database seed script.
 *
 * "Seeding" means inserting starter/demo data so the app is not empty on first run.
 * This is useful in development and in Cursor Cloud Agents where the local database
 * is recreated each session.
 *
 * Run manually:
 *   npm run db:seed
 *
 * Also runs automatically from docker-entrypoint.sh before `next dev`.
 */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: "alice@example.com", name: "Alice" },
    { email: "bob@example.com", name: "Bob" },
    { email: "carol@example.com", name: "Carol" },
  ];

  for (const user of users) {
    // upsert = update if the row exists, otherwise create it.
    // We key on `email` so re-running the seed does not create duplicates.
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name },
      create: user,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
