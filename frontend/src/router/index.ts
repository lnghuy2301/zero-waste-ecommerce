import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/product/:id',
      name: 'productdetail',
      component: () => import('../views/ProductDetail.vue'),
    },
    {
      path: '/cartpayment',
      name: 'cartpayment',
      component: () => import('../views/CartPayment.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
    },
    {
      path: '/change_password',
      name: 'change_password',
      component: () => import('../views/Change_password.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/Products.vue'),
    },
  ],
})

export default router
