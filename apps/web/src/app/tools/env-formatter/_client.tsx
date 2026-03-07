'use client';
import { useState, useEffect } from 'react';

function parseEnv(content: string): Array<{key:string,value:string,comment:boolean,raw:string}> {
  return content.split('\n').map(raw => {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('#')) return {key:'',value:'',comment:true,raw};
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) return {key:trimmed,value:'',comment:false,raw};
    return {key:trimmed.slice(0,eqIdx).trim(), value:trimmed.slice(eqIdx+1), comment:false, raw};
  });
}

type Action = 'format'|'validate'|'keys'|'json'|'export';

export default function EnvFormatterClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [input, setInput] = useState(`# App configuration
DATABASE_URL=postgres://localhost/mydb
API_KEY=abc123
SECRET_KEY=
DEBUG=true
API_URL=https://api.example.com
API_KEY=duplicate_key
PORT=3000
`);
  const [output, setOutput] = useState('');
  const [action, setAction] = useState<Action>('format');
  const [copied, setCopied] = useState(false);

  function run() {
    const lines = parseEnv(input);
    const entries = lines.filter(l => !l.comment && l.key);

    if (action === 'format') {
      const seen = new Set<string>();
      const sorted = [...entries].filter(e => {
        if (seen.has(e.key)) return false;
        seen.add(e.key);
        return true;
      }).sort((a,b)=>a.key.localeCompare(b.key));
      setOutput(sorted.map(e=>`${e.key}=${e.value}`).join('\n'));
    } else if (action === 'validate') {
      const issues: string[] = [];
      const seen = new Map<string,number>();
      entries.forEach((e,i) => {
        if (!e.value.trim()) issues.push(`Line ${i+1}: ${e.key} has an empty value`);
        if (seen.has(e.key)) issues.push(`Line ${i+1}: ${e.key} is duplicated (first at line ${seen.get(e.key)!+1})`);
        else seen.set(e.key, i);
      });
      setOutput(issues.length ? issues.join('\n') : '✓ No issues found — all keys have values and are unique');
    } else if (action === 'keys') {
      const keys = [...new Set(entries.map(e=>e.key))];
      setOutput(keys.join('\n'));
    } else if (action === 'json') {
      const obj: Record<string,string> = {};
      entries.forEach(e=>{obj[e.key]=e.value;});
      setOutput(JSON.stringify(obj,null,2));
    } else if (action === 'export') {
      const seen = new Set<string>();
      setOutput(entries.filter(e=>{if(seen.has(e.key))return false;seen.add(e.key);return true;}).map(e=>`export ${e.key}="${e.value}"`).join('\n'));
    }
  }

  const copy = () => navigator.clipboard.writeText(output).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),1500);});

  const btnStyle = (active:boolean): React.CSSProperties => ({
    padding:'0.45rem 0.9rem', borderRadius:6, cursor:'pointer', fontSize:'0.85rem', fontWeight:active?600:400,
    border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
    background: active ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
    color: active ? 'var(--accent)' : 'var(--text-secondary)',
  });
  const taStyle: React.CSSProperties = {
    width:'100%', minHeight:300, padding:'0.75rem', borderRadius:8,
    border:'1px solid var(--border)', background:'var(--bg-input)', color:'var(--text)',
    fontFamily:'monospace', fontSize:'0.85rem', resize:'vertical', outline:'none',
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
      {/* Actions */}
      <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',alignItems:'center'}}>
        {(['format','validate','keys','json','export'] as Action[]).map(a=>(
          <button key={a} onClick={()=>setAction(a)} style={btnStyle(action===a)}>
            {a==='format'?'Format':a==='validate'?'Validate':a==='keys'?'Extract Keys':a==='json'?'To JSON':'To Export'}
          </button>
        ))}
        <button onClick={run} className="btn-primary" style={{padding:'0.45rem 1.25rem',borderRadius:6,cursor:'pointer',border:'none',fontSize:'0.875rem',fontWeight:600,marginLeft:'auto'}}>Run →</button>
      </div>

      {/* Panels */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
          <label style={{color:'var(--text-secondary)',fontSize:'0.8rem',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.05em'}}>.env Input</label>
          <textarea value={input} onChange={e=>setInput(e.target.value)} style={taStyle} spellCheck={false} />
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <label style={{color:'var(--text-secondary)',fontSize:'0.8rem',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.05em'}}>Output</label>
            {output && <button onClick={copy} className="btn-secondary" style={{padding:'0.25rem 0.7rem',borderRadius:6,cursor:'pointer',fontSize:'0.78rem',border:'1px solid var(--border)'}}>{copied?'✓ Copied':'Copy'}</button>}
          </div>
          <textarea value={output} readOnly style={{...taStyle,background:'var(--bg-elevated)'}} placeholder="Click Run to see output…" spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
