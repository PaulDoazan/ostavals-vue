import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home/index.vue'
import Resources from '../components/Resources/index.vue'
import Sheets from '../components/Sheets/index.vue'
import Videos from '../components/Videos/index.vue'
import VideoPlayer from '../components/VideoPlayer.vue'
import Presentation from '../components/Sheets/Presentation.vue'
import Credits from '../components/Credits/index.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/resources',
    name: 'Resources',
    component: Resources
  },
  {
    path: '/sheets',
    name: 'Sheets',
    component: Sheets
  },
  {
    path: '/videos',
    name: 'Videos',
    component: Videos
  },
  {
    path: '/video/:id',
    name: 'VideoPlayer',
    component: VideoPlayer,
    props: true
  },
  {
    path: '/presentation/:gridItemId',
    name: 'Presentation',
    component: Presentation,
    props: true
  },
  {
    path: '/credits',
    name: 'Credits',
    component: Credits
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
