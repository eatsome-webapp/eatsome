'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Bell, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const POSHeader = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const prefersReducedMotion = useReducedMotion();

  const headerVariants = {
    collapsed: { height: '56px' },
    expanded: { height: '120px' }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.header 
      className="bg-white border-b border-neutral-200 shadow-sm px-4 relative z-10 overflow-hidden"
      variants={headerVariants}
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
    >
      <div className="flex items-center justify-between h-14">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline"
            size="icon"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold hidden md:block">
            Eatsome POS
          </h1>
        </div>
        
        <div className="flex-1 max-w-md mx-auto px-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input 
              type="text"
              placeholder="Search menu, tables, orders..."
              className="pl-8 h-9 rounded-full bg-neutral-50"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mobile search button */}
          <Button 
            variant="outline" 
            size="icon"
            className="md:hidden"
            onClick={toggleExpanded}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Add customer button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="hidden md:flex"
              >
                <UserPlus className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <Card className="border-0 shadow-none">
                <div className="p-4 border-b">
                  <h2 className="font-semibold">Add Customer</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input type="text" placeholder="Customer name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input type="tel" placeholder="Phone number" />
                  </div>
                  <Button className="w-full">Add Customer</Button>
                </div>
              </Card>
            </PopoverContent>
          </Popover>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-primary-500 text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2 border-b">
                <h3 className="font-medium text-sm">Notifications</h3>
              </div>
              <div className="py-1">
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">New order received</p>
                    <p className="text-xs text-neutral-500">Table 5 has placed a new order</p>
                    <p className="text-xs text-neutral-400">2 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Kitchen update</p>
                    <p className="text-xs text-neutral-500">Order #1234 is ready for pickup</p>
                    <p className="text-xs text-neutral-400">5 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Inventory alert</p>
                    <p className="text-xs text-neutral-500">3 menu items are running low</p>
                    <p className="text-xs text-neutral-400">15 minutes ago</p>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Settings */}
          <Button 
            variant="outline" 
            size="icon"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Expanded mobile search */}
      <div className={`pb-3 ${isExpanded ? 'block' : 'hidden'} md:hidden`}>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input 
            type="text"
            placeholder="Search menu, tables, orders..."
            className="pl-8 h-9 rounded-full bg-neutral-50"
            value={searchQuery}
            onChange={handleSearchChange}
            autoFocus
          />
        </div>
      </div>
    </motion.header>
  );
};

export default POSHeader; 