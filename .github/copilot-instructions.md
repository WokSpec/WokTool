# GitHub Copilot Instructions — WokTool

WokTool is an 80+ tool browser-based hub for developers and designers. Read `CLAUDE.md` at the repo root for full context.

## Critical Constraints

- **100% client-side**: All tools run entirely in the browser. Never add external API calls that send user data to a server.
- **tools-registry.ts is the single source of truth**: All tools defined in `apps/web/src/lib/tools-registry.ts`. Tool `id` must match the route path at `/tools/{id}`.
- **TAG_COLORS in CommandPalette.tsx**: Category accent colors live here — don't add colors elsewhere.
- **No login required**: Tools must work without authentication.

## Stack

- Next.js 14, TypeScript, App Router (monorepo: `apps/web/`)
- Deployed to Cloudflare Workers (via `@cloudflare/next-on-pages`)
- CSS: utility classes in `globals.css`, design tokens via CSS variables

## Key Patterns

```typescript
// Adding a new tool
// 1. Add entry to tools-registry.ts
// 2. Create apps/web/src/app/tools/{id}/page.tsx
// 3. Wrap with ToolShell (handles back nav, title, layout)
// 4. Mark 'use client' — tools must be client components
```

```typescript
// Category colors
import { TAG_COLORS } from '@/components/CommandPalette';
// --card-accent CSS variable set per card with TAG_COLORS[tool.tags[0]]
```

## CSS Tokens

- `--accent`: brand blue
- `--surface-base`, `--surface-raised`: dark backgrounds
- `--text-primary`, `--text-secondary`, `--text-muted`: typography scale
- `--border`: subtle border color

## Commit Format

`feat/fix/chore/refactor/docs/perf/style: description`

Always include: `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`
