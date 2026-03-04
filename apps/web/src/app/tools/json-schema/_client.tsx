'use client';
import { useState } from 'react';

function inferSchema(val: unknown, addRequired: boolean, addAdditional: boolean): Record<string, unknown> {
  if (val === null) return { type: 'null' };
  if (typeof val === 'boolean') return { type: 'boolean' };
  if (typeof val === 'number') return { type: Number.isInteger(val) ? 'integer' : 'number' };
  if (typeof val === 'string') return { type: 'string' };
  if (Array.isArray(val)) {
    if (val.length === 0) return { type: 'array', items: {} };
    const itemSchema = inferSchema(val[0], addRequired, addAdditional);
    return { type: 'array', items: itemSchema };
  }
  if (typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    const properties: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      properties[k] = inferSchema(v, addRequired, addAdditional);
    }
    const schema: Record<string, unknown> = { type: 'object', properties };
    if (addRequired && Object.keys(properties).length > 0) {
      schema.required = Object.keys(properties);
    }
    if (!addAdditional) schema.additionalProperties = false;
    return schema;
  }
  return {};
}

const EXAMPLE = `{
  "id": 123,
  "name": "Alice",
  "email": "alice@example.com",
  "active": true,
  "score": 9.5,
  "tags": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zip": "12345"
  }
}`;

export default function JsonSchemaClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [schema, setSchema] = useState('');
  const [addRequired, setAddRequired] = useState(true);
  const [addAdditional, setAddAdditional] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function generate() {
    setError('');
    try {
      const val = JSON.parse(input);
      const result = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        ...inferSchema(val, addRequired, addAdditional),
      };
      setSchema(JSON.stringify(result, null, 2));
    } catch (e) {
      setError(`JSON parse error: ${e instanceof Error ? e.message : String(e)}`);
      setSchema('');
    }
  }

  function copy() { navigator.clipboard.writeText(schema).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); }

  function download() {
    const blob = new Blob([schema], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'schema.json'; a.click();
    URL.revokeObjectURL(url);
  }

  const taStyle: React.CSSProperties = {
    width: '100%', flex: 1, minHeight: 360, padding: '0.75rem', borderRadius: 8,
    border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text)',
    fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical', outline: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        {([['addRequired', 'Mark all as required', addRequired, setAddRequired], ['addAdditional', 'Allow additionalProperties', addAdditional, setAddAdditional]] as [string, string, boolean, React.Dispatch<React.SetStateAction<boolean>>][]).map(([key, lbl, val, setter]) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
            {lbl}
          </label>
        ))}
        <button onClick={generate} className="btn-primary" style={{ padding: '0.45rem 1.25rem', borderRadius: 6, cursor: 'pointer', border: 'none', fontSize: '0.875rem', fontWeight: 600, marginLeft: 'auto' }}>
          Generate Schema →
        </button>
      </div>

      {/* Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>JSON Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} style={taStyle} spellCheck={false} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Generated Schema</label>
            {schema && (
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={copy} className="btn-secondary" style={{ padding: '0.25rem 0.7rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.78rem', border: '1px solid var(--border)' }}>{copied ? '✓ Copied' : 'Copy'}</button>
                <button onClick={download} className="btn-secondary" style={{ padding: '0.25rem 0.7rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.78rem', border: '1px solid var(--border)' }}>⬇ Download</button>
              </div>
            )}
          </div>
          <textarea value={schema} readOnly style={{ ...taStyle, background: 'var(--bg-elevated)' }} placeholder="Click Generate Schema →" spellCheck={false} />
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 8, background: 'var(--danger-bg,rgba(248,113,113,0.1))', border: '1px solid var(--danger-border,rgba(248,113,113,0.25))', color: 'var(--danger,#f87171)', fontSize: '0.875rem', fontFamily: 'monospace' }}>
          {error}
        </div>
      )}
    </div>
  );
}
