'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, LayoutDashboard, ShoppingBag, 
  Users, Settings, LogOut, Calendar, PieChart
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

interface CardSidebarProps {
  items?: SidebarItem[];
  defaultExpanded?: boolean;
  className?: string;
  onLogout?: () => void;
}

export function CardSidebar({
  items = [],
  defaultExpanded = true,
  className,
  onLogout,
}: CardSidebarProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  // Default items if none provided
  const defaultItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/orders', badge: 5 },
    { icon: Calendar, label: 'Reservations', href: '/admin/reservations' },
    { icon: PieChart, label: 'Analytics', href: '/admin/analytics' },
    { icon: Users, label: 'Customers', href: '/admin/customers' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];
  
  const sidebarItems = items.length ? items : defaultItems;
  
  return (
    <motion.div
      className={cn(
        "h-full bg-white fixed left-0 top-0 bottom-0 z-30 shadow-card flex flex-col",
        className
      )}
      initial={{ width: expanded ? 240 : 72 }}
      animate={{ width: expanded ? 240 : 72 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="h-16 border-b border-slate-100 flex items-center px-4">
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-lg"
            >
              Food Platform
            </motion.div>
          ) : (
            <motion.div
              key="icon-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-lg"
            >
              FP
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Navigation */}
      <nav className="flex-grow py-4 px-2 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors",
              item.href === '/admin' && "bg-slate-100 text-secondary"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            
            {/* Badge */}
            {item.badge && expanded && (
              <span className="ml-auto bg-secondary text-white text-xs font-medium rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
            
            {/* Collapsed badge */}
            {item.badge && !expanded && (
              <span className="ml-auto bg-secondary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
      
      {/* Footer with toggle and logout */}
      <div className="p-2 border-t border-slate-100">
        <button 
          className="w-full flex items-center justify-center py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        
        {/* Logout button */}
        <button 
          className="w-full flex items-center justify-center py-2 px-3 mt-1 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
} 