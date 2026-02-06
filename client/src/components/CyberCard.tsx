import React from 'react';
import { cn } from '@/lib/utils';

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function CyberCard({ className, children, hoverEffect = false, ...props }: CyberCardProps) {
  return (
    <div 
      className={cn(
        "relative bg-card border border-border p-6",
        "before:absolute before:top-0 before:left-0 before:w-4 before:h-4 before:border-t-2 before:border-l-2 before:border-primary",
        "after:absolute after:bottom-0 after:right-0 after:w-4 after:h-4 after:border-b-2 after:border-r-2 after:border-primary",
        hoverEffect && "hover:border-primary/50 hover:bg-primary/5 transition-colors duration-300",
        className
      )}
      {...props}
    >
      {/* Scanline effect overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,6px_100%] pointer-events-none z-0 opacity-20" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
