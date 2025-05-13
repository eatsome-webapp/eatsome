'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderMode } from '../../app/(dashboard)/pos/layout';
import { LayoutGrid, ShoppingBag, Truck } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface POSTabsProps {
  activeTab: OrderMode;
  onChange: (value: string) => void;
}

const POSTabs = ({ activeTab, onChange }: POSTabsProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className="py-2">
      <Tabs value={activeTab} onValueChange={onChange} className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-12">
          <TabsTrigger 
            value={OrderMode.DINE_IN} 
            className="data-[state=active]:bg-primary-500 data-[state=active]:text-black h-full flex gap-2 items-center"
          >
            <LayoutGrid size={18} />
            <span className="hidden sm:inline">Dine In</span>
          </TabsTrigger>
          <TabsTrigger 
            value={OrderMode.TAKEOUT} 
            className="data-[state=active]:bg-primary-500 data-[state=active]:text-black h-full flex gap-2 items-center"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Takeout</span>
          </TabsTrigger>
          <TabsTrigger 
            value={OrderMode.DELIVERY} 
            className="data-[state=active]:bg-primary-500 data-[state=active]:text-black h-full flex gap-2 items-center"
          >
            <Truck size={18} />
            <span className="hidden sm:inline">Delivery</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {!prefersReducedMotion && (
        <motion.div 
          className="h-1 bg-primary-500 mt-1"
          layoutId="tab-indicator"
          transition={{ type: 'spring', duration: 0.5 }}
          style={{ 
            width: '33.333%', 
            x: activeTab === OrderMode.DINE_IN ? 0 : 
               activeTab === OrderMode.TAKEOUT ? '100%' : '200%' 
          }}
        />
      )}
    </div>
  );
};

export default POSTabs; 