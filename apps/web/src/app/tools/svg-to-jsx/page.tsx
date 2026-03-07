import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'SVG to JSX Architect — WokTool',
  description: 'Convert raw SVG code into optimized, production-ready React components instantly.',
};

const Client = dynamic(() => import('@/components/tools/SvgToJsxTool'), { ssr: false });

export default function Page() {
  return (
    <ToolShell
      id="svg-to-jsx"
      label="SVG to JSX Architect"
      description="Professional-grade synthesis of React vector components. Automated camelCase mapping, clean attribute stripping, and performance optimization."
      icon="FileCode"
    >
      <Client />
    </ToolShell>
  );
}
