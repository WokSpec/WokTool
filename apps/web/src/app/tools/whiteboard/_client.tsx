'use client';
import dynamic from 'next/dynamic';

const TldrawCanvas = dynamic(
  async () => {
    // @ts-ignore – tldraw/tldraw.css lacks TS declarations but the file exists
    await import('tldraw/tldraw.css');
    const { Tldraw } = await import('tldraw');
    return function TldrawWrapper() {
      return <Tldraw persistenceKey="woktool-whiteboard" />;
    };
  },
  {
    ssr: false,
    loading: () => (
      <div style={{ width: '100%', height: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', fontSize: '0.9rem', background: 'var(--bg-surface, #111)' }}>
        Loading whiteboard…
      </div>
    ),
  }
);

export default function WhiteboardClient() {
  return (
    <div style={{ width: '100%', height: '75vh', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle, rgba(255,255,255,0.04))' }}>
      <TldrawCanvas />
    </div>
  );
}
