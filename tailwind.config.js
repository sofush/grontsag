/** @type {import('tailwindcss').Config} */
import containerQueryPlugin from '@tailwindcss/container-queries';

export default {
  content: [ "./dist/**/*.{html,js}" ],
  theme: {
    extend: {
      colors: {
        'green-dark': '#164A1C',
        'green-bright': '#DBE7D7',
        'gray-bright': '#FAFAF5',
        'gray-stroke': '#E6E6E6',
      },
      boxShadow: {
        'button': 'inset 0 4px 4px 0 rgb(0 0 0 / 0.25);',
        'brand': '0 4px 4px 0 rgb(0 0 0 / 0.25);',
      },
      fontFamily: {
        'sans-serif': [ 'Inter', 'sans-serif'],
        'serif': [ 'Newsreader', 'serif'],
      }
    },
  },
  plugins: [
    containerQueryPlugin,
  ],
}

