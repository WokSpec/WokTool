import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';
const Client = dynamic(() => import('./_client'), { ssr: false });
export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator — WokTool',
  description: 'Generate lorem ipsum placeholder text in paragraphs, sentences, or words.',
};
export default function Page() {
  return (
    <ToolShell id="lorem-ipsum" label="Lorem Ipsum Generator" description="Generate lorem ipsum placeholder text in paragraphs, sentences, or words." icon="📝">
      <Client />
    </ToolShell>
  );
}
