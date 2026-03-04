import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'AES Encrypt / Decrypt — WokTool',
  description: 'AES-128/192/256 encryption and decryption using the Web Crypto API. PBKDF2 key derivation, CBC/GCM modes. All in-browser.',
  openGraph: { title: 'AES Encrypt / Decrypt — WokTool', description: 'AES-256 encryption and decryption using the Web Crypto API.', type: 'website' },
};
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="aes-tool" label="AES Encrypt / Decrypt" description="AES-128/192/256 with CBC or GCM mode. PBKDF2 key derivation. All processing in-browser." icon="🔐">
      <Client />
    </ToolShell>
  );
}
