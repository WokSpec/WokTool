import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';
import Client from './_client';
export const metadata: Metadata = {
  title: 'ASCII Art Generator — WokTool',
  description: 'Convert text to ASCII art with multiple font styles.',
};
export default function Page() {
  return (
    <ToolShell id="ascii-art" label="ASCII Art Generator" description="Convert text to ASCII art with multiple font styles including block letters and banners." icon="🎨">
      <Client />
    </ToolShell>
  );
}
