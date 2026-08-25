/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#1772d0',
          dark: '#60a5fa',
        },
      },
      fontFamily: {
        sans: ['Lato', 'Verdana', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
