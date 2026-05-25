import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/',          component: () => import('../views/Dashboard.vue'),  name: 'dashboard'  },
  { path: '/fasting',   component: () => import('../views/Fasting.vue'),    name: 'fasting'    },
  { path: '/nutrition', component: () => import('../views/Nutrition.vue'),  name: 'nutrition'  },
  { path: '/history',   component: () => import('../views/History.vue'),    name: 'history'    },
  { path: '/settings',  component: () => import('../views/Settings.vue'),   name: 'settings'   },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
