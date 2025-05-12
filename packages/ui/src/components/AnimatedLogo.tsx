'use client';

import { useAnimation } from '@eatsome/ui/src/components/animations/AnimationProvider';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large';
}

export function AnimatedLogo({ size = 'medium' }: AnimatedLogoProps) {
  const { reducedMotion } = useAnimation();
  const logoRef = useRef<HTMLDivElement>(null);
  
  // Size mappings
  const sizes = {
    small: {
      container: "h-8 w-8",
      text: "text-lg ml-2.5",
    },
    medium: {
      container: "h-12 w-12",
      text: "text-2xl ml-3",
    },
    large: {
      container: "h-16 w-16",
      text: "text-3xl ml-4",
    },
  };
  
  // Advanced GSAP animation for the logo
  useEffect(() => {
    if (reducedMotion || !logoRef.current) return;
    
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
    
    timeline
      .from(logoRef.current.querySelector('.logo-circle'), {
        scale: 0.8,
        rotation: -10,
        opacity: 0,
        duration: 0.8,
      })
      .from(logoRef.current.querySelector('.logo-text'), {
        y: 15,
        opacity: 0,
        duration: 0.5,
      }, '-=0.4');
      
    return () => {
      timeline.kill();
    };
  }, [reducedMotion]);
  
  return (
    <div ref={logoRef} className="flex items-center">
      <div className={`relative flex items-center justify-center rounded-full bg-primary-500 ${sizes[size].container}`}>
        <div className="logo-circle absolute inset-0 rounded-full bg-primary-500 shadow-inner" />
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-1/2 h-1/2 text-neutral-900"
        >
          <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
          <line x1="6" y1="17" x2="18" y2="17" />
        </svg>
      </div>
      <motion.div 
        className={`logo-text font-bold ${sizes[size].text}`}
        initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
        animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span>Eat</span>
        <span className="text-primary-600">some</span>
      </motion.div>
    </div>
  );
} 