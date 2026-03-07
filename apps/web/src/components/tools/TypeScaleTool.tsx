'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

const RATIOS = [
  { label: 'Minor Second (1.067)', value: 1.067 },
  { label: 'Major Second (1.125)', value: 1.125 },
  { label: 'Minor Third (1.200)', value: 1.2 },
  { label: 'Major Third (1.250)', value: 1.25 },
  { label: 'Perfect Fourth (1.333)', value: 1.333 },
  { label: 'Augmented Fourth (1.414)', value: 1.414 },
  { label: 'Perfect Fifth (1.500)', value: 1.5 },
  { label: 'Golden Ratio (1.618)', value: 1.618 },
];

const STEPS = [
  { name: 'xs', exp: -2 },
  { name: 'sm', exp: -1 },
  { name: 'base', exp: 0 },
  { name: 'md', exp: 1 },
  { name: 'lg', exp: 2 },
  { name: 'xl', exp: 3 },
  { name: '2xl', exp: 4 },
  { name: '3xl', exp: 5 },
  { name: '4xl', exp: 6 },
];

export default function TypeScaleTool() {
  const [baseSize, setBaseSize] = useState(16);
  const [ratio, setRatio] = useState(1.333);
  const [previewText, setPreviewText] = useState('Visual Type Scale');

  const scale = useMemo(() => {
    return STEPS.map(s => {
      const px = baseSize * Math.pow(ratio, s.exp);
      const rem = px / 16;
      return { ...s, px: px.toFixed(2), rem: rem.toFixed(3) };
    });
  }, [baseSize, ratio]);

  const cssOutput = `:root {\n${scale.map(s => `  --text-${s.name}: ${s.rem}rem; /* ${s.px}px */`).join('\n')}\n}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <Card title="Scale Settings">
            <div className="space-y-6">
              <Input 
                label="Base Size (px)" 
                type="number" 
                value={baseSize} 
                onChange={e => setBaseSize(Number(e.target.value))}
                min={8} max={64}
              />
              
              <Select 
                label="Scale Ratio"
                value={ratio}
                onChange={e => setRatio(Number(e.target.value))}
                options={RATIOS.map(r => ({ value: r.value, label: r.label }))}
              />

              <Input 
                label="Preview Text" 
                value={previewText} 
                onChange={e => setPreviewText(e.target.value)}
                placeholder="Enter sample text..."
              />
            </div>
          </Card>

          <Card title="Export CSS">
            <div className="space-y-4">
              <CodeBlock code={cssOutput} language="css" maxHeight="200px" />
              <Button variant="primary" className="w-full" onClick={() => navigator.clipboard.writeText(cssOutput)}>
                Copy Variables
              </Button>
            </div>
          </Card>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Visual Preview</h3>
          <div className="space-y-1">
            {[...scale].reverse().map((step) => (
              <div key={step.name} className="group relative flex flex-col md:flex-row md:items-center gap-2 md:gap-8 p-6 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all">
                <div className="w-24 shrink-0">
                  <div className="text-[10px] font-black text-accent uppercase tracking-tighter mb-1">{step.name}</div>
                  <div className="text-xs font-mono text-white/30">{step.px}px</div>
                  <div className="text-[10px] font-mono text-white/20">{step.rem}rem</div>
                </div>
                <div 
                  className="flex-1 text-white truncate leading-tight"
                  style={{ fontSize: `${step.rem}rem` }}
                >
                  {previewText}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
