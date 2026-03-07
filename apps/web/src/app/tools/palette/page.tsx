import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'AI Palette Generator — WokTool',
  description: 'Generate beautiful, high-contrast color palettes using AI models. Export for CSS, Tailwind, or JSON.',
};

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="palette" label="AI Palette Generator" description="Generate harmonious color palettes with AI. Export CSS variables, Tailwind config, or JSON." icon="🎨">
      <Client />
    </ToolShell>
  );
}
