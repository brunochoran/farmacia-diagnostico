/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#1D9E75',
        'brand-dark': '#157a5b',
        'brand-light': '#5DCAA5',
        amber: '#EF9F27',
        danger: '#E24B4A',
        dark: '#0F172A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
