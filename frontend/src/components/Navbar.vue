<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import auth from '@/service/auth.ts'
import { notify } from '@/utils/notifier.ts'

const router = useRouter()
const isMenuOpen = ref(false)
const user = ref<any>(null)

const getAvatarUrl = (path: string | null) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://localhost:3000${path}`;
};

const checkAuth = () => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser)
      console.log('user từ localStorage:', user.value)
    } catch (e) {
      user.value = null
    }
  } else {
    user.value = null
  }
}

const handleUserUpdate = (event: any) => {
  if (event.detail) {
    user.value = event.detail
  } else {
    checkAuth()
  }
}

onMounted(() => {
  checkAuth()
  window.addEventListener('user-updated', handleUserUpdate)
  window.addEventListener('click', (e: any) => {
    if (!e.target.closest('.user-menu-container')) {
      isMenuOpen.value = false
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('user-updated', handleUserUpdate)
})

const handleLogout = () => {
  notify.success('Đăng xuất thành công')
  isMenuOpen.value = false
  setTimeout(() => {
    auth.logout()
    user.value = null
    router.push('/login')
  }, 800)
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 font-inter">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <RouterLink to="/" class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#658a22] text-3xl">eco</span>
          <span class="text-xl font-extrabold tracking-tight text-[#658a22]">EcoStore</span>
        </RouterLink>

        <nav class="hidden md:flex items-center space-x-8">
          <RouterLink to="/products" class="text-sm font-bold hover:text-[#658a22] text-slate-700">Sản phẩm</RouterLink>
          <RouterLink to="/" class="text-sm font-bold hover:text-[#658a22] text-slate-700">Khuyến mãi</RouterLink>
          <RouterLink to="/" class="text-sm font-bold hover:text-[#658a22] text-slate-700">Về Chúng tôi</RouterLink>
        </nav>

        <div class="flex items-center gap-2 sm:gap-4">
          <button class="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center">
            <span class="material-symbols-outlined text-slate-600">search</span>
          </button>

          <div v-if="user" class="relative user-menu-container">
            <button
              @click.stop="isMenuOpen = !isMenuOpen"
              class="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-xl border border-transparent transition-all"
              :class="{ 'border-slate-200 bg-slate-50 shadow-sm': isMenuOpen }"
            >
              <div class="size-9 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center bg-[#eef4e6]">
                <img
                  v-if="user.avatar"
                  :src="getAvatarUrl(user.avatar)"
                  class="w-full h-full object-cover"
                  alt="Avatar"
                />
                <span v-else class="text-[13px] font-bold text-[#658a22] uppercase">
                  {{ user.email ? user.email.substring(0, 2) : 'TP' }}
                </span>
              </div>

              <div class="hidden lg:flex flex-col items-start leading-tight text-left mr-1">
                <span class="text-[9px] text-[#658a22] font-black uppercase tracking-tighter">{{ user.role }}</span>
                <span class="text-[11px] font-bold text-slate-700 max-w-[100px] truncate">{{ user.email }}</span>
              </div>
              <span class="material-symbols-outlined text-slate-400 text-[18px] transition-transform" :class="{ 'rotate-180': isMenuOpen }">
                expand_more
              </span>
            </button>

            <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-[100]">
              <div class="px-4 py-2 border-b border-slate-50 mb-1">
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tài khoản</p>
              </div>

              <RouterLink to="/profile" @click="isMenuOpen = false" class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <span class="material-symbols-outlined text-[20px]">account_circle</span>
                Hồ sơ cá nhân
              </RouterLink>

              <RouterLink to="/orders" @click="isMenuOpen = false" class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <span class="material-symbols-outlined text-[20px]">package_2</span>
                Đơn hàng của tôi
              </RouterLink>

              <div class="h-px bg-slate-100 my-1"></div>

              <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                <span class="material-symbols-outlined text-[20px]">logout</span>
                Đăng xuất
              </button>
            </div>
          </div>

          <RouterLink v-else to="/login" class="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center">
            <span class="material-symbols-outlined text-slate-600">account_circle</span>
          </RouterLink>

          <RouterLink to="/cartpayment" class="p-2 hover:bg-slate-100 rounded-full relative transition-colors flex items-center justify-center">
            <span class="material-symbols-outlined text-slate-600">shopping_cart</span>
            <span class="absolute top-1 right-1 bg-[#658a22] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">3</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.font-inter { font-family: 'Inter', sans-serif; }
</style>
