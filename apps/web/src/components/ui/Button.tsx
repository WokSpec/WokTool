'use client';

import { forwardRef } from 'react';
import Link from 'next/link';

type ButtonOrAnchorProps = React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>;

interface ButtonProps extends Partial<ButtonOrAnchorProps> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  download?: string;
  target?: string;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', href, loading, icon, children, download, target, type = 'button', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-[0.2em] transition-all active:scale-[0.96] disabled:opacity-30 disabled:pointer-events-none gap-3 cursor-pointer no-underline border';
    
    const variants = {
      primary: 'bg-white text-black border-white hover:bg-transparent hover:text-white',
      secondary: 'bg-transparent text-white border-white/10 hover:border-white/40 hover:bg-white/5',
      ghost: 'bg-transparent text-white/30 border-transparent hover:text-white hover:bg-white/5',
      danger: 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20',
      accent: 'bg-accent text-black border-accent hover:bg-transparent hover:text-accent',
    };

    const sizes = {
      sm: 'text-[9px] px-4 py-2',
      md: 'text-[10px] px-6 py-3',
      lg: 'text-[11px] px-10 py-4',
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    const content = (
      <>
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!loading && icon && <span className="opacity-60 group-hover:opacity-100 transition-opacity">{icon}</span>}
        {children}
      </>
    );

    if (href && (download !== undefined || target === '_blank' || href.startsWith('http') || href.startsWith('blob:'))) {
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
