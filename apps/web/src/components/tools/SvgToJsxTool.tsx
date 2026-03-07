'use client';

import { useState, useCallback } from 'react';
import { Code, Copy, Trash2, Settings, Check, Zap, FileCode } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
import Switch from '@/components/ui/Switch';
import CodeBlock from '@/components/ui/CodeBlock';

interface Options {
  typescript: boolean;
  exportDefault: boolean;
  prefix: string;
  memo: boolean;
}

export default function SvgToJsxTool() {
  const [svg, setSvg] = useState('');
  const [jsx, setJsx] = useState('');
  const [options, setOptions] = useState<Options>({
    typescript: true,
    exportDefault: true,
    prefix: 'Icon',
    memo: true,
  });
  const [copied, setCopied] = useState(false);

  const convert = useCallback((input: string, opts: Options) => {
    if (!input.trim()) {
      setJsx('');
      return;
    }

    // 1. Basic Cleanup
    let processed = input
      .replace(/<\?xml.*\?>/g, '')
      .replace(/<!DOCTYPE.*>/g, '')
      .replace(/<!--.*-->/g, '');

    // 2. Attribute Conversion (kebab-case to camelCase)
    const attrs = [
      'accent-height', 'accentHeight', 'alignment-baseline', 'alignmentBaseline',
      'arabic-form', 'arabicForm', 'baseline-shift', 'baselineShift',
      'cap-height', 'capHeight', 'clip-path', 'clipPath',
      'clip-rule', 'clipRule', 'color-interpolation', 'colorInterpolation',
      'color-interpolation-filters', 'colorInterpolationFilters',
      'color-profile', 'colorProfile', 'color-rendering', 'colorRendering',
      'dominant-baseline', 'dominantBaseline', 'enable-background', 'enableBackground',
      'fill-opacity', 'fillOpacity', 'fill-rule', 'fillRule',
      'flood-color', 'floodColor', 'flood-opacity', 'floodOpacity',
      'font-family', 'fontFamily', 'font-size', 'fontSize',
      'font-size-adjust', 'fontSizeAdjust', 'font-stretch', 'fontStretch',
      'font-style', 'fontStyle', 'font-variant', 'fontVariant',
      'font-weight', 'fontWeight', 'glyph-name', 'glyphName',
      'glyph-orientation-horizontal', 'glyphOrientationHorizontal',
      'glyph-orientation-vertical', 'glyphOrientationVertical',
      'horiz-adv-x', 'horizAdvX', 'horiz-origin-x', 'horizOriginX',
      'image-rendering', 'imageRendering', 'letter-spacing', 'letterSpacing',
      'lighting-color', 'lightingColor', 'marker-end', 'markerEnd',
      'marker-mid', 'markerMid', 'marker-start', 'markerStart',
      'overline-position', 'overlinePosition', 'overline-thickness', 'overlineThickness',
      'paint-order', 'paintOrder', 'panose-1', 'panose1',
      'pointer-events', 'pointerEvents', 'rendering-intent', 'renderingIntent',
      'shape-rendering', 'shapeRendering', 'stop-color', 'stopColor',
      'stop-opacity', 'stopOpacity', 'strikethrough-position', 'strikethroughPosition',
      'strikethrough-thickness', 'strikethroughThickness', 'stroke-dasharray', 'strokeDasharray',
      'stroke-dashoffset', 'strokeDashoffset', 'stroke-linecap', 'strokeLinecap',
      'stroke-linejoin', 'strokeLinejoin', 'stroke-miterlimit', 'strokeLinejoin',
      'stroke-opacity', 'strokeOpacity', 'stroke-width', 'strokeWidth',
      'text-anchor', 'textAnchor', 'text-decoration', 'textDecoration',
      'text-rendering', 'textRendering', 'underline-position', 'underlinePosition',
      'underline-thickness', 'underlineThickness', 'unicode-bidi', 'unicodeBidi',
      'unicode-range', 'unicodeRange', 'units-per-em', 'unitsPerEm',
      'v-alphabetic', 'vAlphabetic', 'v-hanging', 'vHanging',
      'v-ideographic', 'vIdeographic', 'v-mathematical', 'vMathematical',
      'vector-effect', 'vectorEffect', 'vert-adv-y', 'vertAdvY',
      'vert-origin-x', 'vertOriginX', 'vert-origin-y', 'vertOriginY',
      'word-spacing', 'wordSpacing', 'writing-mode', 'writingMode',
      'x-height', 'xHeight', 'xlink:actuate', 'xlinkActuate',
      'xlink:arcrole', 'xlinkArcrole', 'xlink:href', 'xlinkHref',
      'xlink:role', 'xlinkRole', 'xlink:show', 'xlinkShow',
      'xlink:type', 'xlinkType', 'xml:base', 'xmlBase',
      'xml:lang', 'xmlLang', 'xml:space', 'xmlSpace',
    ];

    for (let i = 0; i < attrs.length; i += 2) {
      const regex = new RegExp(` ${attrs[i]}=`, 'g');
      processed = processed.replace(regex, ` ${attrs[i + 1]}=`);
    }

    // 3. Special cases
    processed = processed.replace(/ class=/g, ' className=');
    processed = processed.replace(/ style="([^"]*)"/g, (_, p1) => {
        const style = p1.split(';').reduce((acc: any, curr: string) => {
            const [key, val] = curr.split(':');
            if (key && val) {
                const camelKey = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                acc[camelKey] = val.trim();
            }
            return acc;
        }, {});
        return ` style={${JSON.stringify(style)}}`;
    });

    // 4. Wrap in Component
    const componentName = opts.prefix.charAt(0).toUpperCase() + opts.prefix.slice(1);
    const propsType = opts.typescript ? ': React.SVGProps<SVGSVGElement>' : '';
    
    let result = '';
    if (opts.memo) result += `import { memo } from 'react';\n\n`;
    
    let body = `const ${componentName} = (props${propsType}) => (\n  ${processed.trim().split('\n').join('\n  ')}\n);`;
    
    if (opts.memo) {
        body = `const ${componentName} = memo((props${propsType}) => (\n  ${processed.trim().split('\n').join('\n  ')}\n));`;
    }

    result += body;
    if (opts.exportDefault) result += `\n\nexport default ${componentName};`;

    setJsx(result);
  }, []);

  const handleUpdate = (val: string) => {
    setSvg(val);
    convert(val, options);
  };

  const handleOptionChange = (key: keyof Options, val: any) => {
    const next = { ...options, [key]: val };
    setOptions(next);
    convert(svg, next);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
            <Card title="Source Protocol" description="Paste raw SVG markup to begin the architectural transformation.">
                <Textarea 
                    placeholder='<svg ...> ... </svg>'
                    value={svg}
                    onChange={e => handleUpdate(e.target.value)}
                    className="font-mono text-xs min-h-[300px]"
                />
                <div className="mt-4 flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => handleUpdate('')} icon={<Trash2 size={14} />}>Clear</Button>
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{svg.length} Characters</span>
                </div>
            </Card>

            <Card title="Configuration" description="Customize the output component signature.">
                <div className="space-y-5">
                    <Switch checked={options.typescript} onChange={v => handleOptionChange('typescript', v)} label="TypeScript" description="Include React.SVGProps type" />
                    <Switch checked={options.memo} onChange={v => handleOptionChange('memo', v)} label="React.memo" description="Wrap in memo for performance" />
                    <Switch checked={options.exportDefault} onChange={v => handleOptionChange('exportDefault', v)} label="Export Default" description="Append default export statement" />
                    <div className="pt-4 border-t border-white/[0.06]">
                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block ml-1">Component Name</label>
                        <input 
                            type="text" 
                            value={options.prefix}
                            onChange={e => handleOptionChange('prefix', e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-white/10"
                        />
                    </div>
                </div>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                    <div className="h-5 w-1 bg-accent/40 rounded-full" />
                    React Component Output
                </h2>
                {jsx && (
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => { navigator.clipboard.writeText(jsx); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                        icon={copied ? <Check size={14} /> : <Copy size={14} />}
                    >
                        {copied ? 'Copied' : 'Copy JSX'}
                    </Button>
                )}
            </div>

            {jsx ? (
                <div className="animate-in slide-in-from-right-4 duration-700">
                    <CodeBlock code={jsx} language="tsx" maxHeight="600px" />
                </div>
            ) : (
                <div className="h-[500px] rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                    <FileCode size={64} strokeWidth={1} />
                    <p className="text-sm font-bold uppercase tracking-widest">Awaiting Source Data</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.06] flex gap-4 items-start">
                    <Zap size={20} className="text-accent shrink-0" />
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-white/80">Clean Synthesis</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">Automatically strips XML prologues, DOCTYPEs, and comments for a production-ready component.</p>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.06] flex gap-4 items-start">
                    <Settings size={20} className="text-accent shrink-0" />
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-white/80">CamelCase Mapping</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">Instantly converts kebab-case SVG attributes to their JSX camelCase equivalents.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
