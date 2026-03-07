'use client';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export default function Card({ children, className = '', title, description }: CardProps) {
  return (
    <div className={`group relative bg-bg-subtle border border-white/5 transition-all duration-500 hover:border-white/15 ${className}`}>
      {/* Structural Corner Accents (Industrial vibe) */}
      <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

      {(title || description) && (
        <div className="p-8 border-b border-white/5">
          {title && <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/80 mb-2">{title}</h3>}
          {description && <p className="text-[11px] text-white/30 font-bold uppercase tracking-tight leading-relaxed">{description}</p>}
        </div>
      )}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
}
