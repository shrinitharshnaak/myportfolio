/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
        },
        purple: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          400: '#A855F7',
          500: '#9333EA',
        },
        cream: {
          50: '#FFF7ED',
          100: '#FFF5E4',
          200: '#FFE4C4',
        },
      },
    },
  },
  plugins: [],
};