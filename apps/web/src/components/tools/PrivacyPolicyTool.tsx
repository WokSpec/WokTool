'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import CodeBlock from '@/components/ui/CodeBlock';

type Jurisdiction = 'US' | 'EU' | 'UK' | 'AU';

interface FormState {
  company: string;
  website: string;
  email: string;
  dataCollected: string[];
  jurisdiction: Jurisdiction;
}

const DATA_OPTIONS = [
  { id: 'name',      label: 'Name' },
  { id: 'email',     label: 'Email address' },
  { id: 'ip',        label: 'IP address' },
  { id: 'cookies',   label: 'Cookies / tracking data' },
  { id: 'payment',   label: 'Payment information' },
  { id: 'analytics', label: 'Usage analytics' },
];

const JURISDICTION_LAWS: Record<Jurisdiction, string> = {
  US: 'applicable US federal and state privacy laws',
  EU: 'the General Data Protection Regulation (GDPR)',
  UK: 'the UK GDPR and Data Protection Act 2018',
  AU: 'the Australian Privacy Act 1988',
};

function generatePolicy(f: FormState): string {
  const site = f.website || 'our website';
  const co = f.company || 'We';
  const email = f.email || 'contact@example.com';
  const law = JURISDICTION_LAWS[f.jurisdiction];
  const dataList = f.dataCollected.length
    ? f.dataCollected.map(d => DATA_OPTIONS.find(o => o.id === d)?.label ?? d).join(', ')
    : 'information you voluntarily provide';

  return `PRIVACY POLICY
Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

1. INTRODUCTION
${co} ("we", "us", or "our") operates ${site}. This Privacy Policy explains how we collect, use, and protect your personal information in accordance with ${law}.

2. INFORMATION WE COLLECT
We may collect the following types of information: ${dataList}.

We collect information in the following ways:
- Information you provide directly (e.g., contact forms, account registration)
- Automatically via cookies and similar tracking technologies
- From third-party services and partners

3. HOW WE USE YOUR INFORMATION
We use the information we collect to:
- Provide, operate, and maintain our services
- Improve and personalise your experience
- Process transactions and send related information
- Send administrative information, updates, and security alerts
- Respond to comments and questions
- Comply with legal obligations

4. SHARING YOUR INFORMATION
We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our website, provided they agree to keep it confidential.

We may disclose information when required by law or to protect our rights and safety.

5. COOKIES
${f.dataCollected.includes('cookies') ? 'We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.' : 'We use only essential cookies necessary for the website to function correctly.'}

6. DATA RETENTION
We retain your personal data only for as long as necessary to fulfil the purposes described in this policy, unless a longer retention period is required by law.

7. YOUR RIGHTS
${f.jurisdiction === 'EU' || f.jurisdiction === 'UK' ? `Under ${law}, you have the right to: access, correct, delete, restrict processing of, and port your personal data. You also have the right to object to processing and to withdraw consent at any time.` : `You may request access to, correction of, or deletion of your personal information by contacting us.`}

To exercise any of these rights, please contact us at ${email}.

8. DATA SECURITY
We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.

9. THIRD-PARTY LINKS
Our website may contain links to third-party sites. We are not responsible for the privacy practices of those sites and encourage you to read their privacy policies.

10. CHILDREN'S PRIVACY
Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children.

11. CHANGES TO THIS POLICY
We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Changes are effective immediately upon posting.

12. CONTACT US
If you have questions about this Privacy Policy, please contact us at:
${co}
${f.website ? site + '\n' : ''}Email: ${email}
`;
}

export default function PrivacyPolicyTool() {
  const [form, setForm] = useState<FormState>({
    company: '', website: '', email: '',
    dataCollected: ['email', 'name', 'cookies'],
    jurisdiction: 'US',
  });
  const [policy, setPolicy] = useState('');

  const toggleData = (id: string) => {
    setForm(prev => ({
      ...prev,
      dataCollected: prev.dataCollected.includes(id)
        ? prev.dataCollected.filter(d => d !== id)
        : [...prev.dataCollected, id],
    }));
  };

  const handleGenerate = () => setPolicy(generatePolicy(form));

  const download = () => {
    const blob = new Blob([policy], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'privacy-policy.txt';
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
            <Card title="Identity">
                <div className="space-y-4">
                    <Input label="Company / Website Name" value={form.company} onChange={e => setForm(p => ({...p, company: e.target.value}))} placeholder="Acme Inc." />
                    <Input label="Website URL" value={form.website} onChange={e => setForm(p => ({...p, website: e.target.value}))} placeholder="https://example.com" />
                    <Input label="Contact Email" type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="privacy@example.com" />
                </div>
            </Card>

            <Card title="Legal & Data">
                <div className="space-y-6">
                    <Select 
                        label="Primary Jurisdiction" 
                        value={form.jurisdiction} 
                        onChange={e => setForm(p => ({...p, jurisdiction: e.target.value as Jurisdiction}))}
                        options={[
                            { value: 'US', label: 'United States' },
                            { value: 'EU', label: 'European Union (GDPR)' },
                            { value: 'UK', label: 'United Kingdom' },
                            { value: 'AU', label: 'Australia' },
                        ]}
                    />

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest px-1">Data Points Collected</label>
                        <div className="grid grid-cols-2 gap-2">
                            {DATA_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => toggleData(opt.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${form.dataCollected.includes(opt.id) ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-surface-raised border-white/5 text-white/40 hover:text-white hover:bg-white/[0.02]'}`}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${form.dataCollected.includes(opt.id) ? 'bg-accent border-accent text-white' : 'border-white/10 bg-white/5'}`}>
                                        {form.dataCollected.includes(opt.id) && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <span className="text-xs font-bold">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            <Button onClick={handleGenerate} size="lg" className="w-full">
                Generate Privacy Policy
            </Button>
        </div>

        {/* Preview */}
        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Generated Policy</h3>
            {policy ? (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                    <CodeBlock code={policy} language="text" maxHeight="600px" />
                    <div className="flex gap-3">
                        <Button variant="primary" className="flex-1" onClick={download}>Download .txt</Button>
                        <Button variant="secondary" onClick={() => navigator.clipboard.writeText(policy)}>Copy to Clipboard</Button>
                    </div>
                </div>
            ) : (
                <div className="h-[500px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12 opacity-20">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl">🛡️</div>
                    <p className="text-sm">Your policy will appear here after generation</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
