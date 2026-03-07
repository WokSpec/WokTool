'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Switch from '@/components/ui/Switch';

interface KVRow { id: string; key: string; value: string; }

function buildDockerRun(opts: any): string {
  const { image, containerName, ports, volumes, envVars, network, restartPolicy, detach, rm, extraArgs } = opts;
  const parts: string[] = ['docker run'];
  
  if (detach) parts.push('-d');
  if (rm) parts.push('--rm');
  if (containerName.trim()) parts.push(`--name ${containerName.trim()}`);
  
  ports.forEach((p: KVRow) => {
    if (p.key.trim() && p.value.trim()) parts.push(`-p ${p.key.trim()}:${p.value.trim()}`);
  });
  
  volumes.forEach((v: KVRow) => {
    if (v.key.trim() && v.value.trim()) parts.push(`-v ${v.key.trim()}:${v.value.trim()}`);
  });
  
  envVars.forEach((e: KVRow) => {
    if (e.key.trim()) {
      const val = e.value.trim();
      parts.push(`-e ${e.key.trim()}${val ? `="${val}"` : ''}`);
    }
  });

  if (network.trim()) parts.push(`--network ${network.trim()}`);
  if (restartPolicy && restartPolicy !== 'no') parts.push(`--restart ${restartPolicy}`);
  if (extraArgs.trim()) parts.push(extraArgs.trim());
  
  parts.push(image.trim() || 'nginx:latest');
  
  return parts.join(' \\\n  ');
}

export default function DockerGenClient() {
  const [image, setImage] = useState('nginx:latest');
  const [containerName, setContainerName] = useState('my-web-server');
  const [ports, setPorts] = useState<KVRow[]>([{ id: '1', key: '8080', value: '80' }]);
  const [volumes, setVolumes] = useState<KVRow[]>([]);
  const [envVars, setEnvVars] = useState<KVRow[]>([]);
  const [network, setNetwork] = useState('');
  const [restartPolicy, setRestartPolicy] = useState('no');
  const [detach, setDetach] = useState(true);
  const [rm, setRm] = useState(false);
  const [extraArgs, setExtraArgs] = useState('');

  const cmd = useMemo(() => buildDockerRun({
    image, containerName, ports, volumes, envVars, network, restartPolicy, detach, rm, extraArgs
  }), [image, containerName, ports, volumes, envVars, network, restartPolicy, detach, rm, extraArgs]);

  const addRow = (setter: any) => setter((prev: any) => [...prev, { id: crypto.randomUUID(), key: '', value: '' }]);
  const removeRow = (setter: any, id: string) => setter((prev: any) => prev.filter((x: any) => x.id !== id));
  const updateRow = (setter: any, id: string, k: string, v: string) => setter((prev: any) => prev.map((x: any) => x.id === id ? { ...x, key: k, value: v } : x));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Configuration */}
        <div className="space-y-6">
            <Card title="Container Core">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Base Image" value={image} onChange={e => setImage(e.target.value)} placeholder="e.g. node:20-alpine" />
                    <Input label="Container Name" value={containerName} onChange={e => setContainerName(e.target.value)} placeholder="e.g. my-app" />
                </div>
            </Card>

            <Card title="Networking & Storage">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Port Mappings (Host:Container)</label>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => addRow(setPorts)}>+ Add</Button>
                        </div>
                        {ports.map(p => (
                            <div key={p.id} className="flex gap-2">
                                <Input placeholder="8080" value={p.key} onChange={e => updateRow(setPorts, p.id, e.target.value, p.value)} className="flex-1" />
                                <Input placeholder="80" value={p.value} onChange={e => updateRow(setPorts, p.id, p.key, e.target.value)} className="flex-1" />
                                <button onClick={() => removeRow(setPorts, p.id)} className="p-2 text-white/20 hover:text-danger">✕</button>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Volumes (Host:Path)</label>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => addRow(setVolumes)}>+ Add</Button>
                        </div>
                        {volumes.map(v => (
                            <div key={v.id} className="flex gap-2">
                                <Input placeholder="./data" value={v.key} onChange={e => updateRow(setVolumes, v.id, e.target.value, v.value)} className="flex-1" />
                                <Input placeholder="/app/data" value={v.value} onChange={e => updateRow(setVolumes, v.id, v.key, e.target.value)} className="flex-1" />
                                <button onClick={() => removeRow(setVolumes, v.id)} className="p-2 text-white/20 hover:text-danger">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <Card title="Environment & Runtime">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Environment Variables</label>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => addRow(setEnvVars)}>+ Add</Button>
                        </div>
                        {envVars.map(ev => (
                            <div key={ev.id} className="flex gap-2">
                                <Input placeholder="NODE_ENV" value={ev.key} onChange={e => updateRow(setEnvVars, ev.id, e.target.value, ev.value)} className="flex-1" />
                                <Input placeholder="production" value={ev.value} onChange={e => updateRow(setEnvVars, ev.id, ev.key, e.target.value)} className="flex-1" />
                                <button onClick={() => removeRow(setEnvVars, ev.id)} className="p-2 text-white/20 hover:text-danger">✕</button>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <Select 
                            label="Restart Policy" 
                            value={restartPolicy} 
                            onChange={e => setRestartPolicy(e.target.value)}
                            options={[
                                { value: 'no', label: 'No' },
                                { value: 'always', label: 'Always' },
                                { value: 'unless-stopped', label: 'Unless Stopped' },
                                { value: 'on-failure', label: 'On Failure' },
                            ]}
                        />
                        <Input label="Network" value={network} onChange={e => setNetwork(e.target.value)} placeholder="e.g. bridge" />
                    </div>
                </div>
            </Card>

            <Card title="Advanced">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Switch label="Detach Mode (-d)" checked={detach} onChange={setDetach} />
                        <Switch label="Auto-remove (--rm)" checked={rm} onChange={setRm} />
                    </div>
                    <Input label="Extra Arguments" value={extraArgs} onChange={e => setExtraArgs(e.target.value)} placeholder="e.g. --privileged" />
                </div>
            </Card>
        </div>

        {/* Right: Output */}
        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Generated Command</h3>
            <div className="sticky top-8 space-y-6">
                <CodeBlock code={cmd} language="bash" maxHeight="400px" />
                <Button variant="primary" size="lg" className="w-full" onClick={() => navigator.clipboard.writeText(cmd)}>
                    Copy Command
                </Button>

                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                        🐳
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white/90 mb-1">Docker Pro Tip</h4>
                        <p className="text-xs text-white/40 leading-relaxed">
                            Use the <code>--rm</code> flag for temporary containers to keep your system clean. For production services, <code>unless-stopped</code> is usually the best restart policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
