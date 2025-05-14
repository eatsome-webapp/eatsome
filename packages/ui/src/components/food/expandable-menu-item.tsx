'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, MinusIcon, X } from 'lucide-react';
import { ExpandableCard } from '../ui/expandable-card';
import { cn } from '../../lib/utils';

interface MenuItemOption {
  id: string;
  name: string;
  price?: number;
}

interface MenuItemModifier {
  id: string;
  name: string;
  required?: boolean;
  multiple?: boolean;
  options: MenuItemOption[];
}

interface ExpandableMenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  modifiers?: MenuItemModifier[];
  className?: string;
  onAddToCart?: (id: string, modifiers: Record<string, string | string[]>) => void;
}

export function ExpandableMenuItem({
  id,
  name,
  description,
  price,
  imageUrl,
  isVegetarian = false,
  isVegan = false,
  isGlutenFree = false,
  isSpicy = false,
  modifiers = [],
  className,
  onAddToCart,
}: ExpandableMenuItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string | string[]>>({});
  
  // Initialize modifier selections
  React.useEffect(() => {
    if (expanded && modifiers.length > 0) {
      const initialSelections: Record<string, string | string[]> = {};
      
      modifiers.forEach(modifier => {
        if (modifier.required && !modifier.multiple && modifier.options.length > 0) {
          initialSelections[modifier.id] = modifier.options[0].id;
        } else if (modifier.multiple) {
          initialSelections[modifier.id] = [];
        }
      });
      
      setSelectedModifiers(initialSelections);
    }
  }, [expanded, modifiers]);
  
  // Handle option selection
  const handleOptionSelect = (modifierId: string, optionId: string) => {
    setSelectedModifiers(prev => {
      const modifier = modifiers.find(m => m.id === modifierId);
      
      if (!modifier) return prev;
      
      if (modifier.multiple) {
        const currentSelections = Array.isArray(prev[modifierId]) ? prev[modifierId] as string[] : [];
        
        if (currentSelections.includes(optionId)) {
          return {
            ...prev,
            [modifierId]: currentSelections.filter(id => id !== optionId)
          };
        } else {
          return {
            ...prev,
            [modifierId]: [...currentSelections, optionId]
          };
        }
      } else {
        return {
          ...prev,
          [modifierId]: optionId
        };
      }
    });
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    let total = price * quantity;
    
    // Add modifier prices
    for (const [modifierId, selection] of Object.entries(selectedModifiers)) {
      const modifier = modifiers.find(m => m.id === modifierId);
      
      if (!modifier) continue;
      
      if (Array.isArray(selection)) {
        // Multiple selections
        selection.forEach(optionId => {
          const option = modifier.options.find(o => o.id === optionId);
          if (option && option.price) {
            total += option.price * quantity;
          }
        });
      } else {
        // Single selection
        const option = modifier.options.find(o => o.id === selection);
        if (option && option.price) {
          total += option.price * quantity;
        }
      }
    }
    
    return total.toFixed(2);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    onAddToCart?.(id, selectedModifiers);
    setExpanded(false);
  };
  
  // Collapsed content
  const collapsedContent = (
    <div className="flex p-4">
      {/* Image if available */}
      {imageUrl && (
        <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 mr-4">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-slate-800">{name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mt-1">{description}</p>
          </div>
          <div className="ml-2 flex-shrink-0">
            <span className="font-medium text-slate-800">€{price.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Dietary badges */}
        {(isVegetarian || isVegan || isGlutenFree || isSpicy) && (
          <div className="flex flex-wrap gap-1 mt-2">
            {isVegetarian && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Veg</span>}
            {isVegan && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Vegan</span>}
            {isGlutenFree && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">GF</span>}
            {isSpicy && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Spicy</span>}
          </div>
        )}
      </div>
    </div>
  );
  
  // Expanded content
  const expandedContent = (
    <div className="flex flex-col h-full overflow-auto">
      {/* Item image */}
      <div className="relative h-48 w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-slate-100 flex items-center justify-center">
            <span className="text-slate-400">No image available</span>
          </div>
        )}
      </div>
      
      {/* Header section */}
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-xl font-semibold text-slate-800">{name}</h2>
        <p className="text-slate-600 mt-1">{description}</p>
        
        {/* Dietary badges */}
        {(isVegetarian || isVegan || isGlutenFree || isSpicy) && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {isVegetarian && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Vegetarian</span>}
            {isVegan && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Vegan</span>}
            {isGlutenFree && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Gluten Free</span>}
            {isSpicy && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Spicy</span>}
          </div>
        )}
      </div>
      
      {/* Modifiers section */}
      <div className="flex-grow p-5 overflow-auto">
        {modifiers.map(modifier => (
          <div key={modifier.id} className="mb-6">
            <h3 className="font-medium text-slate-800 mb-3">
              {modifier.name}
              {modifier.required && <span className="text-red-500 ml-1">*</span>}
              {modifier.multiple && <span className="text-xs font-normal text-slate-500 ml-2">(Select multiple)</span>}
            </h3>
            
            <div className="grid gap-2">
              {modifier.options.map(option => {
                // Check if option is selected
                let isSelected = false;
                if (modifier.multiple) {
                  const selections = selectedModifiers[modifier.id] as string[] || [];
                  isSelected = selections.includes(option.id);
                } else {
                  isSelected = selectedModifiers[modifier.id] === option.id;
                }
                
                return (
                  <button
                    key={option.id}
                    className={cn(
                      "flex justify-between items-center p-3 rounded-lg border text-left",
                      isSelected
                        ? "border-secondary bg-secondary/5"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                    onClick={() => handleOptionSelect(modifier.id, option.id)}
                  >
                    <span className="font-medium">{option.name}</span>
                    {option.price && option.price > 0 && (
                      <span className="text-sm text-slate-600">+€{option.price.toFixed(2)}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer with quantity and add to cart */}
      <div className="p-5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center border border-slate-200 rounded-lg">
          <button 
            className="px-3 py-2 text-slate-600 hover:bg-slate-50"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <span className="px-3 py-2 font-medium">{quantity}</span>
          <button 
            className="px-3 py-2 text-slate-600 hover:bg-slate-50"
            onClick={() => setQuantity(quantity + 1)}
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
        
        <button 
          className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={handleAddToCart}
        >
          Add to Cart • €{calculateTotalPrice()}
        </button>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      className={cn("cursor-pointer", className)}
      expanded={expanded}
      onExpand={() => setExpanded(true)}
      onCollapse={() => setExpanded(false)}
      expandedContent={expandedContent}
      fullScreenOnMobile={true}
    >
      {collapsedContent}
    </ExpandableCard>
  );
}