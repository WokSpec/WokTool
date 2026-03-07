'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import Tabs from '@/components/ui/Tabs';
import Dropzone from '@/components/ui/Dropzone';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type Tab = 'merge' | 'extract' | 'info';

interface PdfInfo {
  pageCount: number;
  title: string;
  author: string;
  fileSize: string;
  created: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

function parsePageRange(range: string, total: number): number[] {
  const pages: number[] = [];
  const parts = range.split(',').map(s => s.trim());
  for (const part of parts) {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(s => parseInt(s.trim(), 10));
      if (!isNaN(a) && !isNaN(b)) {
        for (let i = a; i <= Math.min(b, total); i++) {
          if (i >= 1) pages.push(i);
        }
      }
    } else {
      const n = parseInt(part, 10);
      if (!isNaN(n) && n >= 1 && n <= total) pages.push(n);
    }
  }
  return [...new Set(pages)].sort((a, b) => a - b);
}

export default function PdfTool() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('merge');

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Merge state ── */
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  /* ── Extract state ── */
  const [extractFile, setExtractFile] = useState<File | null>(null);
  const [extractRange, setExtractRange] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  /* ── Info state ── */
  const [infoFile, setInfoFile] = useState<File | null>(null);
  const [infoData, setInfoData] = useState<PdfInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const doMerge = async () => {
    if (mergeFiles.length < 2) return;
    setIsMerging(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of mergeFiles) {
        const buf = await file.arrayBuffer();
        const doc = await PDFDocument.load(buf);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'merged.pdf'; a.click();
    } catch (e) {
      alert(`Merge failed: ${String(e)}`);
    } finally {
      setIsMerging(false);
    }
  };

  const doExtract = async () => {
    if (!extractFile || !extractRange.trim()) return;
    setIsExtracting(true);
    try {
      const buf = await extractFile.arrayBuffer();
      const doc = await PDFDocument.load(buf);
      const total = doc.getPageCount();
      const pages = parsePageRange(extractRange, total);
      if (pages.length === 0) throw new Error('No valid pages in range.');
      const out = await PDFDocument.create();
      const copied = await out.copyPages(doc, pages.map(p => p - 1));
      copied.forEach(p => out.addPage(p));
      const bytes = await out.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'extracted.pdf'; a.click();
    } catch (e) {
      alert(`Extraction failed: ${String(e)}`);
    } finally {
      setIsExtracting(false);
    }
  };

  const loadInfo = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const buf = await file.arrayBuffer();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const created = doc.getCreationDate();
      setInfoData({
        pageCount: doc.getPageCount(),
        title: doc.getTitle() || '—',
        author: doc.getAuthor() || '—',
        fileSize: formatBytes(file.size),
        created: created ? created.toLocaleDateString() : '—',
      });
    } catch (e) {
      alert('Could not read PDF metadata.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <Tabs 
            activeTab={activeTab}
            onChange={id => setActiveTab(id as Tab)}
            tabs={[
                { id: 'merge', label: 'Merge PDFs', icon: '➕' },
                { id: 'extract', label: 'Extract Pages', icon: '✂️' },
                { id: 'info', label: 'PDF Info', icon: 'ℹ️' },
            ]}
            className="w-full max-w-xl"
        />
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'merge' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-2">
                <div className="lg:col-span-2 space-y-6">
                    <Dropzone 
                        onFileSelect={f => setMergeFiles(p => [...p, f])} 
                        accept="application/pdf" 
                        label="Add PDF to merge"
                        description="Select multiple files to combine them"
                    />
                    
                    {mergeFiles.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-[10px] font-black uppercase text-white/20 tracking-widest">Selected Files ({mergeFiles.length})</h3>
                                <button onClick={() => setMergeFiles([])} className="text-[10px] font-bold text-danger/60 hover:text-danger uppercase transition-colors">Clear All</button>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {mergeFiles.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-raised border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/20">📄</div>
                                            <div>
                                                <div className="text-xs font-bold text-white/80 truncate max-w-[200px]">{f.name}</div>
                                                <div className="text-[10px] font-mono text-white/20 uppercase">{formatBytes(f.size)}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => setMergeFiles(prev => prev.filter((_, j) => j !== i))} className="p-2 text-white/20 hover:text-danger">✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <Card title="Process">
                        <div className="space-y-4">
                            <p className="text-xs text-white/40 leading-relaxed italic">The output will be a single PDF containing all pages from the selected files in the order they were added.</p>
                            <Button 
                                variant="primary" 
                                className="w-full" 
                                size="lg" 
                                onClick={doMerge} 
                                loading={isMerging}
                                disabled={mergeFiles.length < 2}
                            >
                                Merge & Download
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        )}

        {activeTab === 'extract' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-2">
                {!extractFile ? (
                    <Dropzone onFileSelect={f => setExtractFile(f)} accept="application/pdf" label="Drop PDF to extract pages" />
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-accent/5 border border-accent/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">📄</div>
                                <div>
                                    <div className="text-sm font-bold text-white">{extractFile.name}</div>
                                    <div className="text-[10px] text-white/40 uppercase font-bold">{formatBytes(extractFile.size)}</div>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setExtractFile(null)}>Change File</Button>
                        </div>

                        <Card title="Extract Settings">
                            <div className="space-y-6">
                                <Input 
                                    label="Page Range"
                                    placeholder="e.g. 1-3, 5, 10-12"
                                    value={extractRange}
                                    onChange={e => setExtractRange(e.target.value)}
                                    helper="Use commas for separate pages and dashes for ranges"
                                />
                                <Button 
                                    variant="primary" 
                                    className="w-full" 
                                    size="lg" 
                                    onClick={doExtract} 
                                    loading={isExtracting}
                                    disabled={!extractRange.trim()}
                                >
                                    Generate New PDF
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'info' && (
            <div className="max-w-xl mx-auto space-y-6 animate-in slide-in-from-bottom-2">
                {!infoFile ? (
                    <Dropzone onFileSelect={f => { setInfoFile(f); loadInfo(f); }} accept="application/pdf" label="Drop PDF to view metadata" />
                ) : (
                    <div className="space-y-6">
                        <Card title="Document Metadata">
                            {isAnalyzing ? (
                                <div className="py-12 flex flex-col items-center gap-4 text-white/20">
                                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                    <p className="text-xs font-bold uppercase">Reading Info...</p>
                                </div>
                            ) : infoData && (
                                <div className="grid grid-cols-1 gap-1">
                                    {[
                                        { l: 'Page Count', v: infoData.pageCount },
                                        { l: 'Title', v: infoData.title },
                                        { l: 'Author', v: infoData.author },
                                        { l: 'File Size', v: infoData.fileSize },
                                        { l: 'Created', v: infoData.created },
                                    ].map(item => (
                                        <div key={item.l} className="flex justify-between items-center p-4 rounded-xl border-b border-white/[0.03] hover:bg-white/[0.01]">
                                            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{item.l}</span>
                                            <span className="text-sm font-bold text-white">{item.v}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                        <Button variant="ghost" className="w-full" onClick={() => { setInfoFile(null); setInfoData(null); }}>Inspect Another PDF</Button>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
