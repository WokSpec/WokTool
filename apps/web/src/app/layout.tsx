import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Nav from '@/components/Nav';
import './globals.css';
import 'tldraw/tldraw.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: {
    default: 'WokTool — Free Browser-Based Dev & Design Tools',
    template: '%s | WokTool',
  },
  description:
    '80+ free, open-source browser-based tools for developers and designers. No login required. Runs entirely client-side — your data never leaves your browser.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tools.wokspec.org'),
  openGraph: {
    siteName: 'WokTool',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
