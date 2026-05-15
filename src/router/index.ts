import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TreneriView from '@/views/TreneriView.vue'
import ClanoviView from "@/views/ClanoviView.vue"
import DolasciView from "@/views/DolasciView.vue"
import UplateView from "@/views/UplateView.vue"

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/treneri',
    name: 'Treneri',
    component: TreneriView
  },
  {
  path: '/clanovi',
  name: 'Clanovi',
  component: ClanoviView
  },
  {
    path: '/dolasci',
    name: 'Dolasci',
    component: DolasciView
  },
  {
    path: '/uplate',
    name: 'Uplate',
    component: UplateView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router