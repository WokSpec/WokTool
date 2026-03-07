import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'CSS Animation Builder — WokTool',
  description: 'Build CSS keyframe animations visually. Timeline editor, live preview, presets, and generated CSS output.',
  openGraph: { title: 'CSS Animation Builder — WokTool', description: 'Build CSS keyframe animations with live preview.', type: 'website' },
};
import ToolShell from '@/components/tools/ToolShell';

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="css-animation" label="CSS Animation Builder" description="Visual keyframe editor with live preview. Presets: fade, slide, bounce, spin, pulse, shake." icon="🎬">
      <Client />
    </ToolShell>
  );
}
