import type { Metadata } from 'next';
import FaviconExtractorTool from '@/components/tools/FaviconExtractorTool';

export const metadata: Metadata = {
  title: 'Favicon Extractor — WokTool',
  description: 'Extract all favicons from any domain or URL — all sizes, apple-touch-icon, and more.',
};

export default function Page() {
  return <FaviconExtractorTool />;
}
