/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'tomorrow': ['Tomorrow', 'sans-serif'],
        'noto': ['Noto Sans', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25' }], /* 12px */
        'sm': ['0.875rem', { lineHeight: '1.5' }], /* 14px */
        'base': ['1rem', { lineHeight: '1.5' }], /* 16px */
        'lg': ['1.125rem', { lineHeight: '1.5' }], /* 18px */
        'xl': ['1.25rem', { lineHeight: '1.5' }], /* 20px */
        '2xl': ['1.5rem', { lineHeight: '1.4' }], /* 24px */
        '3xl': ['1.875rem', { lineHeight: '1.3' }], /* 30px */
        '4xl': ['2.25rem', { lineHeight: '1.2' }], /* 36px */
        '5xl': ['2.5rem', { lineHeight: '1.1' }], /* 40px */
      },
      colors: {
        primary: '#135bf9',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'], // Use standard light/dark themes
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: false,
    themeRoot: ':root',
  },
};