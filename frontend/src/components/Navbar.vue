<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import auth from "@/service/auth.ts";
import { notify } from "@/utils/notifier.ts";

const router = useRouter()
const isMenuOpen = ref(false)
const user = ref<any>(null)

const checkAuth = () => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser)
    } catch (e) {
      user.value = null
    }
  } else {
    user.value = null
  }
}

onMounted(() => {
  checkAuth()
  // Đóng menu khi click ra ngoài
  window.addEventListener('click', (e: any) => {
    if (!e.target.closest('.user-menu-container')) {
      isMenuOpen.value = false
    }
  })
})

const handleLogout = () => {
  notify.success("Đăng xuất thành công");
  // Đóng menu ngay lập tức
  isMenuOpen.value = false;

  setTimeout(() => {
    auth.logout();
    user.value = null; // Cập nhật UI ngay
    router.push('/login');
  }, 800);
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
          <RouterLink to="/" class="text-sm font-semibold hover:text-[#658a22] text-slate-700">Sản phẩm</RouterLink>
          <RouterLink to="/" class="text-sm font-semibold hover:text-primary transition-colors">Khuyến mãi</RouterLink>
          <RouterLink to="/" class="text-sm font-semibold hover:text-primary transition-colors">Về Chúng tôi</RouterLink>
        </nav>

        <div class="flex items-center gap-2 sm:gap-4">
          <button class="p-2 hover:bg-slate-100 rounded-full">
            <span class="material-symbols-outlined text-slate-600">search</span>
          </button>

          <div v-if="user" class="relative user-menu-container">
            <button
              @click.stop="isMenuOpen = !isMenuOpen"
              class="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-xl border border-transparent transition-all"
              :class="{ 'border-slate-200 bg-slate-50': isMenuOpen }"
            >
              <div class="size-8 bg-[#658a22]/10 rounded-full flex items-center justify-center">
                <span class="material-symbols-outlined text-[#658a22] text-[20px]">person</span>
              </div>
              <div class="hidden lg:flex flex-col items-start leading-none text-left">
                <span class="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{{user.role}}</span>
                <span class="text-xs font-semibold text-slate-700 max-w-[120px] truncate">{{ user.email }}</span>
              </div>
              <span class="material-symbols-outlined text-slate-400 text-[18px] transition-transform" :class="{ 'rotate-180': isMenuOpen }">
                expand_more
              </span>
            </button>

            <div
              v-if="isMenuOpen"
              class="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-[100]"
            >
              <div class="px-4 py-2 border-b border-slate-50 mb-1">
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tài khoản của tôi</p>
              </div>

              <RouterLink to="/profile" @click="isMenuOpen = false" class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                <span class="material-symbols-outlined text-[20px]">account_circle</span>
                Hồ sơ cá nhân
              </RouterLink>

<!--              <RouterLink to="/orders" @click="isMenuOpen = false" class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">-->
<!--                <span class="material-symbols-outlined text-[20px]">package_2</span>-->
<!--                Đơn hàng của tôi-->
<!--              </RouterLink>-->

              <div class="h-px bg-slate-100 my-1"></div>

              <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50">
                <span class="material-symbols-outlined text-[20px]">logout</span>
                Đăng xuất
              </button>
            </div>
          </div>

          <RouterLink v-else to="/login" class="text-xs font-bold text-[#658a22] bg-[#658a22]/10 px-4 py-2 rounded-lg transition-colors hover:bg-[#658a22]/20">
            Đăng Nhập
          </RouterLink>

          <RouterLink to="/cartpayment" class="p-2 hover:bg-slate-100 rounded-full relative">
            <span class="material-symbols-outlined text-slate-600">shopping_cart</span>
            <span class="absolute top-1 right-1 bg-[#658a22] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">3</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>
