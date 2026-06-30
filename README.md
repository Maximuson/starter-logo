# starter-logo

A minimal **Next.js** front-end app with a small **full-stack example**: Postgres database, **Prisma** ORM, **Docker Compose**, and **Cursor Cloud Agent** support.

Click the **"New App"** heading to add animated comet dots. Below it, the page also loads **users from a database** to demonstrate backend basics.

This README is written for **frontend developers** who are new to backend concepts.

---

## Table of contents

1. [What is full-stack in this project?](#what-is-full-stack-in-this-project)
2. [Tech stack and why we use it](#tech-stack-and-why-we-use-it)
3. [How everything connects](#how-everything-connects)
4. [Project structure](#project-structure)
5. [Key concepts explained](#key-concepts-explained)
6. [Environment variables (.env)](#environment-variables-env)
7. [Run locally](#run-locally)
8. [Useful commands](#useful-commands)
9. [How the database example works](#how-the-database-example-works)
10. [Prisma workflow: schema, migrations, seed](#prisma-workflow-schema-migrations-seed)
11. [Docker and Docker Compose](#docker-and-docker-compose)
12. [Cursor Cloud Agents](#cursor-cloud-agents)
13. [Using a remote database instead](#using-a-remote-database-instead)
14. [Common tasks](#common-tasks)
15. [Troubleshooting](#troubleshooting)

---

## What is full-stack in this project?

As a frontend developer, you usually work with:

- React components
- CSS
- data from an API

**Backend** means the parts that:

- store data permanently (database)
- run on the server, not in the browser
- connect to the database

In this repo, the backend pieces are small on purpose:

| Layer | What it does in this repo |
|-------|---------------------------|
| **PostgreSQL** | Stores users in a `User` table |
| **Prisma** | Lets you read/write users with JavaScript instead of raw SQL |
| **Next.js server** | Fetches users in `getServerSideProps` before the page renders |
| **Docker Compose** | Starts the app and database together with one command |

You still write React like before. The new part is: **the page gets data from a real database**.

---

## Tech stack and why we use it

| Tool | What it is | Why we use it |
|------|------------|---------------|
| **Next.js 16** | React framework | File-based routing, server-side data fetching |
| **React 19** | UI library | Components and interactivity |
| **Tailwind CSS 4** | Styling | Utility-first CSS |
| **PostgreSQL** | Relational database | Industry-standard SQL database for structured data |
| **Prisma** | ORM (Object-Relational Mapper) | Type-safe database access from JavaScript |
| **Docker** | Container platform | Same environment on your machine and in the cloud |
| **Docker Compose** | Multi-container tool | Start app + database together |
| **Cursor Cloud Agents** | Remote dev environment | Automated setup in the cloud |

### What is an ORM?

Without Prisma you might write:

```sql
SELECT id, name, email FROM "User" ORDER BY id ASC;
```

With Prisma you write:

```js
await prisma.user.findMany({
  orderBy: { id: "asc" },
  select: { id: true, name: true, email: true },
});
```

Prisma translates that to SQL for you.

---

## How everything connects

```mermaid
flowchart TB
  subgraph browser [Your browser]
    UI[React page]
  end

  subgraph appContainer [app container - Next.js]
    GSSP[getServerSideProps]
    Prisma[lib/prisma.js]
  end

  subgraph dbContainer [db container - Postgres]
    Table[User table]
  end

  UI -->|HTTP request| GSSP
  GSSP --> Prisma
  Prisma -->|DATABASE_URL| Table
  GSSP -->|props: users| UI
```

### Request flow (simplified)

1. You open `http://localhost:3000`
2. Next.js runs `getServerSideProps()` on the **server**
3. Server code calls `prisma.user.findMany()`
4. Prisma connects to Postgres using `DATABASE_URL`
5. Users are returned as plain JSON props to the React component
6. React renders the list

The browser **never** gets database credentials. That is an important security rule.

---

## Project structure

```
starter-logo/
├── pages/
│   ├── index.js          # Home page + getServerSideProps (loads users)
│   └── _app.js           # App wrapper, imports global CSS
├── lib/
│   └── prisma.js         # Shared Prisma client (DB connection)
├── prisma/
│   ├── schema.prisma     # Database models (tables)
│   ├── seed.js           # Demo data (Alice, Bob, Carol)
│   └── migrations/       # Versioned SQL schema changes
├── assets/style/
│   └── main.css          # Global styles + users section styles
├── .cursor/
│   ├── environment.json  # Cursor Cloud Agent boot config
│   └── install.sh        # Installs Docker on cloud VM
├── docker-compose.yml    # Defines app + db services
├── Dockerfile            # Builds the app container image
├── docker-entrypoint.sh  # migrate + seed + next dev on container start
├── .env.example          # Default environment variables (committed)
├── .env                  # Your local overrides (gitignored)
└── package.json          # npm scripts and dependencies
```

### Two different Dockerfiles?

There is only **one** Dockerfile now: the **app** image at the project root.

`.cursor/install.sh` configures the **Cursor Cloud VM** itself. It is not a Docker image for your app.

---

## Key concepts explained

### Database

A database stores data in **tables** (like spreadsheets).

Our `User` table has columns:

| Column | Type | Example |
|--------|------|---------|
| `id` | number | `1` |
| `email` | string | `alice@example.com` |
| `name` | string | `Alice` |
| `createdAt` | date/time | auto-set on create |

### `DATABASE_URL`

A single connection string that tells the app how to reach the database:

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

Example in Docker Compose:

```
postgresql://app:app@db:5432/app
```

- `app:app` = username and password
- `db` = hostname (the Postgres **service name** in `docker-compose.yml`)
- `5432` = Postgres port
- `app` = database name

**Important:** Inside the app container, use `db` as host. On your laptop outside Docker, use `localhost`.

### Migrations

A **migration** is a saved SQL change to the database schema.

When you add a new field or table, you create a migration and commit it to git. Everyone (and every server) applies the same migrations, so all databases stay in sync.

### Seed

**Seeding** inserts starter data (demo users) so the app is not empty.

Our seed is **idempotent**: running it again updates existing rows instead of creating duplicates.

### `getServerSideProps`

A Next.js Pages Router feature that runs on the **server** before render.

```js
export async function getServerSideProps() {
  const users = await prisma.user.findMany();
  return { props: { users } };
}
```

The React component receives `users` as a prop.

---

## Environment variables (.env)

Environment variables are configuration values outside your code.

| File | Committed to git? | Purpose |
|------|-------------------|---------|
| `.env.example` | Yes | Documented defaults for the team |
| `.env` | No | Your local machine values |

### Main variables

| Variable | Used by | Example |
|----------|---------|---------|
| `APP_PORT` | Docker Compose | `3000` |
| `POSTGRES_USER` | Postgres container | `app` |
| `POSTGRES_PASSWORD` | Postgres container | `app` |
| `POSTGRES_DB` | Postgres container | `app` |
| `POSTGRES_PORT` | Docker Compose | `5432` |
| `DATABASE_URL` | Prisma / Next.js app | `postgresql://app:app@db:5432/app` |
| `WATCHPACK_POLLING` | Next.js in Docker | `true` |

Create your local file:

```bash
cp .env.example .env
```

---

## Run locally

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose
- (Optional) Node.js 24 if you want to run Next.js outside Docker

### Quick start (recommended)

```bash
# 1. Create local env file
cp .env.example .env

# 2. Start app + database
npm run up

# 3. Open the app
# http://localhost:3000
```

On first start, the app container will:

1. Apply database migrations
2. Seed sample users
3. Start `next dev`

### Stop everything

```bash
npm run down
```

### View logs

```bash
npm run logs
```

---

## Useful commands

| Command | What it does |
|---------|--------------|
| `npm run up` | Start Docker Compose in background |
| `npm run down` | Stop all containers |
| `npm run logs` | Follow container logs |
| `npm run dev` | Start Next.js dev server (used inside container) |
| `npm run build` | Production build |
| `npm run db:migrate` | Apply migrations to the database |
| `npm run db:seed` | Insert demo users |
| `npm run db:setup` | Migrate + seed |

---

## How the database example works

### 1. Schema (`prisma/schema.prisma`)

Defines the `User` model (table structure).

### 2. Migration (`prisma/migrations/...`)

SQL that creates the `User` table in Postgres.

### 3. Seed (`prisma/seed.js`)

Inserts Alice, Bob, and Carol.

### 4. Prisma client (`lib/prisma.js`)

One shared database connection for the app.

### 5. Page (`pages/index.js`)

```js
// Server-side: runs before HTML is sent to browser
export async function getServerSideProps() {
  const users = await prisma.user.findMany();
  return { props: { users } };
}

// Client/server: renders the UI
const Home = ({ users }) => { ... };
```

---

## Prisma workflow: schema, migrations, seed

### Change the database schema

1. Edit `prisma/schema.prisma`
2. Create a migration:

```bash
npx prisma migrate dev --name describe_your_change
```

3. Commit the new file in `prisma/migrations/`

### Regenerate the client after schema changes

```bash
npx prisma generate
```

`postinstall` in `package.json` also runs this after `npm install`.

### Open a visual database browser

```bash
npx prisma studio
```

---

## Docker and Docker Compose

### What is Docker?

Docker runs apps in **containers** — lightweight isolated environments with their own filesystem and dependencies.

### What is Docker Compose?

Compose runs **multiple containers** from one config file.

Our `docker-compose.yml` defines:

| Service | Image | Port |
|---------|-------|------|
| `app` | Built from `Dockerfile` | 3000 |
| `db` | `postgres:16-alpine` | 5432 |

### Why mount volumes?

```yaml
volumes:
  - .:/app
  - /app/node_modules
```

- `.:/app` — edit code on your machine, see changes in the container (hot reload)
- `/app/node_modules` — keep Linux container dependencies separate from your host

### What does `docker-entrypoint.sh` do?

Every time the app container starts:

```sh
npx prisma migrate deploy   # apply migrations
npx prisma db seed          # insert demo users
exec npm run dev            # start Next.js
```

---

## Cursor Cloud Agents

Cursor can run this repo in a remote cloud VM.

### Boot sequence

1. `.cursor/install.sh` — create `.env`, install Docker (once)
2. `.cursor/environment.json` `start` — `docker compose up -d --build`
3. App container runs migrate + seed + dev server
4. Port `3000` is forwarded to you

### Files involved

| File | Role |
|------|------|
| `.cursor/environment.json` | Tells Cursor what to run on boot |
| `.cursor/install.sh` | One-time cloud VM setup |

### Data persistence in the cloud

The local Postgres container is great for development, but **data inside the cloud VM is usually temporary** between agent sessions.

For data that must survive longer, use a **remote database** (Neon, Supabase, etc.) and set `DATABASE_URL` in [Cursor Secrets](https://cursor.com/dashboard/cloud-agents).

---

## Using a remote database instead

If you use Neon, Supabase, or another hosted Postgres:

1. Remove or stop using the `db` service in `docker-compose.yml`
2. Set `DATABASE_URL` in `.env` to your remote connection string
3. Keep `DATABASE_URL` on the `app` service

Example:

```env
DATABASE_URL=postgresql://user:pass@ep-example.neon.tech/neondb?sslmode=require
```

You do **not** need `POSTGRES_USER`, `POSTGRES_PASSWORD`, or `POSTGRES_DB` when there is no local `db` container.

---

## Common tasks

### Add a new field to User

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_field_name`
3. Use the new field in your page or API code

### Add a new table

1. Add a new `model` in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_posts_table`
3. Query it with `prisma.post.findMany()` etc.

### Fetch users on the client instead (not recommended for secrets)

For learning, we use `getServerSideProps`. Another pattern is an API route:

```
pages/api/users.js  →  returns JSON
client fetch('/api/users')
```

Use server-side fetching when you can. It keeps database access off the client.

---

## Troubleshooting

### `Can't reach database server`

- Is Postgres running? `npm run up`
- Check `DATABASE_URL`
  - Inside Docker app container: host must be `db`
  - On host machine: host must be `localhost`

### Page shows no users

```bash
npm run db:setup
```

Or restart containers so `docker-entrypoint.sh` runs again.

### Port 3000 already in use

Change `APP_PORT` in `.env`:

```env
APP_PORT=3001
```

Then open `http://localhost:3001`.

### Prisma Client out of sync

```bash
npx prisma generate
```

### Docker changes not appearing

Rebuild containers:

```bash
docker compose up -d --build
```

---

## Learn more

- [Next.js docs](https://nextjs.org/docs)
- [Prisma docs](https://www.prisma.io/docs)
- [PostgreSQL tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Docker Compose docs](https://docs.docker.com/compose/)
- [Cursor Cloud Agents setup](https://cursor.com/docs/cloud-agent/setup)

---

## License

ISC
