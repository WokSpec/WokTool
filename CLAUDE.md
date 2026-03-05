# WokTool — Agent Context

> Read this before touching anything. This file is consumed by Claude Code, GitHub Copilot, Sweep, and other agents.

---

## What this is

`tools.wokspec.org` — 80+ free, browser-based dev and design tools. No login. No data leaves the browser. Everything runs client-side.

**Live at**: https://tools.wokspec.org  
**License**: MIT  
**Stack**: Next.js 14 (App Router) · TypeScript · Tailwind CSS  
**Runtime**: Browser only — all tools run 100% client-side  
**Monorepo root**: `/WokTool/` — web app lives at `apps/web/`

---

## Repo structure

```
apps/web/
  src/
    app/
      page.tsx                  # Hub homepage — renders ToolsHubClient
      layout.tsx                # Root layout — Nav + globals.css
      globals.css               # All CSS: design tokens + utility classes + toolhub-* + tool-shell-* + cmd-*
      tools/
        page.tsx                # /tools — redirects or same as hub
        page-client.tsx         # Hub: category sidebar, search, popular, starred, recently used, grouped grid
        [tool-slug]/            # One directory per tool
          page.tsx              # Server component (metadata)
          page-client.tsx       # Client component (the actual tool UI)
    components/
      Nav.tsx                   # Navigation bar — includes CommandPalette, Cmd+K trigger
      CommandPalette.tsx        # Cmd+K modal — searches all tools, keyboard nav, popular tools default
      ToolShell.tsx             # Wrapper for every tool page — breadcrumb, header, coming-soon state
      TutorialOverlay.tsx       # Onboarding tutorial overlay
      tools/                   # Individual tool React components
        JsonTool.tsx
        RegexTesterTool.tsx
        ... (80+ files)
    lib/
      tools-registry.ts         # SINGLE SOURCE OF TRUTH for all tool definitions (id, label, description, href, tags, icon, status)
```

---

## The tools registry

**`src/lib/tools-registry.ts` is the most important file.** Every tool must be registered here.

```typescript
export interface ToolDef {
  id: string;          // kebab-case, unique, matches the /tools/{id} route
  label: string;       // Display name
  description: string; // 1-2 sentences, shown on card and in command palette
  href: string;        // Always /tools/{id}
  tags: ToolTag[];     // First tag = primary category (affects card color)
  icon: string;        // Single emoji
  status: 'live' | 'beta' | 'soon';
  clientOnly?: boolean;
  isNew?: boolean;     // Show "New" badge on card
}
```

To add a new tool:
1. Add entry to `TOOLS` array in `tools-registry.ts`
2. Create `src/app/tools/{id}/page.tsx` (metadata)
3. Create `src/app/tools/{id}/page-client.tsx` (the tool UI)
4. Create `src/components/tools/{PascalCaseName}Tool.tsx` (or inline in page-client)

---

## Tag system and category colors

Tags drive both filtering and card accent colors. The `TAG_COLORS` map in `CommandPalette.tsx` is the source of truth:

| Tag | Color | Use for |
|-----|-------|---------|
| `image` | `#f472b6` | Image manipulation tools |
| `design` | `#a78bfa` | Visual design, CSS, typography |
| `dev` | `#60a5fa` | Developer utilities |
| `gamedev` | `#4ade80` | Game development tools |
| `audio` | `#fb923c` | Audio processing |
| `crypto` | `#fbbf24` | Cryptocurrency / Web3 |
| `collab` | `#2dd4bf` | Collaboration tools |
| `text` | `#818cf8` | Text processing |
| `pdf` | `#f87171` | PDF tools |
| `json` | `#60a5fa` | JSON-specific tools |

First tag in the `tags` array is the primary category — it determines the card accent color.

---

## CSS conventions

All styles live in `src/app/globals.css`. Class naming conventions:

| Prefix | Used for |
|--------|----------|
| `.toolhub-*` | Hub page (sidebar, grid, cards, hero, search) |
| `.tool-shell-*` | Individual tool page wrapper |
| `.cmd-*` | Command palette modal |
| `.tool-*` | Shared tool UI primitives (buttons, inputs, panels) |
| `.btn-*` | Button variants |

Design tokens are CSS variables defined at `:root`. Always use tokens, never hardcoded hex:
```css
/* ✅ */
color: var(--text-primary);
background: var(--accent-subtle);

/* ❌ */
color: #ededed;
background: rgba(129, 140, 248, 0.08);
```

---

## All tools are client-side only

Every tool component must:
- Have `'use client'` at the top
- Never make API calls to external servers
- Never send user data anywhere
- Work entirely from browser APIs (Canvas, FileReader, crypto.subtle, etc.)

If a tool needs an API (e.g., AI-powered), it should be clearly marked in the registry with a note and only call WokSpec-controlled endpoints.

---

## ToolShell wrapper

Every tool page should use `ToolShell` for consistent layout:

```tsx
import ToolShell from '@/components/tools/ToolShell';

export default function MyToolClient() {
  return (
    <ToolShell
      id="my-tool"
      label="My Tool"
      description="Short description shown under the title."
      icon="🔧"
    >
      {/* tool UI here */}
    </ToolShell>
  );
}
```

If the tool is not yet implemented, pass `comingSoon` and it will render a placeholder.

---

## Hub page features

- **Recently Used** — localStorage `toolhub-recent`, last 4 tools visited
- **Starred** — localStorage `toolhub-starred`, user-bookmarked tools
- **Popular** — hardcoded curated list shown to new users (no history)
- **Category sidebar** — filters by tag, updates URL with `?category=`
- **Inline search** — filters by label/description/tag, updates URL with `?q=`
- **Command palette** — Cmd+K, searches all tools, keyboard nav

---

## Commit conventions

```
feat(tools):     add new tool to registry + page
fix(tools):      fix tool behaviour
chore(deps):     update dependencies
refactor(hub):   refactor hub layout
style(css):      CSS/design changes
docs:            documentation
```

`Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>` required on every commit.

---

## Before committing

```bash
cd apps/web
npx tsc --noEmit          # must be 0 errors
npx eslint src/ --max-warnings 0  # must be 0 errors
```

---

## Known gotchas

- **`continue-on-error: true` was removed** from the typecheck step in CI — type errors now fail the build correctly.
- Tools with heavy dependencies (e.g., `@imgly/background-removal`, `tldraw`) are dynamically imported to avoid bundle bloat.
- The tools registry has `111` tools as of early 2026. The hub search and command palette both reference `TOOLS.length` dynamically — no need to update the count string manually.
- `TAG_COLORS` in `CommandPalette.tsx` must stay in sync with `TAG_LABELS` in `tools-registry.ts`.
