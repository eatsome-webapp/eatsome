'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, ShoppingBag, User, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CardHeaderProps {
  logo?: React.ReactNode;
  showSearch?: boolean;
  showCart?: boolean;
  showProfile?: boolean;
  itemCount?: number;
  onMenuClick?: () => void;
  onCartClick?: () => void;
  onProfileClick?: () => void;
  className?: string;
}

export function CardHeader({
  logo,
  showSearch = true,
  showCart = true,
  showProfile = true,
  itemCount = 0,
  onMenuClick,
  onCartClick,
  onProfileClick,
  className,
}: CardHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Animation values based on scroll
  const headerBackground = useTransform(
    scrollY, 
    [0, 50], 
    ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.95)']
  );
  
  const headerShadow = useTransform(
    scrollY, 
    [0, 50], 
    ['0 1px 2px rgba(0,0,0,0.05)', '0 4px 20px rgba(0,0,0,0.08)']
  );
  
  const headerHeight = useTransform(
    scrollY, 
    [0, 50], 
    ['80px', '64px']
  );
  
  return (
    <motion.header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-md",
        className
      )}
      style={{
        backgroundColor: headerBackground,
        boxShadow: headerShadow,
        height: headerHeight,
      }}
    >
      <div className="h-full container mx-auto px-4 flex items-center justify-between">
        {/* Left section - Menu (mobile) and Logo */}
        <div className="flex items-center">
          <button 
            className="md:hidden p-2 mr-2 rounded-full hover:bg-slate-100"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </button>
          
          {/* Logo */}
          <Link href="/" className="font-semibold text-xl">
            {logo || "Food Platform"}
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-slate-700 hover:text-secondary font-medium">
            Home
          </Link>
          <Link href="/restaurants" className="text-slate-700 hover:text-secondary font-medium">
            Restaurants
          </Link>
          <Link href="/foodtrucks" className="text-slate-700 hover:text-secondary font-medium">
            Foodtrucks
          </Link>
          <Link href="/orders" className="text-slate-700 hover:text-secondary font-medium">
            My Orders
          </Link>
        </nav>
        
        {/* Right section - Actions */}
        <div className="flex items-center space-x-1">
          {/* Search button */}
          {showSearch && (
            <button className="p-2 rounded-full hover:bg-slate-100">
              <Search className="w-5 h-5 text-slate-700" />
            </button>
          )}
          
          {/* Cart button */}
          {showCart && (
            <button 
              className="p-2 rounded-full hover:bg-slate-100 relative"
              onClick={onCartClick}
            >
              <ShoppingBag className="w-5 h-5 text-slate-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          )}
          
          {/* Profile button */}
          {showProfile && (
            <button 
              className="p-2 rounded-full hover:bg-slate-100"
              onClick={onProfileClick}
            >
              <User className="w-5 h-5 text-slate-700" />
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
} 