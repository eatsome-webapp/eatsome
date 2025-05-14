import React, { useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { animateGridItems } from '../../lib/gsap-animations';

interface ResponsiveCardGridProps {
  children: React.ReactNode;
  className?: string;
  gapX?: string;
  gapY?: string;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  animate?: boolean;
}

export function ResponsiveCardGrid({
  children,
  className,
  gapX = 'gap-x-4',
  gapY = 'gap-y-6',
  columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  },
  animate = true,
}: ResponsiveCardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Build column class names
  const columnClasses = [
    `grid-cols-${columns.sm || 1}`,
    `md:grid-cols-${columns.md || 2}`,
    `lg:grid-cols-${columns.lg || 3}`,
    `xl:grid-cols-${columns.xl || 4}`,
  ];
  
  // Apply GSAP animations
  useEffect(() => {
    if (!animate || !gridRef.current) return;
    
    const cards = Array.from(gridRef.current.children) as HTMLElement[];
    
    const animation = animateGridItems(cards);
    
    return () => {
      animation.kill();
    };
  }, [animate, children]);
  
  return (
    <div
      ref={gridRef}
      className={cn(
        'grid w-full',
        gapX,
        gapY,
        ...columnClasses,
        className
      )}
    >
      {children}
    </div>
  );
} 