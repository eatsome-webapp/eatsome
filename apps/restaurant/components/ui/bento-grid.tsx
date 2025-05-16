'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

type BentoCardVariant = 'default' | 'elevated' | 'glass' | 'dark' | 'gold';

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  variant?: BentoCardVariant;
  motionProps?: Omit<HTMLMotionProps<'div'>, 'children' | 'className'>;
}

export const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-max', className)}>
      {children}
    </div>
  );
};

const variantClasses: Record<BentoCardVariant, string> = {
  default: 'bg-white border border-zinc-200/60 shadow-sm',
  elevated: 'bg-white border border-zinc-200/60 shadow-luxury',
  glass: 'bg-white/80 backdrop-blur-md border border-zinc-200/30 shadow-luxury',
  dark: 'bg-zinc-950 border border-zinc-800 text-white shadow-luxury-dark',
  gold: 'bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200 shadow-luxury-gold',
};

export const BentoCard = ({
  className,
  children,
  variant = 'default',
  motionProps = {},
  ...props
}: BentoCardProps) => (
  <div
    className={cn(
      'rounded-xl overflow-hidden transition-all duration-200',
      variantClasses[variant],
      className
    )}
    {...props}
  >
    {children}
  </div>
);

BentoCard.displayName = 'BentoCard';
