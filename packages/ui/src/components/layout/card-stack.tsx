import React, { useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { gsap } from 'gsap';

interface CardStackProps {
  className?: string;
  children: React.ReactNode;
  staggered?: boolean;
  maxCards?: number;
}

export function CardStack({
  className,
  children,
  staggered = true,
  maxCards = 3,
}: CardStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  
  // Animation for the stacked cards
  useEffect(() => {
    if (!stackRef.current) return;
    
    const cards = stackRef.current.children;
    const tl = gsap.timeline();
    
    // Reset initial positions
    gsap.set(cards, { clearProps: "all" });
    
    // Animate each card in the stack
    for (let i = 0; i < Math.min(cards.length, maxCards); i++) {
      const card = cards[i];
      
      // Different animations based on position in stack
      if (i === 0) {
        // Top card
        tl.fromTo(
          card,
          { y: 30, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" },
          i * 0.1
        );
      } else {
        // Underlying cards
        const offset = i * 10;
        const rotation = i % 2 === 0 ? -2 : 2;
        
        tl.fromTo(
          card,
          { 
            y: 30 + offset, 
            opacity: 0, 
            scale: 0.9 - (i * 0.03),
            rotation: 0
          },
          { 
            y: offset, 
            opacity: 0.8 - (i * 0.2), 
            scale: 1 - (i * 0.03),
            rotation: rotation,
            duration: 0.6, 
            ease: "power3.out" 
          },
          i * 0.1
        );
      }
    }
    
    return () => {
      tl.kill();
    };
  }, [children, maxCards]);
  
  // Limit number of cards and apply positioning
  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      if (index >= maxCards) return null;
      
      // Add positioning class based on index
      return React.cloneElement(child as React.ReactElement, {
        className: cn(
          (child as React.ReactElement).props.className,
          "absolute left-0 right-0 transition-all duration-300",
          index === 0 && "z-30 relative", // Top card is relative, others absolute
          index === 1 && "z-20 top-2.5", // Second card
          index === 2 && "z-10 top-5",   // Third card
        ),
      });
    });
  };
  
  return (
    <div
      ref={stackRef}
      className={cn("relative", className)}
    >
      {renderChildren()}
    </div>
  );
} 