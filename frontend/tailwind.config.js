/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['light'],
  },
  plugins: [
    daisyui,
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarwidth: 'thin',
          scrollbarcolor: 'rgb(31, 29, 29) white',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(31, 41, 55)',
            borderRadius: '20px',
          },
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
