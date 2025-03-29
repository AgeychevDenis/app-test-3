/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#24ADED',
        'primary-hover': '#108ec9',
        'input-bg': '#F3F6FF',
        'input-hover': '#dae3ff',
        'icon': '#8593a5',
        'text-primary': '#15203D',
        'text-secondary': '#93989d',
      }
    },
  },
  plugins: [],
}