import type { Metadata } from 'next';
import { Suspense } from 'react';
import ToolsHubClient from './tools/page-client';

export const metadata: Metadata = {
  title: 'WokTool — Free Browser-Based Dev & Design Tools',
  description: '80+ free, open-source browser-based tools for developers and designers. No login required.',
};

export default function HomePage() {
  return (
    <Suspense>
      <ToolsHubClient />
    </Suspense>
  );
}
