'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  height?: 'auto' | 'full' | 'half';
  showHandle?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  height = 'auto',
  showHandle = true,
  showCloseButton = true,
  className,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  
  // Transform y motion value to opacity for backdrop
  const backdropOpacity = useTransform(
    y, 
    [0, 300], 
    [0.5, 0]
  );
  
  // Reset y value when sheet opens
  useEffect(() => {
    if (isOpen) {
      y.set(0);
    }
  }, [isOpen, y]);
  
  // Handle height property
  const getHeightClass = () => {
    switch (height) {
      case 'full':
        return 'h-[calc(100vh-32px)]';
      case 'half':
        return 'h-[50vh]';
      case 'auto':
      default:
        return 'max-h-[calc(100vh-32px)]';
    }
  };
  
  // Sheet variants
  const sheetVariants = {
    hidden: { y: '100%' },
    visible: { 
      y: 0,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300
      }
    },
    exit: { 
      y: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };
  
  // Drag constraints and handlers
  const dragConstraints = { top: 0, bottom: 500 };
  
  const onDragEnd = (_, info) => {
    // Close sheet if dragged more than 20% of its height or velocity is high
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            style={{ opacity: backdropOpacity }}
            className="fixed inset-0 z-40 bg-black"
            onClick={onClose}
          />
          
          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-xl overflow-hidden",
              getHeightClass(),
              className
            )}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="y"
            dragElastic={0.1}
            dragConstraints={dragConstraints}
            onDragEnd={onDragEnd}
            style={{ y }}
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex justify-center p-2">
                <div className="w-12 h-1 bg-slate-200 rounded-full" />
              </div>
            )}
            
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                {title && (
                  <h3 className="font-medium text-slate-800">{title}</h3>
                )}
                {showCloseButton && (
                  <button
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="overflow-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 