'use client';

import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Header from './Header';
import { useDashboard } from '@/context/DashboardContext';

interface DashboardContainerProps {
  children: ReactNode;
}

export default function DashboardContainer({ children }: DashboardContainerProps) {
  const { view, sidebarExpanded } = useDashboard();

  // Define transitions to match sidebar
  const contentTransition = { 
    duration: 0.3, 
    ease: [0.4, 0, 0.2, 1] 
  };

  // Handle escape key to exit temporary role mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Handle escape key press for any temporary states
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <motion.div 
        className="flex-1 flex flex-col"
        animate={{ 
          marginLeft: sidebarExpanded ? 256 : 80
        }}
        transition={contentTransition}
      >
        {/* Header */}
        <Header />
        
        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.main
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-4 md:p-6 pt-20 md:pt-24 overflow-auto"
          >
            <div className="h-full rounded-2xl bg-white p-6 shadow-sm border border-neutral-100">
              {children}
            </div>
          </motion.main>
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 