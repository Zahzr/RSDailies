/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'rs-dark': '#1f2f38',
        'rs-light': '#f5f5f5',
        'rs-accent': '#d4a574',
      },
    },
  },
  plugins: [],
}
