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

## Stack

| Tool | Purpose | Docs |
|------|---------|------|
| [Neon](https://neon.tech) | Serverless Postgres | [Docs](https://neon.com/docs) |
| [Neon Auth](https://neon.com/docs/auth) | Email OTP + sessions | [Quickstart](https://neon.com/docs/auth/quick-start/nextjs-api-only) |
| [Kysely](https://kysely-org.github.io/kysely/) | Type-safe query builder | [Docs](https://kysely-org.github.io/kysely/) |
| [dbmate](https://github.com/amacneil/dbmate) | SQL migrations | [README](https://github.com/amacneil/dbmate) |
| [jose](https://github.com/panva/jose) | JWT/JWKS verification | [Docs](https://github.com/panva/jose#readme) |

## Project Structure

```
db/migrations/         SQL migrations (dbmate)
src/lib/db/            Kysely setup + generated types
src/lib/auth/          Neon Auth server + client + JWKS
src/actions/           Server actions for CRUD
src/app/auth/          Auth views (sign-in, sign-up, OTP)
src/app/dashboard/     Protected notes dashboard
src/app/api/protected/ JWT-authenticated API endpoint
```

## License

MIT
