'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Switch from '@/components/ui/Switch';

function generateSchema(obj: any, opts: { required: boolean }): any {
  if (obj === null) return { type: 'null' };
  const type = Array.isArray(obj) ? 'array' : typeof obj;
  
  const schema: any = { type };
  
  if (type === 'object') {
    schema.properties = {};
    if (opts.required) schema.required = Object.keys(obj);
    for (const [k, v] of Object.entries(obj)) {
      schema.properties[k] = generateSchema(v, opts);
    }
  } else if (type === 'array') {
    if (obj.length > 0) {
      schema.items = generateSchema(obj[0], opts);
    } else {
      schema.items = {};
    }
  }
  
  return schema;
}

export default function JsonSchemaClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [input, setInput] = useState('{\n  "user": {\n    "id": 1,\n    "name": "John Doe",\n    "active": true\n  },\n  "tags": ["admin", "beta"]\n}');
  const [output, setOutput] = useState('');
  const [required, setRequired] = useState(true);
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const schema = {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "Generated Schema",
        ...generateSchema(parsed, { required })
      };
      setOutput(JSON.stringify(schema, null, 2));
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setOutput('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">JSON Sample</h3>
                    <Button variant="ghost" size="sm" onClick={() => setInput('')} className="h-7 text-[10px]">Clear</Button>
                </div>
                <Textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Paste JSON here..."
                    className="min-h-[350px] font-mono text-xs"
                />
            </div>

            <Card title="Schema Options">
                <div className="space-y-4">
                    <Switch label="All Fields Required" checked={required} onChange={setRequired} />
                    <Button onClick={generate} className="w-full" size="lg" disabled={!input.trim()}>
                        Generate JSON Schema
                    </Button>
                </div>
            </Card>

            {error && (
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-mono">
                    {error}
                </div>
            )}
        </div>

        <div className="space-y-6 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Draft-07 Schema</h3>
            {output ? (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                    <CodeBlock code={output} language="json" maxHeight="500px" />
                    <Button variant="primary" className="w-full" size="lg" onClick={() => navigator.clipboard.writeText(output)}>
                        Copy Schema
                    </Button>
                </div>
            ) : (
                <div className="h-full min-h-[400px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12 opacity-20">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl">📐</div>
                    <p className="text-sm">Generated schema will appear here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
