'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StarIcon, MapPinIcon, ClockIcon, ChevronDownIcon } from 'lucide-react';
import { ExpandableCard } from '../ui/expandable-card';
import { cn } from '../../lib/utils';
import { MenuItemCard } from './menu-item-card';
import { CardGrid } from '../layout/card-grid';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  popular?: boolean;
}

interface RestaurantCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface ExpandableRestaurantCardProps {
  id: string;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating: number;
  reviews?: number;
  address: string;
  distance?: string;
  priceLevel: 1 | 2 | 3 | 4;
  deliveryTime?: string;
  isOpen?: boolean;
  menu?: RestaurantCategory[];
  className?: string;
}

export function ExpandableRestaurantCard({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  reviews,
  address,
  distance,
  priceLevel,
  deliveryTime,
  isOpen = true,
  menu = [],
  className,
}: ExpandableRestaurantCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    menu.length > 0 ? menu[0].id : null
  );
  
  // Format price level
  const priceText = Array(priceLevel).fill('€').join('');
  
  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  // Get current category menu items
  const currentCategoryItems = menu.find(cat => cat.id === selectedCategory)?.items || [];
  
  // Collapsed card content
  const collapsedContent = (
    <div className="flex flex-col h-full">
      {/* Image with info overlay */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl || '/api/placeholder/400/200'}
          alt={name}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        
        {/* Rating badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-amber-600 px-2 py-1 rounded-md">
          <StarIcon className="h-4 w-4 fill-amber-500 stroke-amber-500" />
          <span className="font-medium">{rating.toFixed(1)}</span>
          {reviews && <span className="text-xs text-slate-500">({reviews})</span>}
        </div>
        
        {/* Open/Closed status */}
        <div className="absolute bottom-3 left-3">
          <span className={cn(
            "px-2 py-1 rounded-md text-sm font-medium",
            isOpen 
              ? "bg-green-500/90 text-white" 
              : "bg-slate-700/90 text-white"
          )}>
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 flex-grow">
        <h3 className="font-medium text-lg text-slate-800">{name}</h3>
        
        {/* Cuisine types */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {cuisineTypes.slice(0, 3).map(cuisine => (
            <span 
              key={cuisine} 
              className="inline-block px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700"
            >
              {cuisine}
            </span>
          ))}
          {cuisineTypes.length > 3 && (
            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
              +{cuisineTypes.length - 3}
            </span>
          )}
        </div>
        
        {/* Address */}
        <div className="flex items-center text-slate-600 text-sm mt-3">
          <MapPinIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>
        
        {/* Delivery time */}
        {deliveryTime && (
          <div className="flex items-center text-slate-600 text-sm mt-2">
            <ClockIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span>{deliveryTime} min delivery</span>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700">{priceText}</span>
        <button className="text-sm font-medium text-secondary flex items-center">
          View Menu <ChevronDownIcon className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
  
  // Expanded card content
  const expandedContent = (
    <div className="flex flex-col h-full overflow-auto">
      {/* Hero header */}
      <div className="relative h-48 md:h-64 w-full">
        <Image
          src={imageUrl || '/api/placeholder/800/400'}
          alt={name}
          className="object-cover"
          fill
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h2 className="text-2xl md:text-3xl font-bold">{name}</h2>
          <div className="flex items-center mt-2">
            <span className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md mr-3">
              <StarIcon className="h-4 w-4 mr-1 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
            </span>
            <span className="text-sm">{cuisineTypes.join(', ')}</span>
          </div>
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <div className="flex p-2 min-w-full">
          {menu.map(category => (
            <button
              key={category.id}
              className={cn(
                "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-md",
                selectedCategory === category.id
                  ? "bg-secondary text-white"
                  : "text-slate-700 hover:bg-slate-100"
              )}
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Menu items */}
      <div className="flex-grow p-4 overflow-auto">
        <div className="grid gap-3">
          {currentCategoryItems.map(item => (
            <MenuItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              imageUrl={item.imageUrl}
              isPopular={item.popular}
              onAddToCart={(id) => console.log('Add to cart:', id)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      className={cn("h-full cursor-pointer", className)}
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