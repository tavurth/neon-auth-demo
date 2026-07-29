# Neon Auth Demo

Notes app with [Neon Auth](https://neon.com/docs/auth), [Kysely](https://kysely-org.github.io/kysely/), and SQL migrations via [dbmate](https://github.com/amacneil/dbmate).

## Setup

1. Install dependencies:

```bash
bun install
```

2. Copy `.env.example` to `.env` and fill in your Neon credentials:

```bash
cp .env.example .env
```

3. Run migrations:

```bash
bunx dbmate up
```

4. Start the dev server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

| Tool | Purpose |
|------|---------|
| Neon Auth | Email OTP + session management |
| Kysely | Type-safe SQL query builder |
| dbmate | SQL migration runner |
| jose | JWT/JWKS verification |

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
