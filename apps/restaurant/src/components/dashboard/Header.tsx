'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '@/context/DashboardContext';
import ViewToggle from './ViewToggle';
import RoleToggle from './RoleToggle';
import { cn } from '@/lib/utils';
import { Search, Bell, Menu as MenuIcon } from 'lucide-react';

export default function Header() {
  const { view, sidebarExpanded, toggleSidebar, currentRole, temporaryRole } = useDashboard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Determine if the user is in owner mode
  const isOwnerMode = (temporaryRole || currentRole) === 'owner';
  
  // Section titles based on view
  const viewTitle = view === 'front' ? 'Restaurant Operations' : 'Restaurant Management';

  return (
    <header className="fixed top-0 right-0 z-10 ml-0 transition-all duration-300 ease-in-out"
      style={{ 
        width: `calc(100% - ${sidebarExpanded ? '16rem' : '5rem'})`,
        marginLeft: sidebarExpanded ? '16rem' : '5rem'
      }}
    >
      <div className="h-16 px-4 md:px-6 mx-4 md:mx-6 mt-4 bg-white border border-neutral-200 shadow-sm rounded-xl flex items-center justify-between">
        {/* Left Side: Title and Mobile Menu Toggle */}
        <div className="flex items-center">
          <button
            className="md:hidden mr-3 p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle mobile menu"
          >
            <MenuIcon size={20} />
          </button>
          
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">{viewTitle}</h1>
            <p className="text-sm text-neutral-500">
              {view === 'front' ? 'Daily operations dashboard' : 'Admin management console'}
            </p>
          </div>
        </div>
        
        {/* Right Side: Actions */}
        <div className="flex items-center space-x-1 md:space-x-3">
          {/* Search */}
          <button
            className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          
          {/* Notifications */}
          <button
            className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary-500"></span>
          </button>
          
          {/* Role Toggle (Only visible for owners) */}
          {isOwnerMode && (
            <div className="hidden md:block">
              <RoleToggle />
            </div>
          )}
          
          {/* View Toggle */}
          <div className="hidden md:block">
            <ViewToggle />
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 bg-white rounded-xl border border-neutral-200 shadow-md p-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-medium">Dashboard Controls</h3>
              </div>
              
              {isOwnerMode && (
                <div className="py-2">
                  <p className="text-sm text-neutral-500 mb-2">Role Mode</p>
                  <RoleToggle />
                </div>
              )}
              
              <div className="py-2">
                <p className="text-sm text-neutral-500 mb-2">Dashboard View</p>
                <ViewToggle />
              </div>
              
              <div className="pt-2 border-t border-neutral-100">
                <button
                  className="w-full py-2 text-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg text-sm"
                  onClick={() => toggleSidebar()}
                >
                  {sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 