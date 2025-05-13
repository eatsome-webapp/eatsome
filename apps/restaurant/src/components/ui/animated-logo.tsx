'use client';

import React from 'react';
import { motion } from 'framer-motion';

type LogoSize = 'small' | 'medium' | 'large';

interface AnimatedLogoProps {
  size?: LogoSize;
}

export function AnimatedLogo({ size = 'medium' }: AnimatedLogoProps) {
  const logoSizes = {
    small: {
      width: 100,
      height: 30,
      fontSize: '1.2rem',
    },
    medium: {
      width: 140,
      height: 40,
      fontSize: '1.5rem',
    },
    large: {
      width: 180,
      height: 50,
      fontSize: '2rem',
    },
  };

  const dimensions = logoSizes[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ width: dimensions.width }}
    >
      <div className="flex items-center">
        <div className="text-primary-600 mr-2">
          {/* You can replace this with an SVG or other logo element */}
          <span style={{ fontSize: dimensions.fontSize }} className="font-bold">Eatsome</span>
        </div>
      </div>
    </motion.div>
  );
} 