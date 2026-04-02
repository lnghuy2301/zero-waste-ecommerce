<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="bg-slate-900 text-slate-400 py-16 mt-auto border-t border-slate-800">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

        <div class="lg:col-span-4 space-y-6">
          <RouterLink to="/" class="flex items-center gap-3 group w-fit">
            <div class="w-12 h-12 bg-[#eef4e6] rounded-xl flex items-center justify-center group-hover:bg-[#658a22] transition-all duration-300 shadow-sm">
              <span class="material-symbols-outlined text-[#658a22] text-[32px] group-hover:text-white transition-colors">eco</span>
            </div>
            <span class="text-2xl font-black tracking-tight text-white group-hover:text-[#658a22] transition-colors">EcoStore</span>
          </RouterLink>
          <p class="text-sm leading-relaxed max-w-sm">
            Tự hào là đơn vị cung cấp các giải pháp sống xanh bền vững. Hãy cùng EcoStore lan tỏa lối sống tích cực và giảm thiểu rác thải nhựa vì một tương lai xanh.
          </p>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#658a22] hover:text-white transition-all"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#658a22] hover:text-white transition-all"><i class="fa-brands fa-instagram"></i></a>
          </div>
        </div>

        <div class="lg:col-span-2">
          <h4 class="text-white font-bold text-base mb-6 uppercase tracking-wider">Khám Phá</h4>
          <ul class="space-y-4 text-sm font-medium">
            <li><RouterLink to="/products" class="hover:text-[#b4cc8c] transition-colors flex items-center gap-2">Cửa hàng</RouterLink></li>
            <li><RouterLink to="/about" class="hover:text-[#b4cc8c] transition-colors flex items-center gap-2">Về chúng tôi</RouterLink></li>
            <li><RouterLink to="/" class="hover:text-[#b4cc8c] transition-colors flex items-center gap-2">Câu chuyện</RouterLink></li>
          </ul>
        </div>

        <div class="lg:col-span-2">
          <h4 class="text-white font-bold text-base mb-6 uppercase tracking-wider">Hỗ Trợ</h4>
          <ul class="space-y-4 text-sm font-medium">
            <li><RouterLink to="/" class="hover:text-[#b4cc8c] transition-colors">Liên hệ</RouterLink></li>
            <li><RouterLink to="/" class="hover:text-[#b4cc8c] transition-colors">Câu hỏi thường gặp</RouterLink></li>
            <li><RouterLink to="/" class="hover:text-[#b4cc8c] transition-colors">Chính sách giao hàng</RouterLink></li>
          </ul>
        </div>

        <div class="lg:col-span-4">
          <h4 class="text-white font-bold text-base mb-6 uppercase tracking-wider">Đăng ký nhận tin</h4>
          <p class="text-sm mb-6">Nhận mẹo sống xanh và các ưu đãi độc quyền từ EcoStore hàng tuần.</p>
          <div class="relative group">
            <input
              type="email"
              placeholder="Địa chỉ Email của bạn"
              class="w-full bg-slate-800 border-2 border-transparent border-slate-700 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-[#658a22] transition-all"
            />
            <button class="absolute right-2 top-2 bottom-2 bg-[#658a22] text-white px-6 rounded-xl hover:bg-[#4d691a] transition-all flex items-center gap-2 shadow-lg">
              <span class="text-xs font-bold uppercase tracking-widest hidden sm:inline">Gửi ngay</span>
              <span class="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-[13px] font-medium">
          © 2026 <span class="text-white">EcoStore</span>. Thiết kế bởi đội ngũ Eco Team.
        </p>
        <div class="flex gap-8 text-[13px] font-medium">
          <RouterLink to="/" class="hover:text-white transition-colors">Chính sách bảo mật</RouterLink>
          <RouterLink to="/" class="hover:text-white transition-colors">Điều khoản dịch vụ</RouterLink>
          <RouterLink to="/" class="hover:text-white transition-colors">Cookies</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Đồng nhất font chữ với header */
footer {
  font-family: 'Inter', sans-serif;
}
</style>
