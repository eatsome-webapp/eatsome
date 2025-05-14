'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface PremiumToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: () => void;
  isVisible?: boolean;
  className?: string;
}

const variantIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const variantStyles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
};

const iconStyles = {
  success: "text-green-600",
  error: "text-red-600",
  info: "text-blue-600",
  warning: "text-amber-600",
};

export function PremiumToast({
  id,
  title,
  description,
  variant = 'info',
  duration = 5000,
  onClose,
  isVisible = true,
  className,
}: PremiumToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const Icon = variantIcons[variant];
  
  // Timer to auto-dismiss
  useEffect(() => {
    if (!isVisible || !duration) return;
    
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);
  
  // Progress bar animation
  useEffect(() => {
    if (!isVisible || !toastRef.current || !duration) return;
    
    const progressBar = toastRef.current.querySelector('.progress-bar');
    if (!progressBar) return;
    
    gsap.fromTo(
      progressBar,
      { width: '100%' },
      { 
        width: '0%',
        duration: duration / 1000,
        ease: 'linear',
      }
    );
  }, [isVisible, duration]);
  
  // Animation variants
  const toastVariants = {
    initial: { 
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    animate: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400, 
        damping: 25
      }
    },
    exit: { 
      opacity: 0,
      x: 100,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={toastRef}
          key={id}
          role="alert"
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            "relative overflow-hidden rounded-lg border shadow-lg max-w-sm w-full p-4",
            variantStyles[variant],
            className
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn("flex-shrink-0", iconStyles[variant])}>
              <Icon className="h-5 w-5" />
            </div>
            
            <div className="flex-grow min-w-0">
              <h3 className="font-medium text-sm">{title}</h3>
              {description && (
                <p className="text-xs mt-1 opacity-90">{description}</p>
              )}
            </div>
            
            <button 
              className="flex-shrink-0 rounded-full p-1 hover:bg-black/5 transition-colors"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Progress bar */}
          {duration > 0 && (
            <div className="absolute bottom-0 left-0 h-1 bg-black/10 w-full">
              <div className="progress-bar h-full bg-black/20" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast container component
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 items-end">
      {children}
    </div>
  );
} 