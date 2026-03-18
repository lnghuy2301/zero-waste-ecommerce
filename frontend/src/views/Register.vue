<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-white via-white to-[#eef4e6] relative overflow-hidden">
    <!-- Abstract nature-inspired background elements -->
    <div class="absolute inset-0 nature-pattern opacity-30 pointer-events-none"></div>
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

    <div class="w-full max-w-[480px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden border border-slate-100 z-10">
      <!-- Header / Hero Image -->
      <div class="relative h-32 bg-[#eef4e6] overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center opacity-40" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSrJUTWpk_aPbmO0pbIhZC4unyGMw2v5uM7WUy7Xd2yNgrR0uFyd30_UlBHpOoPtsPQ1hUtGmznwgBme3JB9p539N2a52brp9J9VNM2A2knR0VD790y5WUe3sdiX9RaFII14BVm4TFS32sLIWEPmKWa-bNkxS1aeCZzIM1qHKUD7sQ0p32NAZArNqMmMCLaSSr8b9MkKwuiTiT3NnzZaDIyz-KGTkHlGsCW-HQHW4sceXe9ZdbajBFoHyxRqp2VzmH1tVRojPt3V0')"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
        <div class="absolute bottom-4 left-0 right-0 flex justify-center">
          <RouterLink to="/" class="flex items-center gap-2 px-5 py-2 bg-white rounded-full shadow-sm">
            <span class="material-symbols-outlined text-primary">eco</span>
            <span class="font-bold tracking-tight text-primary">Zero-Waste Store</span>
          </RouterLink>
        </div>
      </div>

      <div class="px-8 pt-6 pb-10">
        <!-- Heading -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-slate-900 mb-2">Tạo Tài Khoản</h1>
          <p class="text-slate-500 text-sm">Tham gia cộng đồng vì một tương lai bền vững</p>
        </div>

        <!-- Form -->
        <form class="space-y-5" @submit.prevent>
          <!-- Email Field -->
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700">Địa chỉ Email</label>
            <input type="email" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#f8f9fa] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all sm:text-sm" placeholder="hello@example.com" />
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700">Mật khẩu</label>
            <div class="relative flex items-center">
              <input type="password" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#f8f9fa] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-12 sm:text-sm" placeholder="Tạo mật khẩu" />
              <button type="button" class="absolute right-3 text-slate-400 hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-[20px]">visibility</span>
              </button>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700">Xác nhận Mật khẩu</label>
            <input type="password" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#f8f9fa] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all sm:text-sm" placeholder="Nhập lại mật khẩu" />
          </div>

          <!-- Primary Button -->
          <button type="submit" class="w-full bg-[#658a22] hover:bg-[#58791d] text-white font-semibold py-3.5 rounded-xl shadow-sm transition-all transform active:scale-[0.98] mt-2">
            Tạo Tài Khoản
          </button>

          <!-- Divider -->
          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200"></div>
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-white px-4 text-slate-400 font-medium">HOẶC TIẾP TỤC VỚI</span>
            </div>
          </div>

          <!-- Social Sign Up -->
          <button type="button" class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700 shadow-sm">
            <svg class="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
              <path d="M533.5 272.3c0-18.7-1.6-37.1-4.7-55H272.5v104.7h146.9c-6.1 33.7-25 61.9-52.5 81.3v68h87.9c51.5-47.5 81.1-117.4 81.1-200z" fill="#4285F4"/>
              <path d="M272.5 544.3c73.4 0 135.2-24.1 180.3-65.7l-87.9-68c-24.2 16.3-55.7 25.8-92.4 25.8-70.3 0-129.9-47.5-151.8-111.4H28.4v68.8C73.8 506.7 167.3 544.3 272.5 544.3z" fill="#34A853"/>
              <path d="M120.7 327.3c-5.8-16.3-9-33.8-9-55s3.2-38.7 9-55V148.6H28.4c-12.7 25.4-20 52.8-20 86.4s7.3 61 20 86.4l92.3-72.1z" fill="#FBBC05"/>
              <path d="M272.5 108.9c39.8 0 75.3 13.7 103.5 40.5l77.4-74.8C407.7 25.4 344.9 0 272.5 0c-105.2 0-198.7 37.6-244.1 108.9l92.3 72.1c21.9-63.9 81.5-111.4 151.8-111.4z" fill="#EA4335"/>
            </svg>
            Đăng ký bằng Google
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-8 text-center">
          <p class="text-sm text-slate-500">
            Đã có tài khoản?
            <RouterLink to="/login" class="text-[#658a22] font-semibold hover:underline ml-1">Đăng Nhập</RouterLink>
          </p>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="bg-slate-50 px-8 py-5 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-400 border-t border-slate-100 font-semibold">
        <span>Sống Bền Vững</span>
        <div class="flex gap-4">
          <a href="#" class="hover:text-slate-600 transition-colors">Bảo mật</a>
          <a href="#" class="hover:text-slate-600 transition-colors">Điều khoản</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nature-pattern {
  background-image: radial-gradient(circle at 2px 2px, #e5ebd8 1px, transparent 0);
  background-size: 32px 32px;
}
</style
