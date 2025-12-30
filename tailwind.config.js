/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  // Class-based dark mode (toggle via JS)
  darkMode: 'class',
  
  theme: {
    extend: {
      // ─────────────────────────────────────────────────────────
      // FONTS — Apple System Stack
      // ─────────────────────────────────────────────────────────
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },

      // ─────────────────────────────────────────────────────────
      // COLORS — Extended Palette
      // ─────────────────────────────────────────────────────────
      colors: {
        // Custom accent colors
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },

      // ─────────────────────────────────────────────────────────
      // ANIMATIONS
      // ─────────────────────────────────────────────────────────
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.3s ease-out',
        'fade-in-down': 'fade-in-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-in-up': 'slide-in-up 0.3s ease-out',
        'slide-in-down': 'slide-in-down 0.3s ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      // ─────────────────────────────────────────────────────────
      // SHADOWS — Apple-inspired layered shadows
      // ─────────────────────────────────────────────────────────
      boxShadow: {
        'apple-sm': '0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)',
        'apple': '0 2px 4px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.04)',
        'apple-md': '0 4px 6px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0, 0, 0, 0.08), 0 16px 32px rgba(0, 0, 0, 0.04)',
        'apple-lg': '0 8px 16px rgba(0, 0, 0, 0.06), 0 16px 32px rgba(0, 0, 0, 0.1), 0 32px 64px rgba(0, 0, 0, 0.06)',
        'apple-xl': '0 16px 32px rgba(0, 0, 0, 0.08), 0 32px 64px rgba(0, 0, 0, 0.12), 0 64px 128px rgba(0, 0, 0, 0.08)',
        'glow-indigo': '0 4px 16px rgba(99, 102, 241, 0.25), 0 8px 32px rgba(99, 102, 241, 0.15)',
        'glow-purple': '0 4px 16px rgba(168, 85, 247, 0.25), 0 8px 32px rgba(168, 85, 247, 0.15)',
        'glow-emerald': '0 4px 16px rgba(16, 185, 129, 0.25), 0 8px 32px rgba(16, 185, 129, 0.15)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },

      // ─────────────────────────────────────────────────────────
      // BACKDROP BLUR
      // ─────────────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },

      // ─────────────────────────────────────────────────────────
      // BORDER RADIUS
      // ─────────────────────────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // ─────────────────────────────────────────────────────────
      // SPACING
      // ─────────────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      // ─────────────────────────────────────────────────────────
      // TRANSITIONS
      // ─────────────────────────────────────────────────────────
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },

      // ─────────────────────────────────────────────────────────
      // Z-INDEX
      // ─────────────────────────────────────────────────────────
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // ─────────────────────────────────────────────────────────
      // BACKGROUND IMAGE — Gradients
      // ─────────────────────────────────────────────────────────
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)',
      },

      // ─────────────────────────────────────────────────────────
      // BACKGROUND SIZE — For shimmer effect
      // ─────────────────────────────────────────────────────────
      backgroundSize: {
        'shimmer': '200% 100%',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────
  // PLUGINS
  // ─────────────────────────────────────────────────────────────
  plugins: [
    // Add container queries support if needed
    // require('@tailwindcss/container-queries'),
    
    // Custom plugin for glass morphism
    function({ addUtilities }) {
      addUtilities({
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.7)',
          'backdrop-filter': 'blur(20px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(20px) saturate(180%)',
        },
        '.glass-dark': {
          'background': 'rgba(30, 41, 59, 0.7)',
          'backdrop-filter': 'blur(20px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(20px) saturate(180%)',
        },
        '.text-shadow': {
          'text-shadow': '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-md': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
      })
    },
  ],
}