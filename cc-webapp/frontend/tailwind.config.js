/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background Colors
        bg: {
          primary: '#1A1A1A',
          secondary: '#242424',
          tertiary: '#2E2E2E',
          input: '#2A2A2A',
        },
        // Pink Gradient System
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          primary: '#FF4B8C',
          light: '#FF6B9D',
          dark: '#C44569',
        },
        // Text Colors
        text: {
          primary: '#FFFFFF',
          secondary: '#B0B0B0',
          muted: '#808080',
          disabled: '#4A4A4A',
        },
        // Accent Colors
        orange: '#FF8C42',
        yellow: '#FFD93D',
        blue: '#4ECDC4',
        purple: '#9B59B6',
        // Status Colors
        success: '#2ECC71',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB',
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
        'gradient-pink-vertical': 'linear-gradient(to bottom, #FF6B9D 0%, #C44569 100%)',
        'gradient-orange': 'linear-gradient(135deg, #FF8C42 0%, #FF6B42 100%)',
        'gradient-blue': 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
        'gradient-purple': 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      spacing: {
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '8': '64px',
        '10': '80px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.4)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.5)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.6)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.7)',
        'pink-glow': '0 0 20px rgba(255, 75, 140, 0.5)',
        'pink-glow-lg': '0 0 40px rgba(255, 75, 140, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pink-pulse': 'pinkPulse 2s ease-in-out infinite',
        'pink-glow': 'pinkGlow 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pinkPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 75, 140, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 75, 140, 0.8)' },
        },
        pinkGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(255, 75, 140, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(255, 75, 140, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
        '500': '500ms',
      },
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
    },
  },
  plugins: [],
}
