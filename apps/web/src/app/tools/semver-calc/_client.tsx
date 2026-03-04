'use client';
import { useState } from 'react';

interface SemVer { major:number; minor:number; patch:number; pre?:string; build?:string; }

function parseSemver(s: string): SemVer | null {
  const m = s.trim().replace(/^v/,'').match(/^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/);
  if (!m) return null;
  return { major:+m[1], minor:+m[2], patch:+m[3], pre:m[4], build:m[5] };
}

function formatSemver(v: SemVer): string {
  let s = `${v.major}.${v.minor}.${v.patch}`;
  if (v.pre) s += `-${v.pre}`;
  if (v.build) s += `+${v.build}`;
  return s;
}

function bumpVersion(v: SemVer, type: string): SemVer {
  if (type==='major') return {major:v.major+1,minor:0,patch:0};
  if (type==='minor') return {major:v.major,minor:v.minor+1,patch:0};
  if (type==='patch') return {major:v.major,minor:v.minor,patch:v.patch+1};
  if (type==='prerelease') {
    if (v.pre) {
      const match = v.pre.match(/^(.*?)(\d+)$/);
      if (match) return {...v, pre:`${match[1]}${+match[2]+1}`};
      return {...v, pre:`${v.pre}.1`};
    }
    return {...v, patch:v.patch+1, pre:'0'};
  }
  return v;
}

function compareSemver(a: SemVer, b: SemVer): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;
  if (!a.pre && !b.pre) return 0;
  if (!a.pre) return 1;
  if (!b.pre) return -1;
  return a.pre.localeCompare(b.pre);
}

function satisfiesRange(ver: SemVer, range: string): boolean {
  // Handle simple ranges: >=1.0.0, <=2.0.0, >1.0.0, <2.0.0, =1.0.0, ^1.0.0, ~1.0.0
  const parts = range.split(/\s+/).filter(Boolean);
  return parts.every(part => {
    const m = part.match(/^(\^|~|>=|<=|>|<|=)?(.+)$/);
    if (!m) return false;
    const [,op,vs] = m;
    const v2 = parseSemver(vs);
    if (!v2) return false;
    const cmp = compareSemver(ver, v2);
    if (op==='>') return cmp>0;
    if (op==='>=') return cmp>=0;
    if (op==='<') return cmp<0;
    if (op==='<=') return cmp<=0;
    if (op==='^') {
      if (v2.major>0) return ver.major===v2.major && cmp>=0;
      if (v2.minor>0) return ver.major===0 && ver.minor===v2.minor && cmp>=0;
      return ver.major===0 && ver.minor===0 && cmp>=0;
    }
    if (op==='~') {
      return ver.major===v2.major && ver.minor===v2.minor && cmp>=0;
    }
    return cmp===0;
  });
}

export default function SemverCalcClient() {
  const [version, setVersion] = useState('1.2.3');
  const [bumpType, setBumpType] = useState<'major'|'minor'|'patch'|'prerelease'>('patch');
  const [compareA, setCompareA] = useState('1.2.3');
  const [compareB, setCompareB] = useState('1.3.0');
  const [validateInput, setValidateInput] = useState('1.2.3-beta.1');
  const [rangeVer, setRangeVer] = useState('1.2.3');
  const [range, setRange] = useState('>=1.0.0 <2.0.0');

  const parsed = parseSemver(version);
  const bumped = parsed ? bumpVersion(parsed, bumpType) : null;
  const parsedA = parseSemver(compareA);
  const parsedB = parseSemver(compareB);
  const cmpResult = parsedA && parsedB ? compareSemver(parsedA, parsedB) : null;
  const validResult = parseSemver(validateInput) !== null;
  const rangeVParsed = parseSemver(rangeVer);
  const rangeResult = rangeVParsed ? satisfiesRange(rangeVParsed, range) : null;

  const inputStyle: React.CSSProperties = {
    padding:'0.45rem 0.75rem', borderRadius:6, border:'1px solid var(--border)',
    background:'var(--bg-input)', color:'var(--text)', fontSize:'0.9rem', outline:'none',
  };
  const cardStyle: React.CSSProperties = {
    padding:'1rem 1.25rem', borderRadius:10, background:'var(--bg-elevated)',
    border:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:'0.75rem',
  };
  const labelStyle: React.CSSProperties = { color:'var(--text-secondary)', fontSize:'0.8rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' };
  const resultStyle: React.CSSProperties = { color:'var(--accent)', fontFamily:'monospace', fontSize:'1.1rem', fontWeight:700 };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1rem',maxWidth:680}}>
      {/* Bump */}
      <div style={cardStyle}>
        <span style={labelStyle}>Version Bumper</span>
        <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap',alignItems:'center'}}>
          <input value={version} onChange={e=>setVersion(e.target.value)} style={{...inputStyle,width:140}} placeholder="1.2.3" />
          <select value={bumpType} onChange={e=>setBumpType(e.target.value as 'major'|'minor'|'patch'|'prerelease')} style={{...inputStyle,cursor:'pointer'}}>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
            <option value="patch">Patch</option>
            <option value="prerelease">Prerelease</option>
          </select>
        </div>
        {parsed ? (
          <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
            <div style={{display:'flex',gap:'1.5rem'}}>
              {['major','minor','patch'].map(part=>(
                <div key={part} style={{textAlign:'center'}}>
                  <div style={{color:'var(--text-muted)',fontSize:'0.75rem',textTransform:'uppercase'}}>{part}</div>
                  <div style={{color:'var(--text)',fontFamily:'monospace',fontSize:'1.3rem',fontWeight:700}}>{parsed[part as keyof SemVer]}</div>
                </div>
              ))}
              {parsed.pre && <div style={{textAlign:'center'}}><div style={{color:'var(--text-muted)',fontSize:'0.75rem',textTransform:'uppercase'}}>pre</div><div style={{color:'var(--warning)',fontFamily:'monospace',fontSize:'1.3rem',fontWeight:700}}>{parsed.pre}</div></div>}
            </div>
            {bumped && <div>Next ({bumpType}): <span style={resultStyle}>{formatSemver(bumped)}</span></div>}
          </div>
        ) : <div style={{color:'var(--danger)',fontSize:'0.875rem'}}>⚠ Invalid semver format</div>}
      </div>

      {/* Compare */}
      <div style={cardStyle}>
        <span style={labelStyle}>Compare Versions</span>
        <div style={{display:'flex',gap:'0.75rem',alignItems:'center',flexWrap:'wrap'}}>
          <input value={compareA} onChange={e=>setCompareA(e.target.value)} style={{...inputStyle,width:120}} placeholder="1.2.3" />
          <span style={{color:'var(--text-muted)'}}>vs</span>
          <input value={compareB} onChange={e=>setCompareB(e.target.value)} style={{...inputStyle,width:120}} placeholder="1.3.0" />
        </div>
        {cmpResult !== null ? (
          <div style={{fontFamily:'monospace',fontSize:'0.95rem'}}>
            <span style={{color:'var(--accent-2)'}}>{compareA}</span>
            <span style={{color:'var(--text-secondary)',margin:'0 0.5rem'}}>{cmpResult>0?'>':cmpResult<0?'<':'='}</span>
            <span style={{color:'var(--accent-2)'}}>{compareB}</span>
            <span style={{color:cmpResult===0?'var(--success)':'var(--warning)',marginLeft:'0.75rem'}}>
              {cmpResult===0?'Equal':cmpResult>0?`${compareA} is newer`:`${compareB} is newer`}
            </span>
          </div>
        ) : <div style={{color:'var(--danger)',fontSize:'0.875rem'}}>⚠ Invalid version(s)</div>}
      </div>

      {/* Validate */}
      <div style={cardStyle}>
        <span style={labelStyle}>Validate Semver</span>
        <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
          <input value={validateInput} onChange={e=>setValidateInput(e.target.value)} style={{...inputStyle,flex:1}} placeholder="1.2.3-beta.1+build.456" />
          <span style={{padding:'0.3rem 0.7rem',borderRadius:6,fontSize:'0.85rem',fontWeight:600,background:validResult?'var(--success-bg,rgba(52,211,153,0.1))':'var(--danger-bg,rgba(248,113,113,0.1))',color:validResult?'var(--success)':'var(--danger)',border:`1px solid ${validResult?'var(--success)':'var(--danger)'}`}}>
            {validResult?'✓ Valid':'✗ Invalid'}
          </span>
        </div>
        {parseSemver(validateInput) && (()=>{const v=parseSemver(validateInput)!;return<div style={{color:'var(--text-muted)',fontSize:'0.82rem',fontFamily:'monospace'}}>major={v.major} minor={v.minor} patch={v.patch}{v.pre?` pre=${v.pre}`:''}{v.build?` build=${v.build}`:''}</div>})()}
      </div>

      {/* Range */}
      <div style={cardStyle}>
        <span style={labelStyle}>Range Checker</span>
        <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap',alignItems:'center'}}>
          <input value={rangeVer} onChange={e=>setRangeVer(e.target.value)} style={{...inputStyle,width:120}} placeholder="1.2.3" />
          <span style={{color:'var(--text-muted)'}}>satisfies</span>
          <input value={range} onChange={e=>setRange(e.target.value)} style={{...inputStyle,flex:1,minWidth:180}} placeholder=">=1.0.0 <2.0.0" />
        </div>
        {rangeResult !== null && (
          <div style={{fontFamily:'monospace',fontSize:'0.95rem'}}>
            <span style={{color:'var(--accent-2)'}}>{rangeVer}</span>
            <span style={{color:'var(--text-secondary)',margin:'0 0.5rem'}}>satisfies</span>
            <span style={{color:'var(--accent-2)'}}>{range}</span>
            <span style={{
              marginLeft:'0.75rem',padding:'0.2rem 0.6rem',borderRadius:5,fontSize:'0.82rem',fontWeight:600,
              background:rangeResult?'var(--success-bg,rgba(52,211,153,0.1))':'var(--danger-bg,rgba(248,113,113,0.1))',
              color:rangeResult?'var(--success)':'var(--danger)',
            }}>{rangeResult?'✓ YES':'✗ NO'}</span>
          </div>
        )}
        <div style={{color:'var(--text-muted)',fontSize:'0.75rem'}}>Supports: &gt;=, &lt;=, &gt;, &lt;, =, ^, ~ and space-separated AND conditions</div>
      </div>
    </div>
  );
}
