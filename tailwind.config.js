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
        creme: '#F0E9DD',
        kaki: '#899D6D',
        lightkaki: '#DACF75',
        redgrey: '#D3BFAF',
        red: '#C83F28',
      },
      fontFamily: {
        'custom': ['LFT_Etica_Bold', 'MinionPro-Regular', 'sans-serif'],
        'soleil': ['Soleil', 'sans-serif'],
        'athelas': ['Athelas', 'serif'],
      },
      spacing: {
        '84': '21rem',
        '100': '25rem',
      }
    },
  },
  plugins: [],
  // BrightSign compatibility settings
  corePlugins: {
    // Disable features that might cause issues on BrightSign
    backdropBlur: false,
    backdropFilter: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
  }
}
