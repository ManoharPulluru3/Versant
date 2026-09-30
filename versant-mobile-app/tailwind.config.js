/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#f6f7f2',
        cream: '#f2f5e8',
        surface: '#fcfbf8',
        brand: {
          DEFAULT: '#1f6b4f',
          light: '#dcebdd',
        },
        accent: '#e58a45',
        dark: '#17221d',
        muted: '#7a837d',
      },
    },
  },
  plugins: [],
}
