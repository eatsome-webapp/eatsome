'use client';

import { motion } from 'framer-motion';
import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Settings } from 'lucide-react';

export default function ViewToggle() {
  const { view, setView } = useDashboard();
  
  return (
    <div className="bg-neutral-100 p-1 rounded-lg flex items-center">
      <button
        onClick={() => setView('front')}
        className={cn(
          "relative px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors",
          view === 'front' ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
        )}
        aria-pressed={view === 'front'}
      >
        <LayoutDashboard size={16} />
        <span>Operations</span>
        
        {view === 'front' && (
          <motion.div
            layoutId="view-indicator"
            className="absolute inset-0 bg-white rounded-md shadow-sm"
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30 
            }}
            style={{ zIndex: -1 }}
          />
        )}
      </button>
      
      <button
        onClick={() => setView('back')}
        className={cn(
          "relative px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors",
          view === 'back' ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
        )}
        aria-pressed={view === 'back'}
      >
        <Settings size={16} />
        <span>Management</span>
        
        {view === 'back' && (
          <motion.div
            layoutId="view-indicator"
            className="absolute inset-0 bg-white rounded-md shadow-sm"
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30 
            }}
            style={{ zIndex: -1 }}
          />
        )}
      </button>
    </div>
  );
} 