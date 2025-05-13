/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../apps/**/src/**/*.{js,jsx,ts,tsx}',
    '../../packages/**/src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Primary font (70% usage)
        'primary': ['var(--font-primary)'],
        'sans': ['var(--font-primary)'],
        // Secondary font (30% usage)
        'secondary': ['var(--font-secondary)'],
        // For compatibility with potential existing code
        'poppins': ['var(--font-primary)'],
        'montserrat': ['var(--font-secondary)'],
      },
      colors: {
        // Primary (Yellow-based) colors
        primary: {
          50: 'hsl(var(--primary-50) / <alpha-value>)',
          100: 'hsl(var(--primary-100) / <alpha-value>)',
          200: 'hsl(var(--primary-200) / <alpha-value>)',
          300: 'hsl(var(--primary-300) / <alpha-value>)',
          400: 'hsl(var(--primary-400) / <alpha-value>)',
          500: 'hsl(var(--primary-500) / <alpha-value>)',
          600: 'hsl(var(--primary-600) / <alpha-value>)',
          700: 'hsl(var(--primary-700) / <alpha-value>)',
          800: 'hsl(var(--primary-800) / <alpha-value>)',
          900: 'hsl(var(--primary-900) / <alpha-value>)',
          950: 'hsl(var(--primary-950) / <alpha-value>)',
        },
        
        // Yellow Variations
        'yellow-signature': 'hsl(var(--yellow-signature) / <alpha-value>)',
        'yellow-soft': 'hsl(var(--yellow-soft) / <alpha-value>)',
        'yellow-warm': 'hsl(var(--yellow-warm) / <alpha-value>)',
        'yellow-pale': 'hsl(var(--yellow-pale) / <alpha-value>)',
        
        // Yellow Scale
        'yellow': {
          50: 'hsl(var(--yellow-50) / <alpha-value>)',
          100: 'hsl(var(--yellow-100) / <alpha-value>)',
          200: 'hsl(var(--yellow-200) / <alpha-value>)',
          300: 'hsl(var(--yellow-300) / <alpha-value>)',
          400: 'hsl(var(--yellow-400) / <alpha-value>)',
          500: 'hsl(var(--yellow-500) / <alpha-value>)',
          600: 'hsl(var(--yellow-600) / <alpha-value>)',
          700: 'hsl(var(--yellow-700) / <alpha-value>)',
          800: 'hsl(var(--yellow-800) / <alpha-value>)',
          900: 'hsl(var(--yellow-900) / <alpha-value>)',
          950: 'hsl(var(--yellow-950) / <alpha-value>)',
        },
        
        // White Variations
        'white-pure': 'hsl(var(--white-pure) / <alpha-value>)',
        'white-off': 'hsl(var(--white-off) / <alpha-value>)',
        'white-ivory': 'hsl(var(--white-ivory) / <alpha-value>)',
        'white-cream': 'hsl(var(--white-cream) / <alpha-value>)',
        
        // Black/Dark Variations
        'black-true': 'hsl(var(--black-true) / <alpha-value>)',
        'black-soft': 'hsl(var(--black-soft) / <alpha-value>)',
        'gray-dark': 'hsl(var(--gray-dark) / <alpha-value>)',
        'gray-medium': 'hsl(var(--gray-medium) / <alpha-value>)',
        
        // Neutral Scale
        'neutral': {
          50: 'hsl(var(--neutral-50) / <alpha-value>)',
          100: 'hsl(var(--neutral-100) / <alpha-value>)',
          200: 'hsl(var(--neutral-200) / <alpha-value>)',
          300: 'hsl(var(--neutral-300) / <alpha-value>)',
          400: 'hsl(var(--neutral-400) / <alpha-value>)',
          500: 'hsl(var(--neutral-500) / <alpha-value>)',
          600: 'hsl(var(--neutral-600) / <alpha-value>)',
          700: 'hsl(var(--neutral-700) / <alpha-value>)',
          800: 'hsl(var(--neutral-800) / <alpha-value>)',
          900: 'hsl(var(--neutral-900) / <alpha-value>)',
          950: 'hsl(var(--neutral-950) / <alpha-value>)',
          1000: 'hsl(var(--neutral-1000) / <alpha-value>)',
        },
        
        // Semantic Colors
        'success': 'hsl(var(--success) / <alpha-value>)',
        'error': 'hsl(var(--error) / <alpha-value>)',
        'warning': 'hsl(var(--warning) / <alpha-value>)',
        'info': 'hsl(var(--info) / <alpha-value>)',
      },
      
      // Shadow configuration
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      
      // Border radius
      borderRadius: {
        'card': 'var(--card-border-radius)',
        'input': 'var(--input-border-radius)',
        'tag': 'var(--tag-border-radius)',
      },
      
      // Max width
      maxWidth: {
        'content': 'var(--content-max-width)',
      },
      
      // Font weight extended
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      
      // Spacing for food platform
      spacing: {
        'card-padding': 'var(--card-padding)',
        'section-padding': 'var(--section-padding)',
        'header-height': 'var(--header-height)',
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        // Restaurant Card Component
        '.restaurant-card': {
          '@apply rounded-card bg-white-pure shadow-md': {},
          '.restaurant-image': {
            '@apply w-full h-[200px] bg-neutral-300 rounded-t-card overflow-hidden': {},
            'img': {
              '@apply w-full h-full object-cover': {},
            }
          },
          '.restaurant-content': {
            '@apply p-card-padding': {},
          },
          '.restaurant-header': {
            '@apply flex justify-between items-center mb-4': {},
            '.restaurant-name': {
              '@apply text-xl font-bold text-black-true m-0': {},
            },
            '.restaurant-rating': {
              '@apply inline-flex items-center px-2 py-1 rounded-tag bg-yellow-100 text-yellow-800 text-sm font-medium': {},
            }
          },
          '.restaurant-tags': {
            '@apply flex mb-4 gap-3': {},
            '.restaurant-tag': {
              '@apply inline-flex items-center px-2 py-1 rounded-tag bg-yellow-100 text-yellow-800 text-sm font-medium': {},
            }
          },
          '.restaurant-description': {
            '@apply text-gray-medium mb-6 leading-relaxed text-sm': {},
          },
          '.restaurant-action': {
            '@apply inline-flex justify-center w-full px-4 py-2 rounded-input bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors': {},
          }
        },
        
        // Food Category Card Component
        '.category-card': {
          '@apply rounded-card bg-white-pure shadow-md hover:shadow-lg transition-all cursor-pointer': {},
          '.category-image': {
            '@apply w-full h-[180px] bg-neutral-300 rounded-t-card overflow-hidden relative': {},
            'img': {
              '@apply w-full h-full object-cover': {},
            },
            '.category-badge': {
              '@apply absolute top-4 right-4 inline-flex items-center px-2 py-1 rounded-tag bg-primary-100 text-primary-800 text-sm font-medium': {},
            }
          },
          '.category-content': {
            '@apply p-card-padding': {},
          },
          '.category-title': {
            '@apply text-lg font-bold text-black-true mb-2': {},
          },
          '.category-description': {
            '@apply text-gray-medium mb-6 leading-relaxed text-sm': {},
          },
          '.category-footer': {
            '@apply flex items-center justify-between': {},
            '.category-count': {
              '@apply text-gray-dark text-sm font-medium': {},
            },
            '.category-link': {
              '@apply text-black-true font-semibold text-sm flex items-center': {},
            }
          }
        },
        
        // Navigation Component
        '.main-nav': {
          '@apply bg-white-pure shadow-sm py-4 px-8 sticky top-0 z-10': {},
          '.nav-container': {
            '@apply max-w-content mx-auto flex justify-between items-center': {},
          },
          '.nav-logo': {
            '@apply flex items-center': {},
            '.logo-mark': {
              '@apply bg-yellow-signature w-10 h-10 rounded-lg flex items-center justify-center mr-3 font-black text-black-true text-xl': {},
            },
            '.logo-text': {
              '@apply font-extrabold text-2xl text-black-true m-0': {},
            }
          },
          '.nav-menu': {
            '@apply flex gap-8 items-center': {},
          },
          '.nav-link': {
            '@apply text-gray-dark no-underline font-semibold hover:text-black-true transition-colors': {},
          },
          '.nav-button': {
            '@apply inline-flex items-center px-4 py-2 rounded-input bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors': {},
          }
        },
        
        // Hero Section Component
        '.hero-section': {
          '@apply py-20 px-8 bg-gradient-to-br from-yellow-50 to-yellow-100': {},
          '.hero-container': {
            '@apply max-w-content mx-auto flex flex-col items-center text-center': {},
          },
          '.hero-title': {
            '@apply text-5xl font-black text-black-true mb-6 max-w-3xl leading-tight': {},
          },
          '.hero-description': {
            '@apply text-xl text-black-soft max-w-2xl mb-10 leading-relaxed': {},
          },
          '.hero-buttons': {
            '@apply flex gap-4': {},
          },
          '.hero-button-primary': {
            '@apply inline-flex items-center px-6 py-3 text-lg rounded-input bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors': {},
          },
          '.hero-button-secondary': {
            '@apply inline-flex items-center px-6 py-3 text-lg rounded-input bg-white-pure text-black-true font-medium border border-neutral-200 hover:bg-neutral-50 transition-colors': {},
          }
        },
        
        // Section Header Component
        '.section-header': {
          '@apply mb-12': {},
          '.section-title': {
            '@apply text-3xl font-extrabold text-black-true mb-2': {},
          },
          '.section-description': {
            '@apply text-lg text-gray-medium': {},
          }
        },
        
        // Form controls
        '.btn-primary': {
          '@apply inline-flex items-center justify-center px-4 py-2 rounded-input bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors': {},
        },
        '.btn-secondary': {
          '@apply inline-flex items-center justify-center px-4 py-2 rounded-input bg-white-pure text-black-true font-medium border border-neutral-200 hover:bg-neutral-50 transition-colors': {},
        },
        '.input-control': {
          '@apply w-full px-4 py-2 border border-neutral-300 rounded-input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors': {},
        },
      })
    }
  ],
} 