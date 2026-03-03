# Contributing to WokTool

Thanks for wanting to help make WokTool better! Every tool addition, bug fix, and improvement is welcome.

## Adding a New Tool

Adding a tool takes ~3 steps:

### 1. Create the tool page

```
apps/web/src/app/tools/<your-tool-name>/page.tsx
```

```tsx
import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';
import YourTool from '@/components/tools/YourTool';

export const metadata: Metadata = {
  title: 'Your Tool Name',
  description: 'One-sentence description of what it does.',
};

export default function YourToolPage() {
  return (
    <ToolShell id="your-tool-name" label="Your Tool Name" description="..." icon="🔧">
      <YourTool />
    </ToolShell>
  );
}
```

### 2. Create the tool component

```
apps/web/src/components/tools/YourTool.tsx
```

```tsx
'use client';

export default function YourTool() {
  // All client-side logic here
  return <div>...</div>;
}
```

**Rules:**
- Mark as `'use client'` at the top
- No server-side imports (`fs`, `path`, database calls, etc.)
- No authentication required
- Should work with zero configuration (API-key tools are OK but must degrade gracefully)

### 3. Register the tool

Add an entry to `apps/web/src/lib/tools-registry.ts`:

```ts
{
  id: 'your-tool-name',
  label: 'Your Tool Name',
  description: 'One-sentence description shown on the hub card.',
  href: '/tools/your-tool-name',
  tags: ['dev'],           // Pick from: image, design, dev, gamedev, pdf, text, crypto, audio, collab, misc
  icon: '🔧',             // Emoji icon shown on the card
  status: 'live',         // 'live' | 'beta' | 'soon'
  clientOnly: true,       // true if no server/API key needed
  isNew: true,            // Set true for first release, remove after a few weeks
},
```

## Tool Guidelines

- **Client-side first** — if a tool can run in the browser, it should
- **No tracking** — don't add analytics or tracking to tools
- **No auth** — tools must work without login
- **Privacy** — user data should not leave the browser unless the tool explicitly needs to call an API
- **Accessible** — use semantic HTML, keyboard navigable
- **Fast** — tools should load quickly; lazy-load heavy dependencies

## Development

```bash
cd apps/web
npm install
npm run dev
```

## Pull Request Checklist

- [ ] Tool page created at `apps/web/src/app/tools/<name>/page.tsx`
- [ ] Tool component at `apps/web/src/components/tools/<Name>Tool.tsx`
- [ ] Registry entry in `tools-registry.ts`
- [ ] `npm run build` passes with no new errors
- [ ] Tool works without any API keys (or degrades gracefully)

## Issues

- Bug reports and feature requests welcome via [GitHub Issues](https://github.com/WokSpec/WokTool/issues)
- For security issues, see [SECURITY.md](./SECURITY.md)

## License

By contributing, you agree your contributions are licensed under Apache 2.0.
