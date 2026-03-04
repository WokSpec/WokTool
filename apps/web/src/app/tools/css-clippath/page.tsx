import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';
const Client = dynamic(() => import('./_client'), { ssr: false });
export const metadata: Metadata = {
  title: 'CSS Clip-Path Maker — WokTool',
  description: 'Visual clip-path editor with draggable points, shape presets, and live CSS output.',
};
export default function Page() {
  return (
    <ToolShell id="css-clippath" label="CSS Clip-Path Maker" description="Visual clip-path editor with draggable points, shape presets, and live CSS output." icon="✂️">
      <Client />
    </ToolShell>
  );
}
