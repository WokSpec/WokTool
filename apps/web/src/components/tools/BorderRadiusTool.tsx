'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Slider from '@/components/ui/Slider';
import Tabs from '@/components/ui/Tabs';
import Switch from '@/components/ui/Switch';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

type Unit = 'px' | '%';

export default function BorderRadiusTool() {
  const [tl, setTl] = useState(24);
  const [tr, setTr] = useState(24);
  const [br, setBr] = useState(24);
  const [bl, setBl] = useState(24);
  const [unit, setUnit] = useState<Unit>('px');
  const [isLinked, setIsLinked] = useState(true);

  const max = unit === 'px' ? 200 : 50;

  const handleUpdate = (setter: (v: number) => void, val: number) => {
    if (isLinked) {
      setTl(val);
      setTr(val);
      setBr(val);
      setBl(val);
    } else {
      setter(val);
    }
  };

  const cssValue = `${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit}`;
  const fullCss = `border-radius: ${cssValue};`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card title="Configuration">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Unit</span>
                <Tabs 
                  activeTab={unit}
                  onChange={id => setUnit(id as Unit)}
                  tabs={[{ id: 'px', label: 'PX' }, { id: '%,', label: '%' }]}
                  className="scale-90 origin-right"
                />
              </div>
              
              <Switch 
                label="Link All Corners" 
                description="Adjust all corners simultaneously"
                checked={isLinked}
                onChange={setIsLinked}
              />
            </div>
          </Card>

          <Card title="Corner Radius">
            <div className="space-y-6">
              <Slider label="Top Left" min={0} max={max} value={tl} onChange={v => handleUpdate(setTl, v)} unit={unit} />
              <Slider label="Top Right" min={0} max={max} value={tr} onChange={v => handleUpdate(setTr, v)} unit={unit} disabled={isLinked} />
              <Slider label="Bottom Right" min={0} max={max} value={br} onChange={v => handleUpdate(setBr, v)} unit={unit} disabled={isLinked} />
              <Slider label="Bottom Left" min={0} max={max} value={bl} onChange={v => handleUpdate(setBl, v)} unit={unit} disabled={isLinked} />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="relative w-full aspect-square md:aspect-video rounded-3xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10" 
              style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }} 
            />
            
            <div 
              className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-accent to-teal-500 shadow-2xl transition-all duration-300 border border-white/20"
              style={{ borderRadius: cssValue }}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">CSS Output</h3>
            <CodeBlock code={fullCss} language="css" />
            <Button variant="primary" size="lg" className="w-full" onClick={() => navigator.clipboard.writeText(fullCss)}>
              Copy CSS Code
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
