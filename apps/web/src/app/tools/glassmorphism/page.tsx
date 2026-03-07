import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';
import Client from './_client';
export const metadata: Metadata = {
  title: 'Glassmorphism Generator — WokTool',
  description: 'Generate glassmorphism card CSS with live preview. Adjust blur, transparency, and more.',
};
export default function Page() {
  return (
    <ToolShell id="glassmorphism" label="Glassmorphism Generator" description="Generate glassmorphism card CSS with live preview. Adjust blur, transparency, border radius, and color." icon="🪟">
      <Client />
    </ToolShell>
  );
}
