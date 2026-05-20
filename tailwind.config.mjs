/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#101415',
          dim: '#101415',
          bright: '#363a3b',
          'container-lowest': '#0b0f10',
          'container-low': '#191c1e',
          container: '#1d2022',
          'container-high': '#272a2c',
          'container-highest': '#323537',
          tint: '#d2bbff'
        },
        'on-surface': {
          DEFAULT: '#e0e3e5',
          variant: '#ccc3d8'
        },
        'inverse-surface': '#e0e3e5',
        'inverse-on-surface': '#2d3133',
        outline: {
          DEFAULT: '#958da1',
          variant: '#4a4455'
        },
        primary: {
          DEFAULT: '#7c3aed',
          container: '#7c3aed',
          fixed: '#eaddff',
          'fixed-dim': '#d2bbff'
        },
        'on-primary': {
          DEFAULT: '#3f008e',
          container: '#ede0ff',
          fixed: '#25005a',
          'fixed-variant': '#5a00c6'
        },
        'inverse-primary': '#732ee4',
        secondary: {
          DEFAULT: '#ddb7ff',
          container: '#6f00be',
          fixed: '#f0dbff',
          'fixed-dim': '#ddb7ff'
        },
        'on-secondary': {
          DEFAULT: '#490080',
          container: '#d6a9ff',
          fixed: '#2c0051',
          'fixed-variant': '#6900b3'
        },
        tertiary: {
          DEFAULT: '#ffb4ab',
          container: '#cb161c',
          fixed: '#ffdad6',
          'fixed-dim': '#ffb4ab'
        },
        'on-tertiary': {
          DEFAULT: '#690005',
          container: '#ffdeda',
          fixed: '#410002',
          'fixed-variant': '#93000b'
        },
        error: {
          DEFAULT: '#DC2626',
          container: '#93000a'
        },
        'on-error': {
          DEFAULT: '#690005',
          container: '#ffdad6'
        },
        background: {
          DEFAULT: '#05060A'
        },
        'on-background': {
          DEFAULT: '#e0e3e5'
        },
        'surface-variant': {
          DEFAULT: '#323537'
        },
        success: {
          DEFAULT: '#10B981'
        },
        text: {
          heading: '#e0e3e5',
          body: '#ccc3d8',
          muted: '#958da1',
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
