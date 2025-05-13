'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Info, Edit } from 'lucide-react';
import { MenuItem } from '@/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatCurrency } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: () => void;
}

const MenuItemCard = ({ item, onAdd }: MenuItemCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Format price
  const formattedPrice = formatCurrency(item.price);
  
  return (
    <motion.div 
      className="h-full"
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
    >
      <Card className="h-full flex flex-col overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-colors">
        {/* Optional image */}
        {item.imageUrl && (
          <div className="relative w-full h-32">
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="h-full w-full object-cover" 
            />
          </div>
        )}
        
        <div className="p-3 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-base">{item.name}</h4>
            <div className="text-base font-semibold">{formattedPrice}</div>
          </div>
          
          {item.description && (
            <p className="text-sm text-neutral-600 mb-2 line-clamp-2">{item.description}</p>
          )}
          
          {/* Dietary tags */}
          {item.dietaryFlags && item.dietaryFlags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto mb-2">
              {item.dietaryFlags.map(flag => (
                <span 
                  key={flag} 
                  className="text-xs px-1.5 py-0.5 bg-primary-100 text-primary-800 rounded-sm capitalize"
                >
                  {flag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex justify-between mt-auto pt-2">
            <Button 
              variant="outline" 
              size="icon"
              className="h-8 w-8"
            >
              <Info className="h-4 w-4" />
            </Button>
            
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm"
                className="h-8"
                onClick={onAdd}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MenuItemCard; 