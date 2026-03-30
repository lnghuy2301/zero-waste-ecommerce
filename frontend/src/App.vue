<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

// Import ảnh nền từ thư mục assets của bạn
// Hãy đảm bảo bạn đã có file này trong src/assets/bg-main.jpg (hoặc đổi tên cho đúng)
import bgImage from '@/assets/images/main-bg.jpg'

const route = useRoute()

// Logic: Ẩn Navbar & Footer nếu là trang login/register
// const isAuthPage = computed(() => {
//   return ['login', 'register'].includes(route.name as string)
// })
const isAuthPage = computed(() => {
  // Ẩn Navbar/Footer nếu là trang login, register HOẶC trang admin
  return ['login', 'register'].includes(route.name as string) || route.path.startsWith('/admin')
})
</script>

<template>
  <div
    class="relative flex min-h-screen flex-col bg-background-light text-slate-900 dark:text-slate-100 antialiased"
  >
    <Navbar v-if="!isAuthPage" />

    <main
      class="flex-grow relative bg-cover bg-center bg-no-repeat transition-all duration-500"
      :class="{ 'px-10': !isAuthPage }"
      :style="!isAuthPage ? { backgroundImage: `url(${bgImage})` } : {}"
    >
      <div v-if="!isAuthPage" class="absolute inset-0 bg-white/40 dark:bg-black/60 z-0"></div>
      <div :class="{ 'relative z-10 container mx-auto px-4': !isAuthPage }">
        <RouterView />
      </div>
    </main>

    <Footer v-if="!isAuthPage" />
  </div>
</template>

<style scoped>
/* Bạn có thể thêm hiệu ứng mượt mà khi chuyển trang ở đây nếu muốn */
</style>
