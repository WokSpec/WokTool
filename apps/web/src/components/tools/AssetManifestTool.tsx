'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Dropzone from '@/components/ui/Dropzone';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

interface AssetItem {
  name: string;
  type: 'image' | 'audio' | 'video' | 'json' | 'text' | 'unknown';
  file: File;
  path: string;
}

const FORMATS = [
  { value: 'json', label: 'JSON (Generic)' },
  { value: 'phaser', label: 'Phaser 3' },
  { value: 'pixi', label: 'PixiJS' },
  { value: 'godot', label: 'Godot (Resource)' },
];

function detectType(file: File): AssetItem['type'] {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type === 'application/json') return 'json';
  if (file.type.startsWith('text/')) return 'text';
  return 'unknown';
}

function generateManifest(items: AssetItem[], format: string, prefix: string): string {
  const p = prefix.endsWith('/') ? prefix : `${prefix}/`;
  
  if (format === 'phaser') {
    const assets = items.map(i => {
      const key = i.name.replace(/\.[^/.]+$/, "");
      const url = `${p}${i.name}`;
      return `  this.load.${i.type}('${key}', '${url}');`;
    });
    return `function preload() {\n${assets.join('\n')}\n}`;
  }

  if (format === 'pixi') {
    const manifest = {
      bundles: [{
        name: 'main',
        assets: items.map(i => ({
          alias: i.name.replace(/\.[^/.]+$/, ""),
          src: `${p}${i.name}`
        }))
      }]
    };
    return JSON.stringify(manifest, null, 2);
  }

  if (format === 'godot') {
    return items.map(i => `[ext_resource path="res://${p}${i.name}" type="${i.type === 'image' ? 'Texture' : 'AudioStream'}" id=1]`).join('\n');
  }

  // Generic JSON
  const manifest = items.reduce((acc, i) => {
    acc[i.name.replace(/\.[^/.]+$/, "")] = `${p}${i.name}`;
    return acc;
  }, {} as Record<string, string>);
  return JSON.stringify(manifest, null, 2);
}

export default function AssetManifestTool() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [items, setItems] = useState<AssetItem[]>([]);
  const [format, setFormat] = useState('json');
  const [prefix, setPrefix] = useState('assets');

  const handleFiles = useCallback((file: File) => {
    setItems(prev => [...prev, {
      name: file.name,
      type: detectType(file),
      file,
      path: file.name
    }]);
  }, []);

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const output = useMemo(() => generateManifest(items, format, prefix), [items, format, prefix]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            <Card title="Asset Library">
                <div className="space-y-6">
                    <Dropzone 
                        onFileSelect={handleFiles} 
                        label="Add Game Assets" 
                        description="Images, audio, JSON, etc." 
                        className="h-32"
                    />
                    
                    {items.length > 0 ? (
                        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40 uppercase">
                                            {item.type.slice(0,3)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs font-bold text-white/80 truncate max-w-[200px]">{item.name}</div>
                                            <div className="text-[10px] text-white/20 uppercase">{(item.file.size / 1024).toFixed(1)} KB</div>
                                        </div>
                                    </div>
                                    <button onClick={() => removeItem(i)} className="text-white/20 hover:text-danger p-2">✕</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-white/20 text-xs italic py-4">No assets added yet</div>
                    )}
                </div>
            </Card>

            <Card title="Configuration">
                <div className="space-y-4">
                    <Select 
                        label="Output Format"
                        value={format}
                        onChange={e => setFormat(e.target.value)}
                        options={FORMATS}
                    />
                    <Input 
                        label="Path Prefix"
                        value={prefix}
                        onChange={e => setPrefix(e.target.value)}
                        placeholder="assets/"
                    />
                </div>
            </Card>
        </div>

        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Generated Manifest</h3>
            <div className="space-y-4 animate-in slide-in-from-right-4">
                <CodeBlock 
                    code={output} 
                    language={format === 'phaser' || format === 'godot' ? 'javascript' : 'json'} 
                    maxHeight="600px" 
                />
                <Button variant="primary" className="w-full" size="lg" onClick={() => navigator.clipboard.writeText(output)} disabled={!items.length}>
                    Copy Manifest Code
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
