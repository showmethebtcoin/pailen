
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo = ({ size = 'md', className }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn('font-display font-semibold text-primary', sizeClasses[size], className)}>
      <span className="text-primary">Pai</span>
      <span className="text-foreground">len</span>
    </div>
  );
};

export default Logo;
