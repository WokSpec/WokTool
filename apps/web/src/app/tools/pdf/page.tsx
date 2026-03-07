import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';
import Client from '@/components/tools/PdfTool';

export const metadata: Metadata = {
  title: 'PDF Suite — WokTool',
  description: 'Combine, split, compress, and convert PDF files directly in your browser.',
};

export default function Page() {
  return (
    <ToolShell
      id="pdf"
      label="PDF Suite"
      description="Professional PDF management toolkit. Merge, split, compress, and optimize PDF documents. 100% private, client-side processing."
      icon="FileText"
    >
      <Client />
    </ToolShell>
  );
}
