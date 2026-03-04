import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Word Frequency Counter — WokTool',
  description: 'Analyze word frequency in text. Stop words filter, Flesch reading ease score, reading time estimate. Export as CSV.',
  openGraph: { title: 'Word Frequency Counter — WokTool', description: 'Analyze word frequency and text statistics.', type: 'website' },
};
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="word-frequency" label="Word Frequency Counter" description="Word frequency table, reading ease score, reading time estimate, unique words. Export CSV." icon="📊">
      <Client />
    </ToolShell>
  );
}
