# Project Conventions

## File Structure

```
src/
  lib/
    backend/          # Server-only code — never import in client components
      auth/           # Neon Auth (server, client, jwks, middleware)
      db/             # Kysely connection
      repositories/   # Raw DB queries (one file per table)
      services/       # Business logic, validation (one file per domain)
      pipeline/       # withCommon HoF, middleware, error handling, debug injection
    frontend/         # Client-only code
      api/client.ts   # API client for fetching from /api routes
      auth-client.ts  # Neon Auth client-side SDK
      components/     # React components (use when reused 2+ times)
        ui/           # Primitives: Button, Input, Card
      stores/         # Zustand stores
    shared/           # Used by both backend and frontend
      types/          # DB types (NoteRow, NoteInsert, etc.)
      constants/      # Shared constants
      errors.ts       # Custom error classes
      logger.ts       # Logging utility (inject sink from backend)
  app/                # Next.js routing — pages and API routes only
```

## Import Aliases

- `@/backend/*` → `src/lib/backend/*`
- `@/frontend/*` → `src/lib/frontend/*`
- `@/components/*` → `src/lib/frontend/components/*`
- `@/types` → `src/lib/shared/types/`
- `@/constants` → `src/lib/shared/constants/`

Never use relative imports across directories. Use aliases.

## Data Flow

```
Component → API route → withCommon(pipeline) → Service → Repository → DB
                         ├─ withAuth
                         ├─ withRateLimit (later)
                         └─ withLogging (later)
```

- Components **never** import from `@/backend`
- Components call API routes via `@/frontend/api/client`
- API routes use `withCommon(handler)` — auth is automatic. Use `withCommon({ auth: false })(handler)` for public routes.
- Services are async, call repositories
- Repositories are raw Kysely queries

## Code Style

- **Bottom-up functional approach** — small pure functions, compose upward
- **Early return, early continue** — guard clauses over nesting
- **No comments** unless explaining why, not what
- **No placeholders, TODOs, or meta-comments** unless explicitly asked
- **Prefer clarity over cleverness**

## File Limits

- Keep files under **300 lines**. Split when exceeding.
- Exception: generated files, large data fixtures, or config that can't be split.

## Components

- Extract to `src/lib/frontend/components/` when used **more than once**
- One component per file, named export
- Components should be **composable** — split into sub-components, compose upward
- Use UI primitives from `@/components/ui` for raw elements
- Never use raw HTML elements when a UI primitive exists
- Filenames must be kebab-case (e.g. `note-card.tsx`)

### UI Primitives (`@/components/ui`)

- **Button** — `<Button variant="primary|secondary|destructive|ghost" size="sm|md|lg">`
- **Input** — `<Input placeholder="..." />`
- **Card** — `<Card><CardHeader><CardTitle>...</CardTitle></CardHeader><CardContent>...</CardContent></Card>`

Import from barrel: `import { Button, Input, Card } from "@/components/ui"`

## Types

- DB types are auto-generated in `src/lib/shared/types/db.ts` via `kysely-codegen`
- Re-exported from `src/lib/shared/types/index.ts` with convenience aliases (`NoteRow`, `NoteInsert`)
- After migrations, run `bun run types:generate` to update types
- Component-specific callbacks can stay inline: `onDelete: () => void`
- Data props must use shared types: `note: NoteRow` not `note: { id: string; ... }`
- Import with: `import type { NoteRow } from "@/types"`
- Filenames must be lowercase (e.g. `notes.ts`)

## Errors

Use custom error classes from `@/lib/shared/errors`:

```ts
import { NotFoundError, ValidationError } from "@/lib/shared/errors";

throw new NotFoundError("Note", noteId);
throw new ValidationError("Title cannot be empty");
```

The `withCommon` pipeline catches these and returns proper JSON responses:

```json
{ "error": "Note with id 123 not found", "code": "NOT_FOUND" }
```

Available errors:

- `AppError` — base class (500)
- `NotFoundError` — resource not found (404)
- `UnauthorizedError` — auth required (401)
- `ValidationError` — invalid input (400)
- `ConflictError` — duplicate resource (409)

## Tailwind

Use only the tokens defined in the `@theme` block in `globals.css`.

**Colors:** `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `ring`
**Spacing/Sizing:** Use Tailwind's default scale (1-96)
**Fonts:** `font-sans`, `font-mono`

## Server vs Client

- Server Components: default, no directive needed
- Client Components: `"use client"` at top
- Server Actions: `"use server"` at top, in services only
- Never pass non-serializable values (Date, Map, Set, class instances) from server to client

## Backend Layers

1. **Repositories** — raw Kysely queries, no business logic
2. **Services** — validation, orchestration. Call repositories. Are server actions.
3. **API Routes** — use `withCommon(handler)`, call services

## API Routes

All API routes must use the `withCommon` pipeline:

```ts
import { withCommon } from "@/backend/pipeline";
import { listNotes } from "@/backend/services/notes";

// With auth (default)
export const GET = withCommon(async ({ userId }) => {
  const notes = await listNotes(userId);
  return NextResponse.json(notes);
});

// Without auth
export const GET = withCommon({ auth: false })(async () => {
  return NextResponse.json({ status: "ok" });
});

// Custom rate limit
export const POST = withCommon({ rateLimit: { max: 10, windowMs: 60_000 } })(async ({
  userId,
  body,
}) => {
  // ...
});
```

`withCommon` is curried: `withCommon(handler)` or `withCommon(config)(handler)`.

Config options:

- `auth: false` — skip auth middleware (default: `true`)
- `rateLimit: false` — disable rate limiting (default: `{ max: 100, windowMs: 60_000 }`)
- `rateLimit: { max, windowMs }` — custom rate limit per endpoint

Rate limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`) are added to every response.

Add new middleware in `pipeline/middleware.ts` — runs in order, short-circuits on error.

## Health Endpoint

`GET /api/health` — public, no auth. Checks DB connectivity with in-memory caching (successes cached 10s, failures always re-checked). Used by test pre-flight to detect missing migrations.

## Auth

The `withAuth` middleware supports two auth methods:

1. **Neon Auth sessions** — cookies, used by web UI
2. **JWT tokens** — `Authorization: Bearer <token>`, used by API clients/mobile apps

JWT verification uses `JWT_SECRET` from `.env`. Generate with:

```bash
openssl rand -base64 32
```

## Debug Mode

In development, add `?debug=1` to any API route to get debug info:

```json
[
  { "data": "..." },
  {
    "__debug": {
      "logs": [...],
      "queries": [{ "sql": "...", "params": [...], "duration": 12 }]
    },
    "__hint": "Without ?debug=1, only array[0] is returned."
  }
]
```

## Logging

Use the logger from `@/lib/shared/logger`:

```ts
import { logger } from "@/lib/shared/logger";

logger.info("User created", { userId: "123" });
logger.error("Database error", error);
```

Set `LOG_LEVEL` in `.env` to control output: `debug`, `info`, `warn`, `error`.

Set `DB_DEBUG=true` to log all database queries.

## Architecture Checks

Run `bun run check` — 18 boundary checks run automatically on commit:

1. No backend imports in client code
2. No raw fetch() in components
3. No "use server" in client code
4. API routes must use withCommon
5. No direct DB imports outside repositories
6. No relative imports
7. No raw process.env
8. Files under 300 lines
9. No raw SQL (use Kysely)
10. No hardcoded URLs/ports
11. No default exports in components
12. No barrel re-exports
13. No magic numbers
14. Data props use shared types
15. Inline types use shared types
16. Migrations have up and down blocks
17. Filename standards (kebab-case components, lowercase services/repos, snake_case migrations)
18. No inline error status codes (use custom error classes)

## Scripts

- `bun run dev` — start dev server
- `bun run build` — type check + build
- `bun run lint` — biome check
- `bun run check` — architecture checks
- `bun run test` — e2e tests (hurl), with pre-flight checks for server/DB health
- `bun run db:migrate` — run pending migrations
- `bun run create:component <Name>` — scaffold component (PascalCase)
- `bun run create:service <name>` — scaffold service (lowercase)
- `bun run create:repository <name>` — scaffold repository (lowercase)
- `bun run create:migration <name>` — scaffold migration (snake_case)
