/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1867C0',
        secondary: '#5CBBF6',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        background: '#F2ECE0',
        surface: '#FFFFFF',
        'on-background': '#020203',
        'on-surface': '#020203',
        'custom-red': '#C93D28',
        'menu-background': '#D2BEB0',
      },
      fontFamily: {
        'custom': ['LFT_Etica_Bold', 'MinionPro-Regular', 'sans-serif'],
        'soleil': ['Soleil', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
