'use client';

import { forwardRef } from 'react';
import Link from 'next/link';

type ButtonOrAnchorProps = React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>;

interface ButtonProps extends Partial<ButtonOrAnchorProps> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  download?: string;
  target?: string;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', href, loading, icon, children, download, target, type = 'button', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-2.5 cursor-pointer no-underline tracking-tight';
    
    const variants = {
      primary: 'bg-white text-black hover:bg-[#e2e2e2] shadow-[0_0_20px_rgba(255,255,255,0.1)]',
      secondary: 'bg-white/[0.03] border border-white/[0.08] text-white hover:bg-white/[0.06] hover:border-white/[0.15]',
      ghost: 'bg-transparent text-zinc-500 hover:text-white hover:bg-white/[0.03]',
      danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20',
    };

    const sizes = {
      sm: 'text-[11px] px-4 py-1.5 uppercase tracking-widest',
      md: 'text-[13px] px-6 py-2.5',
      lg: 'text-[15px] px-8 py-3.5',
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    const content = (
      <>
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!loading && icon && <span className="opacity-70">{icon}</span>}
        {children}
      </>
    );

    if (href && (download || target === '_blank' || href.startsWith('http') || href.startsWith('blob:'))) {
      return (
        <a 
          href={href} 
          className={classes} 
          ref={ref as React.Ref<HTMLAnchorElement>} 
          download={download} 
          target={target} 
          {...props as React.AnchorHTMLAttributes<HTMLAnchorElement>}
        >
          {content}
        </a>
      );
    }

    if (href) {
      return (
        <Link href={href} className={classes} ref={ref as any} {...(props as any)}>
          {content}
        </Link>
      );
    }

    return (
      <button 
        type={type as "button" | "submit" | "reset"} 
        className={classes} 
        ref={ref as React.Ref<HTMLButtonElement>} 
        disabled={loading || props.disabled} 
        {...props as React.ButtonHTMLAttributes<HTMLButtonElement>}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
