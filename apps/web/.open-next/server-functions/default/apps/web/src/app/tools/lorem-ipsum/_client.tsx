'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Slider from '@/components/ui/Slider';
import Switch from '@/components/ui/Switch';
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function generateLorem(count: number, unit: 'words' | 'sentences' | 'paragraphs', startWithLorem: boolean) {
  const getWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];
  const getSentence = () => {
    const len = 8 + Math.floor(Math.random() * 10);
    const s = Array.from({length: len}, getWord).join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  };
  const getParagraph = () => {
    const len = 3 + Math.floor(Math.random() * 4);
    return Array.from({length: len}, getSentence).join(' ');
  };

  let result = '';
  if (unit === 'words') result = Array.from({length: count}, getWord).join(' ');
  else if (unit === 'sentences') result = Array.from({length: count}, getSentence).join(' ');
  else result = Array.from({length: count}, getParagraph).join('\n\n');

  if (startWithLorem) {
    if (unit === 'words') result = 'Lorem ipsum ' + result.split(' ').slice(2).join(' ');
    else result = 'Lorem ipsum dolor sit amet. ' + result.split('. ').slice(1).join('. ');
  }

  return result;
}

export default function LoremIpsumClient() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);

  const output = useMemo(() => generateLorem(count, unit, startWithLorem), [count, unit, startWithLorem]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings */}
        <div className="space-y-6">
            <Card title="Generator Settings">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest px-1">Output Unit</label>
                        <Tabs 
                            activeTab={unit}
                            onChange={id => setUnit(id as any)}
                            tabs={[
                                { id: 'words', label: 'Words' },
                                { id: 'sentences', label: 'Sentences' },
                                { id: 'paragraphs', label: 'Paragraphs' },
                            ]}
                        />
                    </div>

                    <Slider 
                        label="Quantity"
                        min={1} max={unit === 'words' ? 200 : 20}
                        value={count}
                        onChange={setCount}
                    />

                    <Switch 
                        label="Start with 'Lorem Ipsum'"
                        checked={startWithLorem}
                        onChange={setStartWithLorem}
                    />
                </div>
            </Card>

            <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10">
                <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Speed Tip</h4>
                <p className="text-xs text-white/40 leading-relaxed">
                    Changes are generated in real-time as you adjust the sliders. Click the copy button to grab the text instantly.
                </p>
            </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Generated Text</h3>
                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(output)} className="h-7 text-[10px]">Copy All</Button>
            </div>

            <div className="min-h-[400px]">
                <CodeBlock code={output} language="text" maxHeight="600px" />
            </div>
        </div>
      </div>
    </div>
  );
}
