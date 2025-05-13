'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import { Shield, ShieldOff, ChevronDown } from 'lucide-react';

export default function RoleToggle() {
  const { currentRole, temporaryRole, setTemporaryRole } = useDashboard();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Determine if user is in owner mode
  const isOwnerMode = !temporaryRole;
  
  const toggleOwnerMode = () => {
    setTemporaryRole(isOwnerMode ? 'staff' : null);
    setMenuOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={cn(
          "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors text-sm font-medium",
          isOwnerMode 
            ? "bg-primary-100 text-primary-700 hover:bg-primary-200" 
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        )}
        aria-expanded={menuOpen}
      >
        {isOwnerMode ? (
          <>
            <Shield size={16} className="text-primary-700" />
            <span>Owner Mode</span>
          </>
        ) : (
          <>
            <ShieldOff size={16} className="text-neutral-600" />
            <span>Staff Mode</span>
          </>
        )}
        <ChevronDown size={14} className={cn(
          "transition-transform",
          menuOpen && "transform rotate-180"
        )} />
      </button>
      
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-40"
            >
              <div className="py-1">
                <button
                  onClick={toggleOwnerMode}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                >
                  {isOwnerMode ? (
                    <>
                      <ShieldOff size={16} className="text-neutral-600" />
                      <span>Switch to Staff Mode</span>
                    </>
                  ) : (
                    <>
                      <Shield size={16} className="text-primary-700" />
                      <span>Switch to Owner Mode</span>
                    </>
                  )}
                </button>
                
                <div className="border-t border-neutral-200 my-1"></div>
                
                <div className="px-4 py-2 text-xs text-neutral-500">
                  {isOwnerMode ? 
                    "You have full access to all features" : 
                    "Limited access to operational features only"}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 