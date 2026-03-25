<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { notify } from '@/utils/notifier.ts'

const router = useRouter()
const isMenuOpen = ref(false)

const user = ref<any>(null)

onMounted(() => {
  const u = localStorage.getItem('user')
  if (u) user.value = JSON.parse(u)
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  notify.success('Đăng xuất thành công')
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen bg-slate-50">
    <!-- Sidebar -->
    <div class="w-72 bg-[#658a22] text-white flex flex-col">
      <div class="px-6 py-8 flex items-center gap-3 border-b border-white/20">
        <span class="material-symbols-outlined text-4xl">eco</span>
        <span class="text-2xl font-black tracking-tighter">EcoStore Admin</span>
      </div>

      <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <RouterLink
          to="/admin"
          class="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors font-semibold text-white active"
        >
          <span class="material-symbols-outlined">dashboard</span>
          <span>Tổng quan</span>
        </RouterLink>
        <!-- Thêm link khác sau -->
        <RouterLink
          to="/admin/products"
          class="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors font-medium"
        >
          <span class="material-symbols-outlined">inventory_2</span>
          <span>Sản phẩm</span>
        </RouterLink>
        <RouterLink
          to="/admin/orders"
          class="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors font-medium"
        >
          <span class="material-symbols-outlined">shopping_cart</span>
          <span>Đơn hàng</span>
        </RouterLink>
        <RouterLink
          to="/admin/users"
          class="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors font-medium"
        >
          <span class="material-symbols-outlined">group</span>
          <span>Khách hàng</span>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-white/20">
        <button
          @click="logout"
          class="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-semibold transition-colors"
        >
          <span class="material-symbols-outlined">logout</span>
          Đăng xuất
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar -->
      <header class="h-16 bg-white border-b flex items-center px-8 justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold text-slate-900">Tổng quan hệ thống</h1>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm font-semibold text-slate-700">{{ user?.email }}</p>
            <p class="text-xs text-emerald-600">Admin</p>
          </div>
          <img
            :src="`https://ui-avatars.com/api/?name=${user?.email}&background=658a22&color=fff`"
            class="w-9 h-9 rounded-full border-2 border-white shadow"
          />
        </div>
      </header>

      <!-- Nội dung trang con -->
      <main class="flex-1 overflow-auto p-8 bg-slate-50">
        <RouterView />
      </main>
    </div>
  </div>
</template>
