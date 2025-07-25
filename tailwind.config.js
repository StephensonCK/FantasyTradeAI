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
        'xs': ['0.875rem', { lineHeight: '1.25' }], /* 15.75px */
        'sm': ['1rem', { lineHeight: '1.5' }], /* 18px */
        'base': ['1.125rem', { lineHeight: '1.5' }], /* 20.25px */
        'lg': ['1.25rem', { lineHeight: '1.5' }], /* 22.5px */
        'xl': ['1.5rem', { lineHeight: '1.5' }], /* 27px */
        '2xl': ['1.75rem', { lineHeight: '1.4' }], /* 31.5px */
        '3xl': ['2rem', { lineHeight: '1.3' }], /* 36px */
        '4xl': ['2.25rem', { lineHeight: '1.2' }], /* 40.5px */
        '5xl': ['2.5rem', { lineHeight: '1.1' }], /* 45px */
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