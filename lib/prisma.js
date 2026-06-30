/**
 * Shared Prisma client for the whole Next.js app.
 *
 * Prisma is an ORM (Object-Relational Mapper). Instead of writing raw SQL like
 * `SELECT * FROM "User"`, you call JavaScript methods such as
 * `prisma.user.findMany()`.
 *
 * Why a separate file?
 * - One database connection is reused across imports.
 * - In development, Next.js hot reload can create many connections unless we
 *   store the client on `globalThis`.
 *
 * Usage:
 *   const { prisma } = require("../lib/prisma");
 *   const users = await prisma.user.findMany();
 */
const { PrismaClient } = require("@prisma/client");

const globalForPrisma = globalThis;

// Reuse the same client in dev after hot reloads.
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = { prisma };
