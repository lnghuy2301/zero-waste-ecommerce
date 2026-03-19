<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="bg-background-light min-h-screen">
    <!-- Hero Section -->
    <section class="relative h-[600px] flex items-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          alt="Sống xanh"
          class="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkoGZJG_MUKBvy5eHgenV5gHcWqf1V5bML85bunMInMK2pbGFrCWgqqmIn-r-8AMaTrvahaizJHoQubA9k1PCv75FbhcF3zCgFx8dmWCs6FyUf87bl8h4c5AtwW-gU1quAidlG-qbGfLEpjviAQx9lX1RoVB5_l9t92ngN7oxf4jFVxIjmZ-CGIUfAlTMe7h0DXQB6ICgc-v7U1rxRv1od9xOxQ4lYEXQzD-L_9bCwPAPmc3ZOuQsgrRn7vwT5HOlwfnM0kA9zSQU"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="max-w-2xl">
          <h1 class="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Sống Bền Vững, <br />
            <span class="text-primary">Mua Sắm Có Ý Thức</span>
          </h1>
          <p class="text-lg text-white/90 mb-8 font-medium max-w-xl">
            Khám phá bộ sưu tập các sản phẩm không chứa nhựa thiết yếu của chúng tôi cho một ngôi
            nhà xanh hơn và một hành tinh khỏe mạnh hơn.
          </p>
          <RouterLink
            to="/"
            class="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Mua Sắm Ngay
            <span class="material-symbols-outlined ml-2">arrow_forward</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center mb-12">
        <h2 class="text-3xl font-bold mb-4 text-slate-900">Mua Sắm Theo Danh Mục</h2>
        <div class="h-1 w-24 bg-primary rounded-full"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Nhà Bếp -->
        <RouterLink
          to="/"
          class="group relative overflow-hidden rounded-xl aspect-[4/3] md:aspect-square cursor-pointer shadow-sm"
        >
          <img
            alt="Nhà bếp"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaHmIRv6pmnPRHDnrFogHBwORJuKvSWXAtMN3N_CPacGmvNgEcUBjD5dw8D_C1NZIbCAi-ttX4F8Sd-9yyvbIYPIm8T67wQR1u2vmsoXWPcpd638KytTBUY9KSPlsK1K0bKXUbLmzYp-qe0RWSaplSWhlF41EE1yM441gbsCpHOv7ASNlnJcItEtbLktQxKLpgslEjyR-362YPCEoV997NWmYaBrljaIKbDVDksa1N0H96xEYLE2-7yW8bILRNucOlIziA7nUDbOY"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors"
          ></div>
          <div class="absolute bottom-8 left-8">
            <h3 class="text-2xl font-bold text-white mb-2">Nhà Bếp</h3>
            <span
              class="text-sm font-semibold text-white/90 uppercase tracking-widest border-b-2 border-primary pb-1"
              >Xem Bộ Sưu Tập</span
            >
          </div>
        </RouterLink>

        <!-- Chăm sóc cơ thể -->
        <RouterLink
          to="/"
          class="group relative overflow-hidden rounded-xl aspect-[4/3] md:aspect-square cursor-pointer shadow-sm"
        >
          <img
            alt="Phòng tắm"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-Ov5XgKkyBbJVdDROt45Blba7TBxszl1Q9BafQH1YUNgjjLAhQ5s1aplUEvS9IYADcBdUz_SL7QLGPKeiTzCZKIb0zxaus8L56ulJu4iBDADJYw7O7hyVJfyUmTasl2z0jkkJVi6ZH1NF2Jvy396wpJr83TkpUfHHKAkMTY1rjzCVBXdBh1mY3ccP_TWoQZMiDaSB-jZsE2NfO5d4CWekdo97r4Cz8mp0AWvGyYXI6oqVgaj0doPUvAJthI6oxAolGabsCAqZvQA"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors"
          ></div>
          <div class="absolute bottom-8 left-8">
            <h3 class="text-2xl font-bold text-white mb-2">Phòng Tắm & Cơ Thể</h3>
            <span
              class="text-sm font-semibold text-white/90 uppercase tracking-widest border-b-2 border-primary pb-1"
              >Xem Bộ Sưu Tập</span
            >
          </div>
        </RouterLink>

        <!-- Mang Theo -->
        <RouterLink
          to="/"
          class="group relative overflow-hidden rounded-xl aspect-[4/3] md:aspect-square cursor-pointer shadow-sm"
        >
          <img
            alt="Mang theo"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlpMXvPBMQTRGJFr42nzdDqCj2yEn93lMsjWeEppOaIAQpp9mIuqDLCtHvpCwM9X9pXMjnxS_JpvA_thHpp4STKu-7uJDGRvbLDrFU7c-6xB_VA57pCngDXJ0ulSWClKTNOMqSF3rneNcxSGQXFVw1JVLq153hNnno1eQA-oLOsCtz8kOgkNC0eFyZC64GH2MnvOCZ8Fz1IEsqFjlmJZb3rmsBc64e21SW1VKNqzAVQKuy8bRLLZfbdNg19NA8dsm8F6-mQME3wb4"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors"
          ></div>
          <div class="absolute bottom-8 left-8">
            <h3 class="text-2xl font-bold text-white mb-2">Đồ Dùng Mang Theo</h3>
            <span
              class="text-sm font-semibold text-white/90 uppercase tracking-widest border-b-2 border-primary pb-1"
              >Xem Bộ Sưu Tập</span
            >
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- New Arrivals -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-10">
          <div>
            <h2 class="text-3xl font-bold mb-2 text-slate-900">Sản Phẩm Mới</h2>
            <p class="text-slate-500">
              Những sự bổ sung mới nhất cho danh mục thân thiện với môi trường
            </p>
          </div>
          <div class="hidden md:flex gap-3">
            <button
              class="size-10 flex items-center justify-center rounded-full border border-slate-200 hover:border-primary hover:text-primary transition-colors"
            >
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              class="size-10 flex items-center justify-center rounded-full border border-slate-200 hover:border-primary hover:text-primary transition-colors"
            >
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Item 1 -->
          <div
            class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div class="relative aspect-square mb-5 overflow-hidden rounded-xl bg-slate-50">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdTveclGH-N5fdCnmSY1UEgQdHdoGrmBHLriBqdvxAAiJTdnfosjgYP3Ej_qVWZORjDaJB6LQTkO0P7bX1Mk7LubmJCsqZAGj_QGcfnK1n7gFloPucQdtfphKsrIyhO7b9CNTAVWN8H1qMKu7zQPWkSGh9VL5kLXSJKmEVkPS5exhc3gRI_gzZTQcLLCl6INvd9nYNvw-OBweSn8DgL4TShQbqqEgA8bmK-A4vsaAU3HWJNU8Qdq7SPq7v6mGaxEm6xl_gQ9eexqw"
                alt="Bàn chải"
              />
            </div>
            <h4 class="font-bold text-slate-900 mb-1">Set Bàn Chải Tre</h4>
            <p class="text-primary font-bold">$12.99</p>
          </div>

          <!-- Item 2 -->
          <div
            class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div class="relative aspect-square mb-5 overflow-hidden rounded-xl bg-slate-50">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4xXtyqN2sCIQeQYHijinUVRUvwHNxJ7V-91DjpWM1tztr3LdoIA3tl3T8-2ZCBcsUlJ3IQx7p5qlV3YAG9T0xSFM8ZUzeGy9OgGkb7oMcxS5XQmhTTw4-H5jkkvTZxmW6obl6JvYL_xKXsCN4CmOhajfJqD03gEMXUC4lWacXCSnLT4bHPuduzEEd2QA1PQRaOUR9d88swL8qZ_6nzHzBP8BaNU0b3yySoYJJrzuGUhUs3LeypVP9NFDk665_lebX0QSFG_ZSH1Y"
                alt="Lọ thủy tinh"
              />
            </div>
            <h4 class="font-bold text-slate-900 mb-1">Lọ Thủy Tinh (Set 3)</h4>
            <p class="text-primary font-bold">$24.50</p>
          </div>

          <!-- Item 3 -->
          <div
            class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div class="relative aspect-square mb-5 overflow-hidden rounded-xl bg-slate-50">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYD36oU415BRWPc7UVu3Ow1F4bnEdY2AEW8TcK0EvV7Af09ySwtOOEPeYHcgwmJo_p1MJEVtO9YX7bLrn10E27GgGpmTwWvvTbny5DbSRNdvVFWVB4lQq7R4CKW2MS5MmZsGV18mtLrx9_frUyiR4qJPJU7wOsLBvdBrpwNFxAJ4i_pyesjDONB1apC221o-JZ3OjWkg_hmPcKHjWIYILKcLR2CQP5jeDwSYCmDNpudfo21neGA_FVFpKyE-sEKb-fviLKFoz0Kxo"
                alt="Xà phòng"
              />
            </div>
            <h4 class="font-bold text-slate-900 mb-1">Xà Phòng Hữu Cơ</h4>
            <p class="text-primary font-bold">$8.00</p>
          </div>

          <!-- Item 4 -->
          <div
            class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div class="relative aspect-square mb-5 overflow-hidden rounded-xl bg-slate-50">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFPdc_5GmsWjilmjAAHCj9OfGxqeNw0PT9ZmlxF54t_TBwueJu_rft85Gw0Xk5qk_W24e17hX1u7vUNP4FCn6fwNLiGqq_pn9F7KIP-2c3Hmvfn4ulDHDT2A3FY_wtEJw3pzgyJhTXz9REqEskZbu7dhIUEl8GiZPjhaCBaqPzhkLVbMiKlVoCROlXgPb6SsxoxogQcncGsbWDWmTy4lr6RpGUABiC3ApxBVJtTb2K0PsUN_C9iK2G30PiHt_d9vaYhnuNkVAHgFc"
                alt="Hộp cơm"
              />
            </div>
            <h4 class="font-bold text-slate-900 mb-1">Hộp Cơm Thép Không Gỉ</h4>
            <p class="text-primary font-bold">$32.00</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Zero-Waste? -->
    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-[#eef2e6] rounded-[2.5rem] p-12 md:p-20 text-center shadow-sm">
        <h2 class="text-3xl md:text-4xl font-bold mb-16 text-slate-900">
          Tại Sao Chọn Zero-Waste?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="flex flex-col items-center">
            <div
              class="size-20 bg-primary text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30"
            >
              <span class="material-symbols-outlined text-4xl">energy_savings_leaf</span>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900">Thân Thiện Môi Trường</h3>
            <p class="text-slate-600 leading-relaxed">
              Nguyên liệu được khai thác bền vững, tôn trọng tự nhiên và bảo tồn đa dạng sinh học.
            </p>
          </div>
          <div class="flex flex-col items-center">
            <div
              class="size-20 bg-primary text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30"
            >
              <span class="material-symbols-outlined text-4xl">recycling</span>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900">Giảm Thiểu Nhựa</h3>
            <p class="text-slate-600 leading-relaxed">
              Loại bỏ nhựa dùng một lần bằng các giải pháp thay thế bền bỉ, có thể tái sử dụng.
            </p>
          </div>
          <div class="flex flex-col items-center">
            <div
              class="size-20 bg-primary text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30"
            >
              <span class="material-symbols-outlined text-4xl">science</span>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900">Thành Phần Tự Nhiên</h3>
            <p class="text-slate-600 leading-relaxed">
              Công thức sạch, không hóa chất độc hại, an toàn tuyệt đối cho gia đình bạn.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
