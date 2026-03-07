'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

interface FontPair {
  heading: { name: string; weights: number[] };
  body: { name: string; weights: number[] };
  label: string;
  style: string;
}

const FONT_PAIRS: FontPair[] = [
  { label: 'Modern & Clean', style: 'Tech / SaaS', heading: { name: 'Space Grotesk', weights: [700] }, body: { name: 'Inter', weights: [400, 600] } },
  { label: 'Editorial', style: 'Blog / Magazine', heading: { name: 'Playfair Display', weights: [700, 900] }, body: { name: 'Source Serif 4', weights: [400] } },
  { label: 'Friendly & Casual', style: 'Startup', heading: { name: 'Nunito', weights: [800] }, body: { name: 'Nunito', weights: [400, 600] } },
  { label: 'Bold & Impactful', style: 'Brand / Landing', heading: { name: 'Oswald', weights: [700] }, body: { name: 'Lato', weights: [400] } },
  { label: 'Classic Elegance', style: 'Luxury / Fashion', heading: { name: 'Cormorant Garamond', weights: [600] }, body: { name: 'Jost', weights: [300, 500] } },
  { label: 'Minimal Swiss', style: 'Design Portfolio', heading: { name: 'DM Sans', weights: [700] }, body: { name: 'DM Sans', weights: [400] } },
  { label: 'Humanist', style: 'Education / Health', heading: { name: 'Raleway', weights: [700] }, body: { name: 'Merriweather', weights: [400] } },
  { label: 'Code & Tech', style: 'Developer Tools', heading: { name: 'JetBrains Mono', weights: [700] }, body: { name: 'Fira Code', weights: [400] } },
  { label: 'Creative & Quirky', style: 'Agency / Creative', heading: { name: 'Righteous', weights: [400] }, body: { name: 'Poppins', weights: [400, 500] } },
  { label: 'Solid & Trustworthy', style: 'Finance / Legal', heading: { name: 'IBM Plex Serif', weights: [700] }, body: { name: 'IBM Plex Sans', weights: [400] } },
];

function getGoogleFontUrl(pairs: FontPair[]) {
  const families = new Map<string, Set<number>>();
  pairs.forEach(p => {
    if (!families.has(p.heading.name)) families.set(p.heading.name, new Set());
    p.heading.weights.forEach(w => families.get(p.heading.name)!.add(w));
    if (!families.has(p.body.name)) families.set(p.body.name, new Set());
    p.body.weights.forEach(w => families.get(p.body.name)!.add(w));
  });

  const params = [...families.entries()].map(([name, weights]) => {
    const ws = [...weights].sort().join(';');
    return `family=${encodeURIComponent(name)}:wght@${ws}`;
  }).join('&');

  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

export default function FontPairerTool() {
  const [selected, setSelected] = useState<number>(0);
  const [customText, setCustomText] = useState('The quick brown fox jumps over the lazy dog. Create anything. Free forever.');
  const [headingText, setHeadingText] = useState('Create Anything');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const url = getGoogleFontUrl(FONT_PAIRS);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = () => setFontsLoaded(true);
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const pair = FONT_PAIRS[selected];

  const css = useMemo(() => `/* ${pair.label} */
--font-heading: '${pair.heading.name}', sans-serif;
--font-body: '${pair.body.name}', sans-serif;

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: ${pair.heading.weights[pair.heading.weights.length - 1]};
}

body, p, li, td {
  font-family: var(--font-body);
  font-weight: ${pair.body.weights[0]};
}`, [pair]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Selection */}
        <div className="space-y-6">
            <Card title="Curated Pairings">
                <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                    {FONT_PAIRS.map((p, i) => (
                        <button
                            key={i}
                            onClick={() => setSelected(i)}
                            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${selected === i ? 'bg-accent/10 border-accent/30 shadow-inner' : 'bg-surface-raised border-white/5 hover:border-white/10'}`}
                        >
                            <div>
                                <div className={`text-xs font-bold ${selected === i ? 'text-accent' : 'text-white/80'}`}>{p.label}</div>
                                <div className="text-[10px] text-white/40">{p.heading.name} + {p.body.name}</div>
                            </div>
                            <span className="text-[9px] font-black uppercase text-white/20 tracking-widest bg-white/5 px-2 py-1 rounded">{p.style}</span>
                        </button>
                    ))}
                </div>
            </Card>

            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">CSS Variables</h3>
                <CodeBlock code={css} language="css" maxHeight="300px" />
                <Button variant="ghost" className="w-full" size="sm" onClick={() => navigator.clipboard.writeText(css)}>Copy CSS</Button>
            </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-4">
                <Input value={headingText} onChange={e => setHeadingText(e.target.value)} placeholder="Heading..." className="flex-1" />
                <Input value={customText} onChange={e => setCustomText(e.target.value)} placeholder="Body..." className="flex-[2]" />
            </div>

            <div className="relative min-h-[500px] rounded-3xl bg-white text-black p-12 shadow-2xl overflow-hidden flex flex-col justify-center gap-8 transition-all duration-500">
                {!fontsLoaded && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 text-white">
                        Loading fonts...
                    </div>
                )}
                
                <div>
                    <h1 
                        className="text-6xl leading-tight mb-4 transition-all"
                        style={{ fontFamily: `'${pair.heading.name}', sans-serif`, fontWeight: pair.heading.weights[pair.heading.weights.length - 1] }}
                    >
                        {headingText}
                    </h1>
                    <h2 
                        className="text-3xl opacity-60 mb-8 transition-all"
                        style={{ fontFamily: `'${pair.heading.name}', sans-serif`, fontWeight: pair.heading.weights[0] }}
                    >
                        The intelligent choice for {pair.style.toLowerCase()} projects.
                    </h2>
                    <p 
                        className="text-lg leading-relaxed max-w-2xl opacity-80 transition-all"
                        style={{ fontFamily: `'${pair.body.name}', sans-serif`, fontWeight: pair.body.weights[0] }}
                    >
                        {customText} typography plays a crucial role in user experience. Good pairing creates hierarchy and harmony.
                        <br/><br/>
                        {customText} The quick brown fox jumps over the lazy dog.
                    </p>
                </div>

                <div className="pt-8 border-t border-black/10 flex gap-12">
                    <div>
                        <div className="text-xs font-bold opacity-40 uppercase tracking-widest mb-1">Heading Font</div>
                        <a href={`https://fonts.google.com/specimen/${pair.heading.name.replace(/ /g, '+')}`} target="_blank" className="text-lg font-bold hover:underline">{pair.heading.name}</a>
                    </div>
                    <div>
                        <div className="text-xs font-bold opacity-40 uppercase tracking-widest mb-1">Body Font</div>
                        <a href={`https://fonts.google.com/specimen/${pair.body.name.replace(/ /g, '+')}`} target="_blank" className="text-lg font-bold hover:underline">{pair.body.name}</a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
