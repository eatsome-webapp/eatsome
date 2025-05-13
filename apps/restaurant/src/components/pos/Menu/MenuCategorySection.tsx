'use client';

import React from 'react';
import { MenuCategory, MenuItem } from '@/types';
import MenuItemCard from './MenuItemCard';

interface MenuCategorySectionProps {
  category: MenuCategory;
  items: MenuItem[];
  onAddItem: (item: MenuItem) => void;
}

const MenuCategorySection = ({ category, items, onAddItem }: MenuCategorySectionProps) => {
  // Don't render categories with no items
  if (items.length === 0) {
    return null;
  }
  
  return (
    <div id={`category-${category.id}`} className="scroll-mt-16">
      <h3 className="text-lg font-medium mb-4">{category.name}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <MenuItemCard 
            key={item.id} 
            item={item} 
            onAdd={() => onAddItem(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuCategorySection; 