'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { gsap } from 'gsap';

interface CardGridProps {
  className?: string;
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  animate?: boolean;
}

export function CardGrid({
  className,
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = "gap-6",
  animate = true,
}: CardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Generate the grid template columns classes
  const getGridCols = () => {
    return [
      `grid-cols-${columns.sm || 1}`,
      `md:grid-cols-${columns.md || 2}`,
      `lg:grid-cols-${columns.lg || 3}`,
      `xl:grid-cols-${columns.xl || 4}`,
    ].join(' ');
  };
  
  // Staggered animation for children
  useEffect(() => {
    if (!animate || !gridRef.current) return;
    
    const cards = gridRef.current.children;
    
    gsap.fromTo(
      cards,
      { 
        y: 50,
        opacity: 0,
        scale: 0.95
      },
      { 
        y: 0, 
        opacity: 1,
        scale: 1,
        stagger: 0.08,
        duration: 0.5, 
        ease: "power2.out" 
      }
    );
  }, [animate, children]);
  
  return (
    <div
      ref={gridRef}
      className={cn(
        "grid w-full",
        getGridCols(),
        gap,
        className
      )}
    >
      {children}
    </div>
  );
} 