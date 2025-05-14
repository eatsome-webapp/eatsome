'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface LayeredCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: 'shallow' | 'medium' | 'deep';
  hover?: boolean;
  onClick?: () => void;
}

export function LayeredCard({
  children,
  className,
  depth = 'medium',
  hover = false,
  onClick,
}: LayeredCardProps) {
  // Define shadow and border based on depth
  const getShadowClasses = () => {
    switch (depth) {
      case 'shallow':
        return 'shadow-sm border border-slate-100';
      case 'deep':
        return 'shadow-lg border border-slate-100';
      case 'medium':
      default:
        return 'shadow-md border border-slate-100';
    }
  };
  
  return (
    <motion.div
      className={cn(
        'bg-white rounded-lg overflow-hidden',
        getShadowClasses(),
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
        onClick && 'cursor-pointer',
        className
      )}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

// Card header component
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("px-6 py-4 border-b border-slate-100", className)}>
      {children}
    </div>
  );
}

// Card content component
export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}

// Card footer component
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("px-6 py-4 border-t border-slate-100", className)}>
      {children}
    </div>
  );
} 