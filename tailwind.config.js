/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./dist/**/*.{html,js}" ],
  theme: {
    extend: {
      fontFamily: {
        'sans-serif': [ 'Inter', 'sans-serif'],
        'serif': [ 'Newsreader', 'serif'],
      }
    },
  },
  plugins: [],
}

