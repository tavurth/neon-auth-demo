# Neon Auth Demo

Notes app with [Neon Auth](https://neon.com/docs/auth), [Kysely](https://kysely-org.github.io/kysely/), and SQL migrations via [dbmate](https://github.com/amacneil/dbmate).

## Setup

1. [Create a Neon account](https://neon.tech) and start a project.

2. Enable Auth in your Neon dashboard under **Auth > Configuration**. Copy your Auth URL.

3. Install dependencies:

```bash
bun install
```

4. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

5. Generate a cookie secret:

```bash
openssl rand -base64 32
```

6. Run migrations:

```bash
bunx dbmate up
```

7. Start the dev server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                            | Description                       |
| ---------------------------------- | --------------------------------- |
| `bun run dev`                      | Start dev server                  |
| `bun run build`                    | Type check + build                |
| `bun run lint`                     | Biome lint + format               |
| `bun run check`                    | Architecture boundary checks      |
| `bun run test`                     | Hurl e2e tests                    |
| `bun run db:reset`                 | Drop + re-migrate database        |
| `bun run create:component <Name>`  | Scaffold a component (PascalCase) |
| `bun run create:service <name>`    | Scaffold a service (lowercase)    |
| `bun run create:repository <name>` | Scaffold a repository (lowercase) |
| `bun run create:migration <name>`  | Scaffold a migration (snake_case) |

## Stack

| Tool                                           | Purpose                 | Docs                                                                 |
| ---------------------------------------------- | ----------------------- | -------------------------------------------------------------------- |
| [Neon](https://neon.tech)                      | Serverless Postgres     | [Docs](https://neon.com/docs)                                        |
| [Neon Auth](https://neon.com/docs/auth)        | Email OTP + sessions    | [Quickstart](https://neon.com/docs/auth/quick-start/nextjs-api-only) |
| [Kysely](https://kysely-org.github.io/kysely/) | Type-safe query builder | [Docs](https://kysely-org.github.io/kysely/)                         |
| [dbmate](https://github.com/amacneil/dbmate)   | SQL migrations          | [README](https://github.com/amacneil/dbmate)                         |
| [jose](https://github.com/panva/jose)          | JWT/JWKS verification   | [Docs](https://github.com/panva/jose#readme)                         |
| [Biome](https://biomejs.dev)                   | Linting + formatting    | [Docs](https://biomejs.dev)                                          |
| [Hurl](https://hurl.dev)                       | E2E testing             | [Docs](https://hurl.dev)                                             |

## Project Structure

```
src/
  lib/
    backend/          # Server-only code
      auth/           # Neon Auth (server, client, middleware)
      db/             # Kysely connection
      repositories/   # Raw DB queries
      services/       # Business logic + server actions
      pipeline.ts     # withCommon HoF (auth + middleware)
    frontend/         # Client-only code
      api/client.ts   # API client for /api routes
      auth-client.ts  # Neon Auth client SDK
      stores/         # Zustand stores
    components/       # Shared React components
      ui/             # Primitives (Button, Input, Card)
    shared/           # Used by both backend and frontend
      types/          # DB types (NoteRow, NoteInsert, etc.)
      constants/      # Shared constants
      errors.ts       # Custom error classes
      logger.ts       # Logging utility
  app/                # Next.js routing
    api/              # API routes
    auth/             # Auth pages
    dashboard/        # Protected dashboard
db/migrations/        # SQL migrations (dbmate)
tests/
  architecture/       # 18 boundary checks
  e2e/                # Hurl e2e tests
```

## Architecture

```
Component → API route → withCommon → Service → Repository → DB
                         ├─ withAuth
                         ├─ withRateLimit (later)
                         └─ withLogging (later)
```

See [AGENTS.md](./AGENTS.md) for full conventions.

## License

MIT
