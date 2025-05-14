'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuickAddItemProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  maxQuantity?: number;
  onAdd?: (id: string, quantity: number) => void;
  className?: string;
}

export function QuickAddItem({
  id,
  name,
  description,
  price,
  imageUrl,
  maxQuantity = 10,
  onAdd,
  className,
}: QuickAddItemProps) {
  const [quantity, setQuantity] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const handleAdd = () => {
    if (quantity === 0) {
      setQuantity(1);
      setIsAdding(true);
    } else {
      onAdd?.(id, quantity);
      setIsAdded(true);
      setIsAdding(false);
      
      // Reset after animation
      setTimeout(() => {
        setIsAdded(false);
        setQuantity(0);
      }, 2000);
    }
  };
  
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setIsAdding(false);
      setQuantity(0);
    }
  };
  
  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };
  
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden flex",
      className
    )}>
      {/* Image */}
      {imageUrl && (
        <div className="relative h-20 w-20 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="flex-grow py-2 px-3 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-medium text-sm text-slate-800 truncate">{name}</h3>
          {description && (
            <p className="text-xs text-slate-500 line-clamp-1">{description}</p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm text-slate-800">€{price.toFixed(2)}</span>
          
          {/* Add to cart button/counter */}
          <div className="flex items-center">
            <AnimatePresence mode="wait">
              {!isAdding && !isAdded && (
                <motion.button
                  key="add-button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="rounded-full h-8 w-8 flex items-center justify-center bg-secondary text-white"
                  onClick={handleAdd}
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              )}
              
              {isAdding && (
                <motion.div
                  key="quantity-controls"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center border border-slate-200 rounded-full overflow-hidden"
                >
                  <button
                    className="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                    onClick={handleDecrease}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                  <button 
                    className="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                    onClick={handleIncrease}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}
              
              {isAdded && (
                <motion.button
                  key="added-button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="rounded-full h-8 w-8 flex items-center justify-center bg-green-500 text-white"
                >
                  <Check className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 