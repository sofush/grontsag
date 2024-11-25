/** @type {import('tailwindcss').Config} */
import containerQueryPlugin from '@tailwindcss/container-queries';

export default {
  content: [ "./dist/**/*.{html,js}" ],
  theme: {
    extend: {
      colors: {
        'background': '#f8fff8',
        'green-dark': '#164A1C',
        'green-bright': '#DBE7D7',
        'green-price': '#376B1F',
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
        'awesome': [ 'Font Awesome 6 Free', 'serif' ],
        'inter-medium': [ 'Inter', {
            fontVariationSettings: '"wght" 500'
          }
        ]
      },
      animation: {
        'shake': 'shake 1.00s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        'shake': {
          '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)'
          },
          '20%, 80%': {
            transform: 'translate3d(1px, 0, 0)'
          },
          '30%, 50%, 70%': {
            transform: 'translate3d(-2px, 0, 0)'
          },
          '40%, 60%': {
            transform: 'translate3d(2px, 0, 0)'
          }
        }
      }
    },
  },
  plugins: [
    containerQueryPlugin,
  ],
}

