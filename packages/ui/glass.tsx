/**
 * Glass Component - Glassmorphism Effect
 * 
 * Beautiful glass morphism container with blur effects.
 * Used for floating panels, modals, and overlays.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const glassVariants = cva(
  'backdrop-blur-xl border rounded-2xl transition-all',
  {
    variants: {
      variant: {
        default: 'bg-white/60 dark:bg-black/40 border-white/30 dark:border-white/10',
        strong: 'bg-white/80 dark:bg-black/60 border-white/40 dark:border-white/20',
        subtle: 'bg-white/40 dark:bg-black/20 border-white/20 dark:border-white/5',
        frosted: 'bg-white/70 dark:bg-black/50 border-white/30 backdrop-blur-2xl',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg shadow-black/10',
        xl: 'shadow-2xl shadow-black/20',
      },
      glow: {
        none: '',
        primary: 'shadow-[0_0_30px_rgba(59,130,246,0.2)]',
        secondary: 'shadow-[0_0_30px_rgba(168,85,247,0.2)]',
        white: 'shadow-[0_0_30px_rgba(255,255,255,0.3)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      shadow: 'md',
      glow: 'none',
    },
  }
);

export interface GlassProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassVariants> {
  /** Add inner glow effect */
  innerGlow?: boolean;
}

export const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  ({ className, variant, shadow, glow, innerGlow, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          glassVariants({ variant, shadow, glow, className }),
          innerGlow && 'shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]'
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Glass.displayName = 'Glass';

/**
 * Glass Panel - Pre-configured glass panel with padding
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Glass
        ref={ref}
        className={cn('p-6', className)}
        innerGlow
        {...props}
      >
        {children}
      </Glass>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

/**
 * Glass Card - Card-like glass component
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Glass
        ref={ref}
        variant="default"
        shadow="lg"
        className={cn('p-6 space-y-4', className)}
        {...props}
      >
        {children}
      </Glass>
    );
  }
);

GlassCard.displayName = 'GlassCard';
