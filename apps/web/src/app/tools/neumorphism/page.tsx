import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';
import Client from './_client';
export const metadata: Metadata = {
  title: 'Neumorphism Generator — WokTool',
  description: 'Generate neumorphism box-shadow CSS with live preview. Flat, concave, convex, and pressed styles.',
};
export default function Page() {
  return (
    <ToolShell id="neumorphism" label="Neumorphism Generator" description="Generate neumorphism box-shadow CSS with live preview. Flat, concave, convex, and pressed styles." icon="🔘">
      <Client />
    </ToolShell>
  );
}
