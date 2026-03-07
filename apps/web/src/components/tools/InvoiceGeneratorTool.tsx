'use client';

import { useState, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

function genInvoiceNumber() {
  const now = new Date();
  return `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}`;
}

export default function InvoiceGeneratorTool() {
  const [company, setCompany] = useState('Acme Solutions');
  const [companyAddr, setCompanyAddr] = useState('123 Innovation Way\nSan Francisco, CA 94105');
  const [client, setClient] = useState('');
  const [clientAddr, setClientAddr] = useState('');
  const [invNum, setInvNum] = useState(genInvoiceNumber());
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<LineItem[]>([{ id: '1', description: 'Web Development Services', quantity: 1, unitPrice: 1200 }]);
  const [taxRate, setTaxRate] = useState(0);

  const updateItem = (id: string, field: keyof LineItem, val: any) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const subtotal = items.reduce((s, i) => s + (i.quantity * i.unitPrice), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const handlePrint = () => window.print();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-print">
        {/* Left: Configuration */}
        <div className="space-y-6">
            <Card title="Business Details">
                <div className="space-y-4">
                    <Input label="Your Company" value={company} onChange={e => setCompany(e.target.value)} />
                    <Input label="Business Address" value={companyAddr} onChange={e => setCompanyAddr(e.target.value)} />
                </div>
            </Card>

            <Card title="Client Details">
                <div className="space-y-4">
                    <Input label="Client Name" value={client} onChange={e => setClient(e.target.value)} placeholder="Recipient name..." />
                    <Input label="Client Address" value={clientAddr} onChange={e => setClientAddr(e.target.value)} placeholder="Shipping/Billing address..." />
                </div>
            </Card>

            <Card title="Invoice Meta">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Invoice #" value={invNum} onChange={e => setInvNum(e.target.value)} />
                    <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
            </Card>
        </div>

        {/* Right: Line Items */}
        <div className="space-y-6">
            <Card title="Line Items">
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 group relative">
                            <Input 
                                placeholder="Item description" 
                                value={item.description} 
                                onChange={e => updateItem(item.id, 'description', e.target.value)} 
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <Input 
                                    label="Qty" 
                                    type="number" 
                                    value={item.quantity} 
                                    onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} 
                                />
                                <Input 
                                    label="Price" 
                                    type="number" 
                                    value={item.unitPrice} 
                                    onChange={e => updateItem(item.id, 'unitPrice', Number(e.target.value))} 
                                />
                            </div>
                            {items.length > 1 && (
                                <button 
                                    onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-danger text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <Button variant="secondary" size="sm" className="w-full" onClick={() => setItems([...items, { id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 }])}>
                        + Add Item
                    </Button>
                </div>
            </Card>

            <Card title="Totals & Tax">
                <div className="space-y-4">
                    <Select 
                        label="Tax Rate" 
                        value={taxRate} 
                        onChange={e => setTaxRate(Number(e.target.value))}
                        options={[0, 5, 8, 10, 12, 15, 20].map(r => ({ value: r, label: `${r}%` }))}
                    />
                    <div className="pt-4 border-t border-white/5 space-y-2">
                        <div className="flex justify-between text-sm text-white/40">
                            <span>Subtotal</span>
                            <span className="font-mono">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-white/40">
                            <span>Tax ({taxRate}%)</span>
                            <span className="font-mono">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-white pt-2">
                            <span>Total Due</span>
                            <span className="text-accent font-mono">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Button variant="primary" size="lg" className="w-full" onClick={handlePrint} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>}>
                Print / Save as PDF
            </Button>
        </div>
      </div>

      {/* Printable Area */}
      <div className="bg-white text-black p-12 rounded-3xl shadow-2xl overflow-hidden print:p-0 print:shadow-none print:rounded-none">
        <div className="flex justify-between items-start border-b-2 border-black/5 pb-8 mb-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">{company || 'YOUR COMPANY'}</h1>
                <pre className="text-xs font-medium opacity-60 whitespace-pre-wrap leading-relaxed">{companyAddr}</pre>
            </div>
            <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Invoice Number</div>
                <div className="text-xl font-bold font-mono">{invNum}</div>
                <div className="mt-4">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Issue Date</div>
                    <div className="text-sm font-bold">{new Date(date).toLocaleDateString()}</div>
                </div>
            </div>
        </div>

        <div className="mb-12">
            <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Bill To</div>
            <div className="text-lg font-bold">{client || 'CLIENT NAME'}</div>
            <pre className="text-xs font-medium opacity-60 whitespace-pre-wrap leading-relaxed mt-1">{clientAddr}</pre>
        </div>

        <table className="w-full text-left mb-12">
            <thead className="border-b border-black/10">
                <tr>
                    <th className="py-3 text-[10px] font-black uppercase tracking-widest opacity-40">Description</th>
                    <th className="py-3 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">Qty</th>
                    <th className="py-3 text-[10px] font-black uppercase tracking-widest opacity-40 text-right">Price</th>
                    <th className="py-3 text-[10px] font-black uppercase tracking-widest opacity-40 text-right">Total</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
                {items.map(item => (
                    <tr key={item.id}>
                        <td className="py-4 text-sm font-bold">{item.description || 'Item Description'}</td>
                        <td className="py-4 text-sm font-mono text-center">{item.quantity}</td>
                        <td className="py-4 text-sm font-mono text-right">${item.unitPrice.toFixed(2)}</td>
                        <td className="py-4 text-sm font-mono text-right font-bold">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="flex justify-end">
            <div className="w-64 space-y-3">
                <div className="flex justify-between text-xs font-medium opacity-60">
                    <span>Subtotal</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium opacity-60">
                    <span>Tax ({taxRate}%)</span>
                    <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-3 border-t border-black/10">
                    <span>Total Due</span>
                    <span className="font-mono">${total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <div className="mt-20 pt-8 border-t border-black/5 text-[10px] font-medium opacity-40 text-center uppercase tracking-widest">
            Thank you for your business.
        </div>
      </div>
    </div>
  );
}
