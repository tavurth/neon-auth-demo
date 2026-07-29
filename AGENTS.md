<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Conventions

## File Structure

```
src/
  lib/
    backend/          # Server-only code — never import in client components directly
      auth/           # Neon Auth setup (server, client, jwks)
      db/             # Kysely connection
      repositories/   # Raw DB queries (one file per table)
      services/       # Business logic, validation (one file per domain)
    frontend/         # Client-only code
      stores/         # Zustand stores
    components/       # Shared React components (use when reused 2+ times)
    shared/           # Types used by both backend and frontend
      types.ts        # DB types (Note, NoteRow, NoteInsert, etc.)
  app/                # Next.js routing — pages and API routes only
```

## Import Aliases

- `@/backend/*` → `src/lib/backend/*`
- `@/frontend/*` → `src/lib/frontend/*`
- `@/components/*` → `src/lib/components/*`
- `@/types` → `src/lib/shared/types.ts`

Never use relative imports across directories. Use aliases.

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

- Extract to `src/lib/components/` when a component is used **more than once**
- One component per file, named export
- `"use client"` at top of file for client components

## Tailwind

Use only the tokens defined in the `@theme` block in `globals.css`. Do not use arbitrary values or inline styles when a theme token exists.

**Colors:** `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `ring`
**Spacing/Sizing:** Use Tailwind's default scale (1-96)
**Fonts:** `font-sans`, `font-mono`

## Server vs Client

- Server Components: default, no directive needed
- Client Components: `"use client"` at top
- Server Actions: `"use server"` at top, async functions only
- Never pass non-serializable values (Date, Map, Set, class instances) from server to client

## Backend Layers

1. **Repositories** — raw Kysely queries, no business logic
2. **Services** — validation, authorization, orchestration. Call repositories.
3. Frontend imports services directly (they are server actions)

## Testing

- Run `bun run lint` before committing
- Run `bun run build` to verify type safety
