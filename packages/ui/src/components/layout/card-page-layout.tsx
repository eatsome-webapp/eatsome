import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { CardHeader } from './card-header';
import { LayeredCard } from '../ui/layered-card';

interface CardPageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  headerProps?: React.ComponentProps<typeof CardHeader>;
  asideContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export function CardPageLayout({
  children,
  title,
  description,
  className,
  headerProps,
  asideContent,
  footerContent,
}: CardPageLayoutProps) {
  // Animation variant for the page
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  // Animation variant for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <CardHeader {...headerProps} />
      
      {/* Main layout */}
      <motion.div 
        className="pt-20 pb-10 px-4 md:px-6 max-w-7xl mx-auto"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page title card */}
        {(title || description) && (
          <motion.div variants={cardVariants} className="mb-6">
            <LayeredCard depth="none" hover={false} className="bg-transparent">
              <div className="py-6">
                {title && <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{title}</h1>}
                {description && <p className="mt-2 text-slate-600">{description}</p>}
              </div>
            </LayeredCard>
          </motion.div>
        )}
        
        {/* Main content with optional sidebar */}
        <div className={cn(
          "grid gap-6",
          asideContent ? "lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {/* Main content area */}
          <motion.div 
            variants={cardVariants} 
            className={cn("space-y-6", asideContent && "lg:col-span-2 xl:col-span-3")}
          >
            {children}
          </motion.div>
          
          {/* Sidebar/aside content */}
          {asideContent && (
            <motion.div variants={cardVariants}>
              <LayeredCard className="sticky top-24">
                {asideContent}
              </LayeredCard>
            </motion.div>
          )}
        </div>
        
        {/* Footer content */}
        {footerContent && (
          <motion.div variants={cardVariants} className="mt-6">
            <LayeredCard>
              {footerContent}
            </LayeredCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 