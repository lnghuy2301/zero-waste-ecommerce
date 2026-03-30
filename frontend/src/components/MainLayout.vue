<template>
  <div
    class="relative bg-cover bg-center min-h-[calc(100vh-160px)]"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <div class="absolute inset-0 bg-white/50 dark:bg-black/70 z-0"></div>

    <div class="relative z-10 container mx-auto px-6 py-10">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import ảnh nền từ thư mục assets
import bgImage from '@/assets/images/main-bg.jpg' // Thay bằng tên file ảnh thực tế của bạn
</script>
