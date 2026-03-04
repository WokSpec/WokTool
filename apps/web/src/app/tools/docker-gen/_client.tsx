'use client';
import { useState } from 'react';

interface KVRow { id: number; key: string; value: string; }
let _id = 0;
const uid = () => ++_id;
const newRow = (): KVRow => ({ id: uid(), key: '', value: '' });

function buildDockerRun(
  image: string, containerName: string, ports: KVRow[], volumes: KVRow[],
  envVars: KVRow[], network: string, restartPolicy: string,
  detach: boolean, rm: boolean, extraArgs: string
): string {
  const parts: string[] = ['docker run'];
  if (detach) parts.push('-d');
  if (rm) parts.push('--rm');
  if (containerName.trim()) parts.push(`--name ${containerName.trim()}`);
  for (const p of ports) {
    if (p.key.trim() && p.value.trim()) parts.push(`-p ${p.key.trim()}:${p.value.trim()}`);
  }
  for (const v of volumes) {
    if (v.key.trim() && v.value.trim()) parts.push(`-v ${v.key.trim()}:${v.value.trim()}`);
  }
  for (const e of envVars) {
    if (e.key.trim()) {
      if (e.value.trim()) parts.push(`-e ${e.key.trim()}="${e.value.trim()}"`);
      else parts.push(`-e ${e.key.trim()}`);
    }
  }
  if (network.trim()) parts.push(`--network ${network.trim()}`);
  if (restartPolicy && restartPolicy !== 'no') parts.push(`--restart ${restartPolicy}`);
  if (extraArgs.trim()) parts.push(extraArgs.trim());
  parts.push(image.trim() || 'nginx:latest');
  return parts.join(' \\\n  ');
}

export default function DockerGenClient() {
  const [image, setImage] = useState('nginx:latest');
  const [containerName, setContainerName] = useState('');
  const [ports, setPorts] = useState<KVRow[]>([{ id: uid(), key: '8080', value: '80' }]);
  const [volumes, setVolumes] = useState<KVRow[]>([newRow()]);
  const [envVars, setEnvVars] = useState<KVRow[]>([newRow()]);
  const [network, setNetwork] = useState('');
  const [restartPolicy, setRestartPolicy] = useState('no');
  const [detach, setDetach] = useState(true);
  const [rm, setRm] = useState(false);
  const [extraArgs, setExtraArgs] = useState('');
  const [copied, setCopied] = useState(false);

  const cmd = buildDockerRun(image, containerName, ports, volumes, envVars, network, restartPolicy, detach, rm, extraArgs);

  const addRow = (setter: React.Dispatch<React.SetStateAction<KVRow[]>>) =>
    setter(r => [...r, newRow()]);
  const removeRow = (setter: React.Dispatch<React.SetStateAction<KVRow[]>>, id: number) =>
    setter(r => r.filter(x => x.id !== id));
  const updateRow = (setter: React.Dispatch<React.SetStateAction<KVRow[]>>, id: number, field: 'key' | 'value', val: string) =>
    setter(r => r.map(x => x.id === id ? { ...x, [field]: val } : x));

  const copy = () => navigator.clipboard.writeText(cmd).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });

  const inputStyle: React.CSSProperties = {
    padding: '0.4rem 0.65rem', borderRadius: 6, border: '1px solid var(--border)',
    background: 'var(--bg-input)', color: 'var(--text)', fontSize: '0.85rem', width: '100%', outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block',
  };
  const sectionStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.35rem' };

  function KVSection({ label, rows, setter, keyPh, valPh }: {
    label: string; rows: KVRow[];
    setter: React.Dispatch<React.SetStateAction<KVRow[]>>;
    keyPh: string; valPh: string;
  }) {
    return (
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ ...labelStyle, marginBottom: 0 }}>{label}</span>
          <button
            onClick={() => addRow(setter)}
            style={{ padding: '0.15rem 0.5rem', borderRadius: 5, cursor: 'pointer', background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid var(--accent)', fontSize: '0.75rem' }}
          >+ Add</button>
        </div>
        {rows.map(r => (
          <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.35rem', alignItems: 'center' }}>
            <input value={r.key} onChange={e => updateRow(setter, r.id, 'key', e.target.value)} style={inputStyle} placeholder={keyPh} />
            <input value={r.value} onChange={e => updateRow(setter, r.id, 'value', e.target.value)} style={inputStyle} placeholder={valPh} />
            <button
              onClick={() => removeRow(setter, r.id)}
              style={{ padding: '0.35rem 0.45rem', borderRadius: 5, cursor: 'pointer', background: 'var(--danger-bg,rgba(248,113,113,0.1))', color: 'var(--danger,#f87171)', border: '1px solid var(--danger-border,rgba(248,113,113,0.25))', fontSize: '0.8rem' }}
            >✕</button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={sectionStyle}>
            <label style={labelStyle}>Image</label>
            <input value={image} onChange={e => setImage(e.target.value)} style={inputStyle} placeholder="nginx:latest" />
          </div>
          <div style={sectionStyle}>
            <label style={labelStyle}>Container Name</label>
            <input value={containerName} onChange={e => setContainerName(e.target.value)} style={inputStyle} placeholder="my-container" />
          </div>
        </div>
        <KVSection label="Port Mappings  host : container" rows={ports} setter={setPorts} keyPh="8080" valPh="80" />
        <KVSection label="Volume Mounts  host : container" rows={volumes} setter={setVolumes} keyPh="/host/path" valPh="/container/path" />
        <KVSection label="Environment Variables" rows={envVars} setter={setEnvVars} keyPh="MY_VAR" valPh="value" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={sectionStyle}>
            <label style={labelStyle}>Network</label>
            <input value={network} onChange={e => setNetwork(e.target.value)} style={inputStyle} placeholder="bridge" />
          </div>
          <div style={sectionStyle}>
            <label style={labelStyle}>Restart Policy</label>
            <select value={restartPolicy} onChange={e => setRestartPolicy(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              {['no', 'always', 'on-failure', 'unless-stopped'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {([['detach', 'Detach (-d)', detach, setDetach], ['rm', 'Remove on exit (--rm)', rm, setRm]] as [string, string, boolean, React.Dispatch<React.SetStateAction<boolean>>][]).map(([key, lbl, val, setter]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
              {lbl}
            </label>
          ))}
        </div>
        <div style={sectionStyle}>
          <label style={labelStyle}>Extra Arguments</label>
          <input value={extraArgs} onChange={e => setExtraArgs(e.target.value)} style={inputStyle} placeholder="--memory=512m --cpus=0.5" />
        </div>
      </div>

      {/* Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'sticky', top: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Generated Command</span>
          <button onClick={copy} className="btn-secondary" style={{ padding: '0.3rem 0.75rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', border: '1px solid var(--border)' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <pre style={{ margin: 0, padding: '1rem', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--accent-2,#a5b4fc)', fontFamily: 'monospace', fontSize: '0.82rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', minHeight: 220 }}>
          {cmd}
        </pre>
      </div>
    </div>
  );
}
