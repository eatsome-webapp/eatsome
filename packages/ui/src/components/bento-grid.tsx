'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { motion, MotionProps } from 'framer-motion';

interface BentoGridProps {
  className?: string;
  children: React.ReactNode;
}

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'dark' | 'gold';
  motionProps?: MotionProps;
}

export const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-max', className)}>
      {children}
    </div>
  );
};

export const BentoCard = ({
  className,
  children,
  variant = 'default',
  motionProps,
  ...props
}: BentoCardProps) => {
  const variants = {
    default: 'bg-white border border-zinc-200/60 shadow-sm',
    elevated: 'bg-white border border-zinc-200/60 shadow-luxury',
    glass: 'bg-white/80 backdrop-blur-md border border-zinc-200/30 shadow-luxury',
    dark: 'bg-zinc-950 border border-zinc-800 text-white shadow-luxury-dark',
    gold: 'bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200 shadow-luxury-gold',
  };

  return (
    <motion.div
      className={cn(
        'rounded-xl overflow-hidden transition-all duration-200',
        variants[variant],
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};
