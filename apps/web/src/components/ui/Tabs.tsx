'use client';

import * as React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center justify-center gap-2.5 px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all flex-1
              ${isActive 
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]'
              }
            `}
          >
            {tab.icon && <span className={isActive ? 'text-black' : 'opacity-40 group-hover:opacity-100'}>{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
