import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Main page',
    component: () => import('@/pages/MainPage.vue'),
  },
  {
    path: '/intro',
    name: 'Intro page',
    component: () => import('@/pages/IntroPage.vue'),
  },
  {
    path: '/lessons',
    name: 'Lessons page',
    component: () => import('@/pages/LessonsPage.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
