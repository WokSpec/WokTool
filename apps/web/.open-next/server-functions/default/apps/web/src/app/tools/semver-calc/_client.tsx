'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

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
    if (op==='~') return ver.major===v2.major && ver.minor===v2.minor && cmp>=0;
    return cmp===0;
  });
}

export default function SemverCalcClient() {
  const [version, setVersion] = useState('1.2.3');
  const [bumpType, setBumpType] = useState<'major'|'minor'|'patch'|'prerelease'>('patch');
  const [compareA, setCompareA] = useState('1.2.3');
  const [compareB, setCompareB] = useState('1.3.0');
  const [rangeVer, setRangeVer] = useState('1.2.3');
  const [range, setRange] = useState('>=1.0.0 <2.0.0');

  const parsed = parseSemver(version);
  const bumped = parsed ? bumpVersion(parsed, bumpType) : null;
  const parsedA = parseSemver(compareA);
  const parsedB = parseSemver(compareB);
  const cmpResult = parsedA && parsedB ? compareSemver(parsedA, parsedB) : null;
  const rangeVParsed = parseSemver(rangeVer);
  const rangeResult = rangeVParsed ? satisfiesRange(rangeVParsed, range) : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Version Bumper */}
        <div className="space-y-6">
            <Card title="Version Bumper">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Current Version" value={version} onChange={e => setVersion(e.target.value)} placeholder="1.2.3" className="font-mono" />
                        <Select 
                            label="Bump Type"
                            value={bumpType}
                            onChange={e => setBumpType(e.target.value as any)}
                            options={[
                                { value: 'major', label: 'Major' },
                                { value: 'minor', label: 'Minor' },
                                { value: 'patch', label: 'Patch' },
                                { value: 'prerelease', label: 'Prerelease' },
                            ]}
                        />
                    </div>

                    {parsed ? (
                        <div className="p-6 rounded-2xl bg-accent/5 border border-accent/10 space-y-4">
                            <div className="flex gap-8 justify-center">
                                {['major','minor','patch'].map(p => (
                                    <div key={p} className="text-center">
                                        <div className="text-[10px] font-black uppercase text-white/20 mb-1">{p}</div>
                                        <div className="text-2xl font-black text-white font-mono">{parsed[p as keyof SemVer]}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-xs font-bold text-white/40 uppercase">Next Version</span>
                                <code className="text-sm font-bold text-accent">{bumped ? formatSemver(bumped) : '—'}</code>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">Invalid semver format</div>
                    )}
                </div>
            </Card>

            <Card title="Range Checker">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Version" value={rangeVer} onChange={e => setRangeVer(e.target.value)} placeholder="1.2.3" />
                        <Input label="Range" value={range} onChange={e => setRange(e.target.value)} placeholder=">=1.0.0 <2.0.0" />
                    </div>
                    {rangeResult !== null && (
                        <div className={`p-4 rounded-xl border flex items-center justify-between ${rangeResult ? 'bg-success/5 border-success/20 text-success' : 'bg-danger/5 border-danger/20 text-danger'}`}>
                            <span className="text-xs font-bold uppercase">Satisfies Range</span>
                            <span className="text-sm font-black font-mono">{rangeResult ? 'YES' : 'NO'}</span>
                        </div>
                    )}
                </div>
            </Card>
        </div>

        {/* Compare & Validate */}
        <div className="space-y-6">
            <Card title="Compare Versions">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <Input label="Version A" value={compareA} onChange={e => setCompareA(e.target.value)} />
                        <Input label="Version B" value={compareB} onChange={e => setCompareB(e.target.value)} />
                    </div>
                    {cmpResult !== null && (
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-2">
                            <div className="flex items-center gap-4 text-xl font-black font-mono">
                                <span className="text-white/40">{compareA}</span>
                                <span className="text-accent">{cmpResult > 0 ? '>' : cmpResult < 0 ? '<' : '='}</span>
                                <span className="text-white/40">{compareB}</span>
                            </div>
                            <p className="text-xs font-bold text-white/20 uppercase tracking-widest mt-2">
                                {cmpResult === 0 ? 'Versions are identical' : cmpResult > 0 ? `${compareA} is newer` : `${compareB} is newer`}
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-xl shrink-0">
                    ℹ️
                </div>
                <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white">What is Semver?</h4>
                    <p className="text-xs text-white/40 leading-relaxed">
                        Semantic Versioning (SemVer) is a universal specification for versioning software. It uses a <code>MAJOR.MINOR.PATCH</code> format to communicate the nature of changes in each release.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
