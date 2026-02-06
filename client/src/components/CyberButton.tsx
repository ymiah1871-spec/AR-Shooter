import React from 'react';
import { cn } from '@/lib/utils';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function CyberButton({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}: CyberButtonProps) {
  const variants = {
    primary: "bg-primary text-primary-foreground border-primary hover:bg-primary/80 hover:shadow-[0_0_20px_rgba(255,0,128,0.5)]",
    secondary: "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]",
    destructive: "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/80",
    outline: "bg-transparent text-foreground border-border hover:border-primary hover:text-primary",
  };

  const sizes = {
    sm: "h-8 px-4 text-xs clip-path-slant",
    md: "h-12 px-6 text-sm clip-path-slant",
    lg: "h-14 px-8 text-base clip-path-slant",
    xl: "h-24 w-24 rounded-full flex items-center justify-center text-xl font-bold border-4",
  };

  // Special handling for round buttons (fire button)
  const isRound = size === 'xl';
  const baseStyles = isRound 
    ? "relative transition-all duration-200 uppercase tracking-wider font-display active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
    : "relative border-2 transition-all duration-200 uppercase tracking-wider font-display font-bold active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none";

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {/* Decorative corner accents for non-round buttons */}
      {!isRound && (
        <>
          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/40" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/40" />
        </>
      )}
      {children}
    </button>
  );
}
