import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { notify } from '@/utils/notifier.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
    { path: '/register', name: 'register', component: () => import('../views/Register.vue') },
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
    { path: '/profile', name: 'profile', component: () => import('../views/Profile.vue') },
    {
      path: '/change_password',
      name: 'change_password',
      component: () => import('../views/Change_password.vue'),
    },
    { path: '/products', name: 'products', component: () => import('../views/Products.vue') },
    { path: '/orders', name: 'orders', component: () => import('../views/Order.vue') },
    {
      path: '/change-password',
      name: 'ChangePassword',
      component: () => import('../views/Change_password.vue'),
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('@/views/ResetPassword.vue'),
    },
    // === ADMIN ROUTE (có bảo vệ) ===
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('../views/admin/Dashboard.vue'),
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('../views/admin/ProductManagement.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }, // bảo vệ thêm
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('../views/admin/OrderManagement.vue'),
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: 'accounts',
          name: 'admin-accounts',
          component: () => import('../views/admin/AccountManagement.vue'),
          meta: { requiresAuth: true, requiresAdmin: true },
        },
      ],
    },
  ],
})

// === GUARD ROUTER (đặt sau khi tạo router) ===
router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem('user')
  let user: any = null
  if (userStr) {
    try {
      user = JSON.parse(userStr)
    } catch (_) {}
  }

  // Yêu cầu đăng nhập
  if (to.meta.requiresAuth && !user) {
    next('/login')
    return
  }

  // Yêu cầu quyền ADMIN
  if (to.meta.requiresAdmin && user?.role !== 'ADMIN') {
    notify.error('Bạn không có quyền truy cập trang quản trị')
    next('/')
    return
  }

  next()
})

export default router
