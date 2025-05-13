// UI package index file
export * from './components'; 

// Import the CSS styles so they can be imported in other applications
import './styles/index.css';

// Re-export any UI components here in the future
// export { Button } from './components/Button';
// export { Card } from './components/Card';

// Export CSS utility functions (if you create any)
export function cn(...inputs: any[]) {
  // This is a placeholder for a potential utility function
  // You might want to implement a function like the one in apps/restaurant/src/lib/utils.ts
  return inputs.filter(Boolean).join(' ');
}

// Export helpers for the design system
export const theme = {
  colors: {
    primary: 'var(--primary-500)',
    primaryLight: 'var(--primary-300)',
    primaryDark: 'var(--primary-700)',
    
    yellowSignature: 'var(--yellow-signature)',
    yellowSoft: 'var(--yellow-soft)',
    yellowWarm: 'var(--yellow-warm)',
    yellowPale: 'var(--yellow-pale)',
    
    whitePure: 'var(--white-pure)',
    whiteOff: 'var(--white-off)',
    whiteIvory: 'var(--white-ivory)',
    whiteCream: 'var(--white-cream)',
    
    blackTrue: 'var(--black-true)',
    blackSoft: 'var(--black-soft)',
    grayDark: 'var(--gray-dark)',
    grayMedium: 'var(--gray-medium)',
    
    success: 'var(--success)',
    error: 'var(--error)',
    warning: 'var(--warning)',
    info: 'var(--info)',
  },
  
  spacing: {
    cardPadding: 'var(--card-padding)',
    sectionPadding: 'var(--section-padding)',
    headerHeight: 'var(--header-height)',
    footerPadding: 'var(--footer-padding)',
  },
  
  borderRadius: {
    card: 'var(--card-border-radius)',
    input: 'var(--input-border-radius)',
    tag: 'var(--tag-border-radius)',
  },
  
  shadow: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
  },
  
  alpha: {
    5: 'var(--alpha-5)',
    10: 'var(--alpha-10)',
    15: 'var(--alpha-15)',
    20: 'var(--alpha-20)',
    25: 'var(--alpha-25)',
    30: 'var(--alpha-30)',
    40: 'var(--alpha-40)',
    50: 'var(--alpha-50)',
    60: 'var(--alpha-60)',
    70: 'var(--alpha-70)',
    80: 'var(--alpha-80)',
    90: 'var(--alpha-90)',
    95: 'var(--alpha-95)',
  },
} 