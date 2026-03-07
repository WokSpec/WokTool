import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Image to Base64 — WokTool',
  description: 'Convert images to base64 data URIs for use in CSS and HTML. Supports PNG, JPEG, GIF, WebP, SVG. Reverse: decode base64 to preview.',
  openGraph: { title: 'Image to Base64 — WokTool', description: 'Convert images to base64 data URIs for CSS/HTML.', type: 'website' },
};
import ToolShell from '@/components/tools/ToolShell';

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="img-to-base64" label="Image to Base64" description="Convert images to base64 data URIs. Also reverse: paste base64 to preview. Supports PNG, JPEG, GIF, WebP, SVG." icon="🖼️">
      <Client />
    </ToolShell>
  );
}
