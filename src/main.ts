import { createApp } from 'vue'

// Styles
import './assets/main.css'

// i18n
import i18n from './i18n'

// Components
import App from './App.vue'

const app = createApp(App)
app.use(i18n)
app.mount('#app')