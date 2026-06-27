/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#ff6d5a',
        dark: {
          900: '#0d0f12',
          800: '#151820',
          700: '#1c2030',
          600: '#252a3a',
          500: '#2f3447',
          400: '#3d4460',
        },
      },
    },
  },
  plugins: [],
}
