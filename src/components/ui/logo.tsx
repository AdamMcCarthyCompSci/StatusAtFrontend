import { ComponentProps } from 'react';

import { cn } from '@/lib/utils';
import logoSvg from '@/assets/logo.svg';

interface LogoProps extends ComponentProps<'div'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const sizeClasses = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
  xl: 'h-12',
};

export const Logo = ({
  size = 'md',
  showText = true,
  className,
  ...props
}: LogoProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <div
        className={cn(
          sizeClasses[size],
          'bg-gradient-brand-subtle aspect-square w-auto rounded-md'
        )}
      >
        <img
          src={logoSvg}
          alt="StatusAt Logo"
          className={cn(sizeClasses[size], 'w-auto')}
        />
      </div>

      {showText && (
        <span className="text-lg font-semibold text-foreground">StatusAt</span>
      )}
    </div>
  );
};
