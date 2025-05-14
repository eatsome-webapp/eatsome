import { gsap } from 'gsap';

// Register optional plugins
if (typeof window !== 'undefined') {
  // Add any required GSAP plugins here
}

/**
 * Card slide-in animation for mobile
 */
export const slideInCardFromBottom = (element: HTMLElement, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { 
      y: '100%',
      opacity: 1
    },
    { 
      y: '0%', 
      opacity: 1, 
      duration: 0.4, 
      delay, 
      ease: "power1.out" 
    }
  );
};

/**
 * Card slide-out animation for mobile
 */
export const slideOutCardToBottom = (element: HTMLElement) => {
  return gsap.to(
    element,
    { 
      y: '100%', 
      opacity: 1, 
      duration: 0.3, 
      ease: "power1.in" 
    }
  );
};

/**
 * Card stack animation with offset
 */
export const animateCardStack = (cards: HTMLElement[], offset: number = 8) => {
  const tl = gsap.timeline();
  
  cards.forEach((card, index) => {
    const yOffset = index * offset;
    const opacity = index === 0 ? 1 : Math.max(0.7 - (index * 0.15), 0.3);
    const scale = index === 0 ? 1 : Math.max(1 - (index * 0.05), 0.85);
    const rotation = index % 2 === 0 ? index * -1 : index * 1;
    
    tl.fromTo(
      card,
      { 
        y: 50, 
        opacity: 0, 
        scale: 0.9,
        rotation: 0,
        zIndex: cards.length - index
      },
      { 
        y: yOffset, 
        opacity, 
        scale,
        rotation,
        zIndex: cards.length - index,
        duration: 0.5, 
        ease: "back.out(1.2)" 
      },
      index * 0.08
    );
  });
  
  return tl;
};

/**
 * Staggered entrance for grid items
 */
export const animateGridItems = (items: HTMLElement[], staggerAmount: number = 0.05) => {
  return gsap.fromTo(
    items,
    { 
      y: 30, 
      opacity: 0,
      scale: 0.95
    },
    { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      stagger: staggerAmount,
      duration: 0.4, 
      ease: "power2.out" 
    }
  );
};

/**
 * Pulse animation for highlighting
 */
export const pulseAnimation = (element: HTMLElement, color: string = 'rgba(56, 189, 248, 0.3)', repeat: number = 3) => {
  return gsap.to(
    element,
    {
      boxShadow: `0 0 0 6px ${color}`,
      duration: 0.5,
      repeat,
      yoyo: true,
      ease: "sine.inOut"
    }
  );
};

/**
 * Subtle hover animation
 */
export const subtleHoverAnimation = (element: HTMLElement) => {
  const tl = gsap.timeline({ paused: true });
  
  tl.to(element, {
    y: -5,
    duration: 0.2,
    ease: "power1.out",
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
  });
  
  return tl;
}; 