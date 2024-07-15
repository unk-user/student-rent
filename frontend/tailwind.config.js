/** @type {import('tailwindcss').Config} */
import withMT from '@material-tailwind/react/utils/withMT';

export default withMT({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      xs: '0.825rem',
      sm: '0.9rem',
      base: '1rem',
      lg: '1.2rem',
      xl: '1.44rem',
      '2xl': '1.728rem',
      '3xl': '2.074rem',
    },
    colors: {
      black: '#000000',
      white: '#ffffff',
      blue: {
        50: '#E0EBED',
        100: '#B0CBFF',
        200: '#9FC0FF',
        300: '#006FF2',
      },
      gray: {
        50: '#f2f2f2',
        100: '#f8f9fa',
        200: '#e9ecef',
        300: '#dee2e6',
        400: '#ced4da',
        500: '#adb5bd',
        600: '#6c757d',
        700: '#495057',
        800: '#343a40',
        900: '#212529',
      },
      'dark-blue': '#1A2839',
    },
    extend: {
      screens: {
        'max-xl': { max: '1400px' },
        'max-lg': { max: '1200px' },
        'max-md': { max: '992px' },
        'max-sm': { max: '668px' },
        'max-xs': { max: '576px' },
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
});
