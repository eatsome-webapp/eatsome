'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { LayeredCard } from '../ui/layered-card';

interface StatCardProps {
  title: string;
  value: number | string;
  format?: 'number' | 'currency' | 'percentage';
  icon?: React.ReactNode;
  change?: number;
  changeText?: string;
  changeTimeframe?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  format = 'number',
  icon,
  change,
  changeText,
  changeTimeframe = 'vs. last period',
  trendDirection,
  loading = false,
  className,
}: StatCardProps) {
  const valueRef = useRef<HTMLDivElement>(null);
  
  // Format the value based on the format prop
  const formatValue = () => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return `€${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percentage':
        return `${value}%`;
      case 'number':
      default:
        return value.toLocaleString();
    }
  };
  
  // Get change color and icon
  const getChangeColor = () => {
    if (!trendDirection) return 'text-slate-600';
    
    switch (trendDirection) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
      default:
        return 'text-slate-600';
    }
  };
  
  const getChangeIcon = () => {
    switch (trendDirection) {
      case 'up':
        return <ArrowUp className="h-3.5 w-3.5" />;
      case 'down':
        return <ArrowDown className="h-3.5 w-3.5" />;
      case 'neutral':
      default:
        return <ArrowRight className="h-3.5 w-3.5" />;
    }
  };
  
  // Animate value when it changes
  useEffect(() => {
    if (loading || !valueRef.current) return;
    
    // Simple bounce animation
    gsap.fromTo(
      valueRef.current,
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'bounce.out' }
    );
  }, [value, loading]);
  
  return (
    <LayeredCard 
      className={cn("overflow-hidden", className)}
      depth="shallow"
      hover={true}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
          {icon && (
            <div className="text-slate-400">
              {icon}
            </div>
          )}
        </div>
        
        {/* Value */}
        {loading ? (
          <div className="animate-pulse h-8 w-2/3 bg-slate-200 rounded mb-2" />
        ) : (
          <div ref={valueRef} className="text-2xl font-bold text-slate-800">
            {formatValue()}
          </div>
        )}
        
        {/* Change */}
        {(change !== undefined || changeText) && (
          <div className="mt-2 flex items-center">
            {loading ? (
              <div className="animate-pulse h-4 w-1/2 bg-slate-200 rounded" />
            ) : (
              <>
                {trendDirection && (
                  <span className={cn("flex items-center mr-1", getChangeColor())}>
                    {getChangeIcon()}
                  </span>
                )}
                <span className={cn("text-xs font-medium", getChangeColor())}>
                  {changeText || (change !== undefined && `${Math.abs(change)}%`)}
                </span>
                {changeTimeframe && (
                  <span className="text-xs text-slate-500 ml-1">
                    {changeTimeframe}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </LayeredCard>
  );
}

// Stats grid component for easy layout
export function StatsGrid({ children, columns = 4, className }: { 
  children: React.ReactNode, 
  columns?: 2 | 3 | 4,
  className?: string
}) {
  return (
    <div 
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
} 