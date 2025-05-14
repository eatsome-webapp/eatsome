'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ExpandableCardProps {
  className?: string;
  children: React.ReactNode;
  expanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
  expandedContent?: React.ReactNode;
  fullScreenOnMobile?: boolean;
  preserveCollapsedContent?: boolean;
}

export function ExpandableCard({
  className,
  children,
  expanded = false,
  onExpand,
  onCollapse,
  expandedContent,
  fullScreenOnMobile = true,
  preserveCollapsedContent = false,
}: ExpandableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardRect, setCardRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isExpanded, setIsExpanded] = useState(expanded);

  // Sync with external expanded state
  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  // Store card position before expanding
  useEffect(() => {
    if (cardRef.current && !isExpanded) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardRect({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      });
    }
  }, [isExpanded, children]);

  // Handle expand/collapse
  const handleToggle = () => {
    if (isExpanded) {
      setIsExpanded(false);
      onCollapse?.();
    } else {
      setIsExpanded(true);
      onExpand?.();
    }
  };

  // Animation variants
  const variants = {
    collapsed: {
      position: 'relative',
      width: '100%',
      height: 'auto',
      zIndex: 10,
    },
    expanded: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0, 
      zIndex: 50,
      width: '100%',
      height: '100%',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    exit: {
      position: 'relative',
      zIndex: 10,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  // Mobile specific variants
  const mobileVariants = {
    collapsed: variants.collapsed,
    expanded: {
      ...variants.expanded,
      // Mobile: 95% height for nearly fullscreen but with subtle edge visibility
      height: fullScreenOnMobile ? '95%' : '90%',
      width: fullScreenOnMobile ? '100%' : '95%',
      top: fullScreenOnMobile ? '0' : '2.5%',
      left: fullScreenOnMobile ? '0' : '2.5%',
      margin: '0 auto',
      borderRadius: '1rem',
    },
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "bg-white rounded-xl overflow-hidden shadow-card",
        isExpanded && "overflow-auto",
        className
      )}
      layout
      variants={window.innerWidth <= 768 ? mobileVariants : variants}
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      exit="exit"
      onClick={!isExpanded ? handleToggle : undefined}
    >
      {/* Semi-transparent overlay when expanded */}
      {isExpanded && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleToggle}
        />
      )}

      {/* Card content */}
      <div className={cn("relative h-full", isExpanded && "z-50")}>
        {/* Collapsed content */}
        {(!isExpanded || preserveCollapsedContent) && (
          <div className={cn(isExpanded && "hidden md:block")}>
            {children}
          </div>
        )}

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && expandedContent && (
            <motion.div
              className="flex flex-col h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {expandedContent}
              
              {/* Close button */}
              <button
                className="absolute top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
              >
                <X className="w-5 h-5 text-slate-700" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 