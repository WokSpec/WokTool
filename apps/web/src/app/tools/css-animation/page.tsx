import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'CSS Animation Builder — WokTool',
  description: 'Build CSS keyframe animations visually. Timeline editor, live preview, presets, and generated CSS output.',
  openGraph: { title: 'CSS Animation Builder — WokTool', description: 'Build CSS keyframe animations with live preview.', type: 'website' },
};
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="css-animation" label="CSS Animation Builder" description="Visual keyframe editor with live preview. Presets: fade, slide, bounce, spin, pulse, shake." icon="🎬">
      <Client />
    </ToolShell>
  );
}
