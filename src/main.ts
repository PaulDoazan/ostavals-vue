import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// Styles
import './assets/main.css'

// Components
import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  defaults: {
    VCard: {
      class: 'custom-font'
    },
    VBtn: {
      class: 'custom-font'
    },
    VTextField: {
      class: 'custom-font'
    }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
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
        }
      },
      gray: {
        dark: false,
        colors: {
          primary: '#000000',
          secondary: '#333333',
          accent: '#666666',
          error: '#FF5252',
          info: '#000000',
          success: '#000000',
          warning: '#000000',
          background: '#FFFFFF',
          surface: '#FFFFFF',
          'on-background': '#000000',
          'on-surface': '#000000',
          'custom-red': '#000000',
          'menu-background': '#CCCCCC',
        }
      }
    }
  }
})

createApp(App).use(vuetify).mount('#app')