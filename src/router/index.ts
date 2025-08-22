import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Resources from '../components/Resources.vue'
import Sheets from '../components/Sheets.vue'
import Videos from '../components/Videos.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/resources',
    name: 'Resources',
    component: () => Resources
  },
  {
    path: '/sheets',
    name: 'Sheets',
    component: () => Sheets
  },
  {
    path: '/videos',
    name: 'Videos',
    component: () => Videos
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
