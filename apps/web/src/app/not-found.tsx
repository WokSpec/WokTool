import Link from 'next/link';
import { TOOLS } from '@/lib/tools-registry';

const FEATURED = ['background-remover', 'json-tools', 'image-compress', 'color-tools', 'regex'];

export default function NotFound() {
  const featuredTools = FEATURED
    .map(id => TOOLS.find(t => t.id === id))
    .filter(Boolean) as typeof TOOLS;

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100dvh-52px)] px-4 text-center">
      <div className="mb-2 text-6xl font-bold text-zinc-700">404</div>
      <h1 className="mb-2 text-2xl font-semibold text-zinc-100">Page not found</h1>
      <p className="mb-8 text-zinc-400 max-w-sm">
        That tool or page doesn&apos;t exist. Try one of these popular tools below, or browse the full hub.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {featuredTools.map(tool => (
          <Link
            key={tool.id}
            href={tool.href}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-200 transition-colors"
          >
            <span>{tool.icon}</span>
            {tool.label}
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
      >
        Browse all 80+ tools →
      </Link>
    </main>
  );
}
