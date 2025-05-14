'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Plus, TrendingUp } from 'lucide-react';

interface MenuItemCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isPopular?: boolean;
  onAddToCart: (id: string) => void;
  className?: string;
}

export function MenuItemCard({
  id,
  name,
  description,
  price,
  imageUrl,
  isPopular = false,
  onAddToCart,
  className,
}: MenuItemCardProps) {
  const handleAddToCart = () => {
    onAddToCart(id);
  };

  return (
    <motion.div
      className={cn(
        "relative flex overflow-hidden bg-white rounded-lg border border-slate-100 shadow-sm",
        className
      )}
      whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-amber-500/90 text-white text-xs font-medium py-1 px-2 rounded-full">
          <TrendingUp className="w-3 h-3" />
          <span>Popular</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-grow p-3">
        <h3 className="font-medium text-slate-800">{name}</h3>
        <p className="text-sm text-slate-600 line-clamp-2 mt-1">{description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-medium text-slate-900">€{price.toFixed(2)}</span>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleAddToCart}
            className="px-2"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="relative h-auto w-24 md:w-32 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={name}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 25vw, 15vw"
          />
        </div>
      )}
    </motion.div>
  );
}