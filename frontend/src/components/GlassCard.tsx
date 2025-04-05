
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  hover?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, blur = 'md', opacity = 80, hover = true, ...props }, ref) => {
    const blurValue = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl',
    }[blur];
    
    const bgOpacity = `bg-white/${opacity}`;
    const hoverEffect = hover ? 'transition-all duration-300 hover:shadow-glass-hover' : '';
    
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-white/20 shadow-glass',
          blurValue,
          bgOpacity,
          hoverEffect,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;
