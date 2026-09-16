/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        navy: {
          800: '#0f1f38',
          900: '#0b162c',
          950: '#070d1b',
        },
        teal: {
          500: '#14b8a6',
          600: '#0d9488',
        }
      }
    },
  },
  plugins: [],
}
