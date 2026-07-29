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
      pipeline.ts     # withCommon HoF (auth + future middleware)
    frontend/         # Client-only code
      api/client.ts   # API client for fetching from /api routes
      auth-client.ts  # Neon Auth client-side SDK
      stores/         # Zustand stores
    components/       # Shared React components (use when reused 2+ times)
      ui/             # Primitives: Button, Input, Card
    shared/           # Used by both backend and frontend
      types/          # DB types (NoteRow, NoteInsert, etc.)
      constants/      # Shared constants
  app/                # Next.js routing — pages and API routes only
```

## Import Aliases

- `@/backend/*` → `src/lib/backend/*`
- `@/frontend/*` → `src/lib/frontend/*`
- `@/components/*` → `src/lib/components/*`
- `@/types` → `src/lib/shared/types/`
- `@/constants` → `src/lib/shared/constants/`

Never use relative imports across directories. Use aliases.

## Data Flow

```
Component → API route → withCommon → Service → Repository → DB
                         ├─ withAuth
                         ├─ withRateLimit (later)
                         └─ withLogging (later)
```

- Components **never** import from `@/backend`
- Components call API routes via `@/frontend/api/client`
- API routes use `withCommon(handler)` — auth is automatic
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

- Extract to `src/lib/components/` when used **more than once**
- One component per file, named export
- Components should be **composable** — split into sub-components, compose upward
- Use UI primitives from `@/components/ui` for raw elements
- Never use raw HTML elements when a UI primitive exists

### UI Primitives (`@/components/ui`)

- **Button** — `<Button variant="primary|secondary|destructive|ghost" size="sm|md|lg">`
- **Input** — `<Input placeholder="..." />`
- **Card** — `<Card><CardHeader><CardTitle>...</CardTitle></CardHeader><CardContent>...</CardContent></Card>`

Import from barrel: `import { Button, Input, Card } from "@/components/ui"`

## Types

- Data types (from DB/API) go in `src/lib/shared/types/`
- Component-specific callbacks can stay inline: `onDelete: () => void`
- Data props must use shared types: `note: NoteRow` not `note: { id: string; ... }`
- Import with: `import type { NoteRow } from "@/types"`

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

export const GET = withCommon(async ({ userId }) => {
  // userId is guaranteed by withAuth middleware
  const notes = await listNotes(userId);
  return NextResponse.json(notes);
});
```

Add new middleware in `pipeline.ts` — runs in order, short-circuits on error.

## Architecture Checks

Run `bun run check` — 15 boundary checks run automatically on commit:

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
14. Magic numbers in constants
15. Data props use shared types

## Scripts

- `bun run dev` — start dev server
- `bun run build` — type check + build
- `bun run lint` — biome check
- `bun run check` — architecture checks
- `bun run test` — e2e tests (hurl)
- `bun run db:reset` — drop + re-migrate database
