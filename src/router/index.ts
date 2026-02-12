import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/reguser',
      name: 'reguser',
      component: () => import('../view/UserRegister.vue'),
    },
    {
      path: '/loguser',
      name: 'loguser',
      component: () => import('../view/UserLogin.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../view/UserDashboard.vue'),
    },
    {
      path: '/summary',
      name: 'summary',
      component: () => import('../view/UserSummary.vue'),
    },
  ],
})

export default router
