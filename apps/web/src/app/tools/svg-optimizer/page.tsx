import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'SVG Optimizer — WokTool',
  description: 'Minify and optimize SVG files. Remove comments, collapse whitespace, clean numbers. Pure browser-side optimization.',
  openGraph: { title: 'SVG Optimizer — WokTool', description: 'Minify and optimize SVG files reducing file size.', type: 'website' },
};
import ToolShell from '@/components/tools/ToolShell';

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="svg-optimizer" label="SVG Optimizer" description="Minify SVG: remove comments, collapse whitespace, clean numbers, remove defaults. Live preview." icon="⚡">
      <Client />
    </ToolShell>
  );
}
