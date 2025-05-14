import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardSkeletonProps {
  className?: string;
  imageHeight?: number;
  lines?: number;
  hasFooter?: boolean;
  hasActions?: boolean;
}

export function CardSkeleton({
  className,
  imageHeight = 180,
  lines = 3,
  hasFooter = true,
  hasActions = true,
}: CardSkeletonProps) {
  return (
    <div 
      className={cn(
        "rounded-lg overflow-hidden shadow-card bg-white",
        className
      )}
    >
      {/* Image skeleton */}
      <div 
        className="bg-slate-200 animate-pulse" 
        style={{ height: `${imageHeight}px` }}
      />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-slate-200 rounded animate-pulse w-3/4" />
        
        {/* Description lines */}
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-4 bg-slate-200 rounded animate-pulse",
              i === lines - 1 ? "w-1/2" : "w-full"
            )}
            style={{
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>
      
      {/* Footer */}
      {hasFooter && (
        <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-1/4" />
          
          {hasActions && (
            <div className="flex space-x-2">
              <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
              <div className="h-8 w-20 bg-slate-200 rounded animate-pulse" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Skeletons for different content types
export function RestaurantCardSkeleton({ className }: { className?: string }) {
  return (
    <CardSkeleton 
      className={className}
      imageHeight={180}
      lines={3}
      hasFooter={true}
      hasActions={true}
    />
  );
}

export function MenuItemCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex p-4 rounded-lg shadow-card bg-white", className)}>
      {/* Image */}
      <div className="h-20 w-20 rounded-md bg-slate-200 animate-pulse flex-shrink-0 mr-4" />
      
      {/* Content */}
      <div className="flex-grow space-y-2">
        <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
      </div>
      
      {/* Price */}
      <div className="ml-3 h-5 w-14 bg-slate-200 rounded animate-pulse" />
    </div>
  );
} 