'use client';
import { useState } from 'react';

interface Header { id: number; key: string; value: string; }

let _id = 0;
function uid() { return ++_id; }

const METHODS_WITH_BODY = new Set(['POST','PUT','PATCH']);

function buildCurl(url: string, method: string, headers: Header[], body: string, auth: string, bearerToken: string, basicUser: string, basicPass: string, followRedirects: boolean, verbose: boolean): string {
  const parts: string[] = ['curl'];
  if (verbose) parts.push('-v');
  if (followRedirects) parts.push('-L');
  if (method !== 'GET') parts.push(`-X ${method}`);

  // Auth
  if (auth === 'bearer' && bearerToken) {
    parts.push(`-H "Authorization: Bearer ${bearerToken}"`);
  } else if (auth === 'basic' && (basicUser || basicPass)) {
    parts.push(`-u "${basicUser}:${basicPass}"`);
  }

  // Headers
  for (const h of headers) {
    if (h.key.trim()) parts.push(`-H "${h.key.trim()}: ${h.value.trim()}"`);
  }

  // Body
  if (METHODS_WITH_BODY.has(method) && body.trim()) {
    const escaped = body.replace(/"/g, '\\"');
    parts.push(`-d "${escaped}"`);
  }

  parts.push(`"${url || 'https://example.com/api'}"`);
  return parts.join(' \\\n  ');
}

export default function CurlBuilderClient() {
  const [url, setUrl] = useState('https://api.example.com/endpoint');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState<Header[]>([{id:uid(),key:'Content-Type',value:'application/json'}]);
  const [body, setBody] = useState('{\n  "key": "value"\n}');
  const [auth, setAuth] = useState<'none'|'bearer'|'basic'>('none');
  const [bearerToken, setBearerToken] = useState('');
  const [basicUser, setBasicUser] = useState('');
  const [basicPass, setBasicPass] = useState('');
  const [followRedirects, setFollowRedirects] = useState(false);
  const [verbose, setVerbose] = useState(false);
  const [copied, setCopied] = useState(false);

  const curlCmd = buildCurl(url, method, headers, body, auth, bearerToken, basicUser, basicPass, followRedirects, verbose);

  function addHeader() { setHeaders(h => [...h, {id:uid(),key:'',value:''}]); }
  function removeHeader(id: number) { setHeaders(h => h.filter(x => x.id !== id)); }
  function updateHeader(id: number, field: 'key'|'value', val: string) {
    setHeaders(h => h.map(x => x.id === id ? {...x,[field]:val} : x));
  }
  function copy() { navigator.clipboard.writeText(curlCmd).then(() => { setCopied(true); setTimeout(()=>setCopied(false),1500); }); }

  const inputStyle: React.CSSProperties = {
    padding:'0.45rem 0.75rem', borderRadius:6, border:'1px solid var(--border)',
    background:'var(--bg-input)', color:'var(--text)', fontSize:'0.875rem', width:'100%', outline:'none',
  };
  const labelStyle: React.CSSProperties = { color:'var(--text-secondary)', fontSize:'0.82rem', fontWeight:500, marginBottom:'0.3rem', display:'block' };
  const sectionStyle: React.CSSProperties = { display:'flex', flexDirection:'column', gap:'0.4rem' };

  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', alignItems:'start'}}>
      {/* Form */}
      <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {/* URL + Method */}
        <div style={sectionStyle}>
          <label style={labelStyle}>URL</label>
          <input value={url} onChange={e=>setUrl(e.target.value)} style={inputStyle} placeholder="https://api.example.com/endpoint" />
        </div>
        <div style={sectionStyle}>
          <label style={labelStyle}>Method</label>
          <select value={method} onChange={e=>setMethod(e.target.value)} style={{...inputStyle,cursor:'pointer'}}>
            {['GET','POST','PUT','PATCH','DELETE','HEAD'].map(m=><option key={m}>{m}</option>)}
          </select>
        </div>

        {/* Auth */}
        <div style={sectionStyle}>
          <label style={labelStyle}>Authentication</label>
          <select value={auth} onChange={e=>setAuth(e.target.value as 'none'|'bearer'|'basic')} style={{...inputStyle,cursor:'pointer'}}>
            <option value="none">None</option>
            <option value="bearer">Bearer Token</option>
            <option value="basic">Basic Auth</option>
          </select>
          {auth==='bearer' && <input value={bearerToken} onChange={e=>setBearerToken(e.target.value)} style={inputStyle} placeholder="your-token-here" />}
          {auth==='basic' && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
              <input value={basicUser} onChange={e=>setBasicUser(e.target.value)} style={inputStyle} placeholder="username" />
              <input value={basicPass} onChange={e=>setBasicPass(e.target.value)} style={inputStyle} placeholder="password" type="password" />
            </div>
          )}
        </div>

        {/* Headers */}
        <div style={sectionStyle}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <label style={labelStyle}>Headers</label>
            <button onClick={addHeader} className="btn-secondary" style={{padding:'0.2rem 0.6rem',borderRadius:5,cursor:'pointer',fontSize:'0.78rem',border:'1px solid var(--border)'}}>+ Add</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'0.35rem'}}>
            {headers.map(h=>(
              <div key={h.id} style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:'0.4rem',alignItems:'center'}}>
                <input value={h.key} onChange={e=>updateHeader(h.id,'key',e.target.value)} style={inputStyle} placeholder="Header-Name" />
                <input value={h.value} onChange={e=>updateHeader(h.id,'value',e.target.value)} style={inputStyle} placeholder="value" />
                <button onClick={()=>removeHeader(h.id)} style={{padding:'0.4rem 0.5rem',borderRadius:5,cursor:'pointer',background:'var(--danger-bg,rgba(248,113,113,0.1))',color:'var(--danger,#f87171)',border:'1px solid var(--danger-border,rgba(248,113,113,0.25))',fontSize:'0.8rem'}}>✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        {METHODS_WITH_BODY.has(method) && (
          <div style={sectionStyle}>
            <label style={labelStyle}>Request Body</label>
            <textarea value={body} onChange={e=>setBody(e.target.value)} style={{...inputStyle,minHeight:120,fontFamily:'monospace',resize:'vertical'}} spellCheck={false} />
          </div>
        )}

        {/* Options */}
        <div style={{display:'flex',gap:'1.5rem'}}>
          {([['followRedirects','Follow Redirects (-L)',followRedirects,setFollowRedirects],['verbose','Verbose (-v)',verbose,setVerbose]] as [string,string,boolean,React.Dispatch<React.SetStateAction<boolean>>][]).map(([key,lbl,val,setter])=>(
            <label key={key} style={{display:'flex',alignItems:'center',gap:'0.4rem',cursor:'pointer',color:'var(--text-secondary)',fontSize:'0.875rem'}}>
              <input type="checkbox" checked={val} onChange={e=>setter(e.target.checked)} style={{accentColor:'var(--accent)'}} />
              {lbl}
            </label>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',position:'sticky',top:'1rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <label style={{color:'var(--text-secondary)',fontSize:'0.82rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>Generated cURL</label>
          <button onClick={copy} className="btn-secondary" style={{padding:'0.3rem 0.75rem',borderRadius:6,cursor:'pointer',fontSize:'0.8rem',border:'1px solid var(--border)'}}>
            {copied?'✓ Copied':'Copy'}
          </button>
        </div>
        <pre style={{margin:0,padding:'1rem',borderRadius:10,background:'var(--bg-elevated)',border:'1px solid var(--border)',color:'var(--accent-2,#a5b4fc)',fontFamily:'monospace',fontSize:'0.82rem',whiteSpace:'pre-wrap',wordBreak:'break-all',minHeight:200}}>
          {curlCmd}
        </pre>
      </div>
    </div>
  );
}
