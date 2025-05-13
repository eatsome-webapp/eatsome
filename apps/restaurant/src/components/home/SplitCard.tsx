'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useAnimation } from '@/components/animations/AnimationProvider';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SplitCardProps {
  children: ReactNode;
  className?: string;
}

export function SplitCard({ children, className }: SplitCardProps) {
  const { reducedMotion } = useAnimation();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };
  
  return (
    <motion.div
      initial={reducedMotion ? false : "hidden"}
      animate="visible"
      variants={containerVariants}
      className={cn("overflow-hidden rounded-2xl shadow-xl", className)}
    >
      <Card 
        variant="elevated" 
        elevation="xl" 
        padding="none" 
        radius="xl"
        className="grid grid-cols-1 md:grid-cols-2 w-full h-full overflow-hidden"
      >
        {children}
      </Card>
    </motion.div>
  );
} 