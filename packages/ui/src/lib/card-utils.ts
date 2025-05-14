import { useState, useEffect, useRef } from 'react';

/**
 * Hook to handle card expanding behavior
 */
export function useCardExpand(initialExpanded: boolean = false) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Capture position before expanding
  useEffect(() => {
    if (cardRef.current && !expanded) {
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      });
    }
  }, [expanded]);
  
  // Toggle expand state
  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };
  
  return { expanded, setExpanded, toggleExpand, position, cardRef };
}

/**
 * Calculate z-index for stacked cards
 */
export function getStackedZIndex(index: number, total: number) {
  return total - index;
}

/**
 * Generate random slight rotation for stacked cards
 */
export function getStackedRotation(index: number) {
  // Randomize rotation between -3 and 3 degrees
  const rotations = [-3, -2, -1, 1, 2, 3];
  return rotations[index % rotations.length];
}

/**
 * Calculate scale for stacked cards
 */
export function getStackedScale(index: number) {
  return Math.max(1 - (index * 0.03), 0.91);
}

/**
 * Calculate position for stacked cards
 */
export function getStackedPosition(index: number) {
  return {
    x: index % 2 === 0 ? -4 : 4,
    y: index * 8
  };
} 