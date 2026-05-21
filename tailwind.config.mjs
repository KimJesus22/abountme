/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0A0C14',
          dim: '#080A12',
          bright: '#161924',
          container: '#111420',
        },
        primary: {
          DEFAULT: '#7c3aed',
          container: '#4c1d95',
        },
        secondary: {
          DEFAULT: '#c084fc',
          container: '#581c87',
        },
        background: {
          DEFAULT: '#05060A'
        },
        success: {
          DEFAULT: '#10B981'
        },
        error: {
          DEFAULT: '#DC2626'
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)'
        },
        text: {
          heading: '#f8fafc',
          body: '#cbd5e1',
          muted: '#94a3b8',
          light: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        display: ['Geist', 'system-ui', 'sans-serif'],
      },
      spacing: {
        unit: '8px',
        'container-max': '1280px',
        gutter: '24px',
        'margin-mobile': '16px',
        'margin-desktop': '40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
