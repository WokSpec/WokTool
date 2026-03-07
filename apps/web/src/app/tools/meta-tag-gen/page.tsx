import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'Meta Tag Generator — WokTool',
  description: 'Generate complete HTML meta tags for SEO, Open Graph, and Twitter Cards.',
};

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="meta-tag-gen" label="Meta Tag Generator" description="Generate complete <head> meta tags for SEO, Open Graph, and Twitter Cards. With Google preview." icon="🏷️">
      <Client />
    </ToolShell>
  );
}
