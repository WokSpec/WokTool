import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';
const Client = dynamic(() => import('./_client'), { ssr: false });
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
