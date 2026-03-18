<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="bg-slate-900 text-slate-300 py-16 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12 mb-12">
        <div class="space-y-6">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-3xl">eco</span>
            <span class="text-xl font-extrabold tracking-tight text-white">EcoStore</span>
          </div>
          <p class="text-sm leading-relaxed">
            Hãy cùng tham gia phong trào hướng tới một tương lai không rác thải. Những thay đổi nhỏ, tác động lớn.
          </p>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Chăm Sóc Khách Hàng</h4>
          <ul class="space-y-4 text-sm">
            <li><RouterLink to="/" class="hover:text-primary transition-colors">Liên hệ</RouterLink></li>
            <li><RouterLink to="/" class="hover:text-primary transition-colors">FAQ</RouterLink></li>
            <li><RouterLink to="/" class="hover:text-primary transition-colors">Giao hàng & Thu hồi</RouterLink></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Khám Phá</h4>
          <ul class="space-y-4 text-sm">
            <li><RouterLink to="/" class="hover:text-primary transition-colors">Sản phẩm</RouterLink></li>
            <li><RouterLink to="/" class="hover:text-primary transition-colors">Câu chuyện</RouterLink></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Newsletter</h4>
          <p class="text-sm mb-4">Get eco-tips and exclusive offers.</p>
          <div class="flex">
            <input type="email" placeholder="Email address" class="bg-slate-800 border-none rounded-l-lg text-sm w-full focus:ring-primary" />
            <button class="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary/90 transition-colors">
              <span class="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>

      <div class="text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2024 EcoStore. All rights reserved.</p>
        <div class="flex gap-6">
          <RouterLink to="/" class="hover:text-primary">Privacy Policy</RouterLink>
          <RouterLink to="/" class="hover:text-primary">Terms of Service</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>
