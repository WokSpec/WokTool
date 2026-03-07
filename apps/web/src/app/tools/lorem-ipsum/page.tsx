import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';
import Client from './_client';
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
