'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface CategorySliderProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  className?: string;
}

export function CategorySlider({
  categories,
  selectedCategoryId,
  onSelectCategory,
  className,
}: CategorySliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Scroll selected category into view
  useEffect(() => {
    if (!sliderRef.current) return;
    
    const slider = sliderRef.current;
    const selectedItem = slider.querySelector(`[data-category-id="${selectedCategoryId}"]`);
    
    if (selectedItem) {
      const itemRect = selectedItem.getBoundingClientRect();
      const sliderRect = slider.getBoundingClientRect();
      
      // Check if the item is outside the visible area
      if (itemRect.left < sliderRect.left || itemRect.right > sliderRect.right) {
        // Scroll to center the item
        selectedItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedCategoryId]);
  
  // Handle scroll buttons
  const handleScrollLeft = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };
  
  const handleScrollRight = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };
  
  return (
    <div className={cn("relative group", className)}>
      {/* Scroll buttons */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleScrollLeft}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleScrollRight}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      
      {/* Category slider */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide py-2 px-4 -mx-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            data-category-id={category.id}
            className={cn(
              "flex items-center px-4 py-2 rounded-full whitespace-nowrap mr-2 transition-colors",
              selectedCategoryId === category.id
                ? "bg-secondary text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.icon && (
              <span className="mr-2">{category.icon}</span>
            )}
            <span className="font-medium text-sm">{category.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
} 