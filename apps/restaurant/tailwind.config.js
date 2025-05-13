/** @type {import('tailwindcss').Config} */
import sharedConfig from '../../packages/ui/tailwind.config.js';

export default {
  // Use the shared content paths plus app-specific paths
  content: [
    ...sharedConfig.content,
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  
  // Extend the shared theme
  theme: {
    ...sharedConfig.theme,
    extend: {
      ...sharedConfig.theme.extend,
      // Add any restaurant app specific theme overrides here
    },
  },
  
  // Use the shared plugins plus app-specific plugins
  plugins: [
    ...sharedConfig.plugins,
    // Add any restaurant app specific plugins here
  ],
  
  // Use the same dark mode setting
  darkMode: sharedConfig.darkMode,
} 