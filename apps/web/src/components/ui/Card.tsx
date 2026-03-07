'use client';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export default function Card({ children, className = '', title, description }: CardProps) {
  return (
    <div className={`group relative bg-[#050505] border border-white/[0.06] rounded-[1.5rem] p-6 transition-all duration-500 hover:border-white/[0.15] hover:shadow-[0_0_40px_rgba(255,255,255,0.01)] ${className}`}>
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      {(title || description) && (
        <div className="relative mb-6">
          {title && <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5">{title}</h3>}
          {description && <p className="text-[13px] text-zinc-600 font-medium leading-relaxed">{description}</p>}
        </div>
      )}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
