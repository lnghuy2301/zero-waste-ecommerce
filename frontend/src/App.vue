<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

// Lấy thông tin route hiện tại
const route = useRoute()

// Logic: Ẩn Navbar & Footer nếu route.name là 'login' hoặc 'register'
const isAuthPage = computed(() => {
  return ['login', 'register'].includes(route.name as string)
})
</script>

<template>
  <div class="relative flex min-h-screen flex-col bg-background-light text-slate-900 dark:text-slate-100 antialiased">

    <!-- Hiển thị Navbar nếu không phải trang Auth -->
    <Navbar v-if="!isAuthPage" />

    <!-- Nội dung các trang sẽ được render tại đây -->
    <main class="flex-grow">
      <RouterView />
    </main>

    <!-- Hiển thị Footer nếu không phải trang Auth -->
    <Footer v-if="!isAuthPage" />

  </div>
</template>
