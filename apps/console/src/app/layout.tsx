import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WokSpec Console',
  description: 'Client management console for WokSpec agency',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={inter.className}
        style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}
      >
        {children}
      </body>
    </html>
  );
}
