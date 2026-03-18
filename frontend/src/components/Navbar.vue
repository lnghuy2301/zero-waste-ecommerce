<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-3xl">eco</span>
          <span class="text-xl font-extrabold tracking-tight text-primary">EcoStore</span>
        </RouterLink>

        <!-- Nav Links -->
        <nav class="hidden md:flex items-center space-x-8">
          <RouterLink to="/" class="text-sm font-semibold hover:text-primary transition-colors">Shop All</RouterLink>
          <RouterLink to="/" class="text-sm font-semibold hover:text-primary transition-colors">Categories</RouterLink>
          <RouterLink to="/" class="text-sm font-semibold hover:text-primary transition-colors">About Us</RouterLink>
          <RouterLink to="/" class="text-sm font-semibold hover:text-primary transition-colors">Blog</RouterLink>
        </nav>

        <!-- Icons -->
        <div class="flex items-center gap-4">
          <button class="p-2 hover:bg-primary/10 rounded-full transition-colors">
            <span class="material-symbols-outlined text-slate-700 dark:text-slate-300">search</span>
          </button>

          <RouterLink to="/login" class="p-2 hover:bg-primary/10 rounded-full transition-colors">
            <span class="material-symbols-outlined text-slate-700 dark:text-slate-300">person</span>
          </RouterLink>

          <!-- Nút Giỏ hàng sẽ trỏ tới trang CartPayment -->
          <RouterLink to="/cartpayment" class="p-2 hover:bg-primary/10 rounded-full transition-colors relative">
            <span class="material-symbols-outlined text-slate-700 dark:text-slate-300">shopping_cart</span>
            <span class="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>
