import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';
import Client from './_client';
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
