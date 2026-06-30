-- Initial migration: create the "User" table.
--
-- Migrations are versioned SQL files that change the database schema over time.
-- Commit them to git so every developer and every environment gets the same tables.
--
-- Apply migrations:
--   npm run db:migrate
--
-- This file was generated from prisma/schema.prisma.

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
