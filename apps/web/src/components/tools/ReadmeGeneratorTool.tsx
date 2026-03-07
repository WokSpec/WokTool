'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Switch from '@/components/ui/Switch';

interface ReadmeFields {
  name: string;
  description: string;
  demo: string;
  features: string;
  techStack: string;
  install: string;
  usage: string;
  contributing: boolean;
  license: string;
}

const DEFAULT: ReadmeFields = {
  name: 'Awesome Project',
  description: 'A brief description of what this project does and who it is for.',
  demo: 'https://demo.example.com',
  features: 'Fast and lightweight\nModern UI components\nFull TypeScript support',
  techStack: 'Next.js, Tailwind CSS, TypeScript',
  install: 'npm install',
  usage: 'npm run dev',
  contributing: true,
  license: 'MIT',
};

const LICENSES = [
    { value: 'MIT', label: 'MIT' },
    { value: 'Apache-2.0', label: 'Apache 2.0' },
    { value: 'GPL-3.0', label: 'GPL v3' },
    { value: 'BSD-3-Clause', label: 'BSD 3-Clause' },
    { value: 'ISC', label: 'ISC' },
    { value: 'Unlicense', label: 'Unlicense' },
];

function buildReadme(f: ReadmeFields): string {
  const lines: string[] = [];
  lines.push(`# ${f.name}`);
  lines.push('');
  if (f.description) { lines.push(f.description); lines.push(''); }
  if (f.demo) { lines.push(`**Live Demo:** [${f.demo}](${f.demo})`); lines.push(''); }
  
  if (f.features) {
    lines.push('## ✨ Features');
    lines.push('');
    f.features.split('\n').filter(Boolean).forEach(item => lines.push(`- ${item.replace(/^-\s*/, '')}`));
    lines.push('');
  }
  
  if (f.techStack) {
    lines.push('## 🛠️ Built With');
    lines.push('');
    f.techStack.split(',').map(t => t.trim()).filter(Boolean).forEach(t => lines.push(`- ${t}`));
    lines.push('');
  }

  lines.push('## 🚀 Getting Started');
  lines.push('');
  lines.push('### Installation');
  lines.push('');
  lines.push('```bash');
  if (f.install) lines.push(f.install);
  else lines.push(`git clone https://github.com/user/${f.name.toLowerCase().replace(/\s+/g, '-')}\ncd ${f.name.toLowerCase().replace(/\s+/g, '-')}\nnpm install`);
  lines.push('```');
  lines.push('');

  if (f.usage) {
    lines.push('### Usage');
    lines.push('');
    lines.push('```bash');
    lines.push(f.usage);
    lines.push('```');
    lines.push('');
  }

  if (f.contributing) {
    lines.push('## 🤝 Contributing');
    lines.push('');
    lines.push('Contributions are welcome! Please feel free to submit a Pull Request.');
    lines.push('');
  }

  lines.push('## 📄 License');
  lines.push('');
  lines.push(`Distributed under the ${f.license} License.`);

  return lines.join('\n');
}

export default function ReadmeGeneratorTool() {
  const [fields, setFields] = useState<ReadmeFields>(DEFAULT);

  const update = (k: keyof ReadmeFields, v: any) => setFields(prev => ({ ...prev, [k]: v }));

  const output = useMemo(() => buildReadme(fields), [fields]);

  const download = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'README.md'; a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="space-y-6">
            <Card title="Project Identity">
                <div className="space-y-4">
                    <Input label="Project Name" value={fields.name} onChange={e => update('name', e.target.value)} />
                    <Textarea label="Description" value={fields.description} onChange={e => update('description', e.target.value)} rows={2} />
                    <Input label="Demo URL" value={fields.demo} onChange={e => update('demo', e.target.value)} placeholder="https://..." />
                </div>
            </Card>

            <Card title="Details & Features">
                <div className="space-y-4">
                    <Textarea label="Features (one per line)" value={fields.features} onChange={e => update('features', e.target.value)} rows={4} />
                    <Input label="Tech Stack (comma separated)" value={fields.techStack} onChange={e => update('techStack', e.target.value)} />
                </div>
            </Card>

            <Card title="Setup & Usage">
                <div className="space-y-4">
                    <Textarea label="Installation Commands" value={fields.install} onChange={e => update('install', e.target.value)} placeholder="npm install..." rows={2} />
                    <Textarea label="Usage Example" value={fields.usage} onChange={e => update('usage', e.target.value)} placeholder="npm start..." rows={2} />
                </div>
            </Card>

            <Card title="Metadata">
                <div className="space-y-6">
                    <Select label="License" value={fields.license} onChange={e => update('license', e.target.value)} options={LICENSES} />
                    <Switch label="Include Contributing Section" checked={fields.contributing} onChange={v => update('contributing', v)} />
                </div>
            </Card>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
            <div className="sticky top-8 space-y-6">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Markdown Preview</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(output)} className="h-7 text-[10px]">Copy Raw</Button>
                </div>

                <div className="space-y-4">
                    <CodeBlock code={output} language="markdown" maxHeight="600px" />
                    <Button variant="primary" size="lg" className="w-full" onClick={download} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}>
                        Download README.md
                    </Button>
                </div>

                <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10">
                    <h4 className="text-sm font-bold text-white/90 mb-2">Structure Note</h4>
                    <p className="text-xs text-white/40 leading-relaxed">
                        This generator follows standard GitHub-flavored Markdown conventions. For a more comprehensive README, consider adding sections for screenshots, API documentation, or a Table of Contents manually after downloading.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
