/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        bambi: {
          green:  '#4CAF50',
          orange: '#FF6B35',
          light:  '#F9FAFB',
        },
        momo: '#ae2070',
      },
      fontFamily: {
        display: ['"Nunito"', 'sans-serif'],
        body:    ['"Quicksand"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
