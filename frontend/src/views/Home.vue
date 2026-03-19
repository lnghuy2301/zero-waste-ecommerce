<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Caterogy } from '../service/caterogy.ts'

const categories = ref<any[]>([])
const isLoading = ref(true)

// --- LOGIC SLIDER ---
const currentPage = ref(0)
const itemsPerPage = 3

const chunkedCategories = computed(() => {
  const chunks = []
  for (let i = 0; i < categories.value.length; i += itemsPerPage) {
    chunks.push(categories.value.slice(i, i + itemsPerPage))
  }
  return chunks
})

const totalPages = computed(() => chunkedCategories.value.length)

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  } else {
    currentPage.value = 0
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  } else {
    currentPage.value = totalPages.value - 1
  }
}

// --- LOGIC AUTO-PLAY ---
const autoPlayInterval = ref<ReturnType<typeof setInterval> | null>(null)

const startAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
  }
  autoPlayInterval.value = setInterval(() => {
    nextPage()
  }, 3000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

// --- API ---
const fetchCategories = async () => {
  try {
    isLoading.value = true
    const data = await Caterogy.getAllCaterogy()
    categories.value = data
  } catch (error) {
    console.error("Lỗi khi tải danh mục:", error)
  } finally {
    isLoading.value = false
  }
}

const BACKEND_URL = 'http://localhost:3000'

const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) {
    return 'https://placehold.co/600x400/eef2e6/658a22?text=Zero+Waste'
  }
  return `${BACKEND_URL}${imagePath}`
}

onMounted(() => {
  fetchCategories()
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <div class="bg-background-light min-h-screen">
    <section class="relative h-[600px] flex items-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img alt="Sống xanh" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkoGZJG_MUKBvy5eHgenV5gHcWqf1V5bML85bunMInMK2pbGFrCWgqqmIn-r-8AMaTrvahaizJHoQubA9k1PCv75FbhcF3zCgFx8dmWCs6FyUf87bl8h4c5AtwW-gU1quAidlG-qbGfLEpjviAQx9lX1RoVB5_l9t92ngN7oxf4jFVxIjmZ-CGIUfAlTMe7h0DXQB6ICgc-v7U1rxRv1od9xOxQ4lYEXQzD-L_9bCwPAPmc3ZOuQsgrRn7vwT5HOlwfnM0kA9zSQU"/>
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="max-w-2xl">
          <h1 class="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Sống Bền Vững, <br/>
            <span class="text-primary">Mua Sắm Có Ý Thức</span>
          </h1>
          <p class="text-lg text-white/90 mb-8 font-medium max-w-xl">
            Khám phá bộ sưu tập các sản phẩm không chứa nhựa thiết yếu của chúng tôi cho một ngôi nhà xanh hơn và một hành tinh khỏe mạnh hơn.
          </p>
          <RouterLink to="/" class="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg">
            Mua Sắm Ngay
            <span class="material-symbols-outlined ml-2">arrow_forward</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center mb-12">
        <h2 class="text-3xl font-bold mb-4 text-slate-900">Mua Sắm Theo Danh Mục</h2>
        <div class="h-1 w-24 bg-primary rounded-full"></div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="categories.length > 0" class="relative px-4 md:px-20">

        <button
          @click="prevPage"
          class="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-30 size-14 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/90 hover:text-white hover:border-transparent transition-all duration-300 ease-in-out hover:scale-125 hover:shadow-xl"
        >
          <span class="material-symbols-outlined text-2xl">chevron_left</span>
        </button>

        <div
          class="overflow-hidden py-8"
          @mouseenter="stopAutoPlay"
          @mouseleave="startAutoPlay"
        >
          <div
            class="flex transition-transform duration-700 ease-in-out"
            :style="{ transform: `translateX(-${currentPage * 100}%)` }"
          >
            <div
              v-for="(group, index) in chunkedCategories"
              :key="index"
              class="w-full shrink-0 px-2"
            >
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <RouterLink
                  v-for="category in group"
                  :key="category.id"
                  :to="`/category/${category.id}`"
                  class="group/card relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer shadow-md hover:shadow-2xl transition-all"
                >
                  <img
                    :alt="category.name"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    :src="getImageUrl(category.image)"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover/card:from-black/80 transition-colors duration-500"></div>

                  <div class="absolute bottom-8 left-8 right-8">
                    <h3 class="text-3xl font-bold text-white mb-3">{{ category.name }}</h3>
                    <span class="text-sm font-bold text-white/90 uppercase tracking-widest border-b-2 border-primary pb-1">Xem Bộ Sưu Tập</span>
                  </div>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <button
          @click="nextPage"
          class="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-30 size-14 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/90 hover:text-white hover:border-transparent transition-all duration-300 ease-in-out hover:scale-125 hover:shadow-xl"
        >
          <span class="material-symbols-outlined text-2xl">chevron_right</span>
        </button>
      </div>

      <div v-else class="text-center text-slate-500 py-10">
        Chưa có danh mục sản phẩm nào được tạo.
      </div>
    </section>

    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-10">
          <div>
            <h2 class="text-3xl font-bold mb-2 text-slate-900">Sản Phẩm Mới</h2>
            <p class="text-slate-500">Những sự bổ sung mới nhất cho danh mục thân thiện với môi trường</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div class="relative aspect-square mb-5 overflow-hidden rounded-xl bg-slate-50">
              <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdTveclGH-N5fdCnmSY1UEgQdHdoGrmBHLriBqdvxAAiJTdnfosjgYP3Ej_qVWZORjDaJB6LQTkO0P7bX1Mk7LubmJCsqZAGj_QGcfnK1n7gFloPucQdtfphKsrIyhO7b9CNTAVWN8H1qMKu7zQPWkSGh9VL5kLXSJKmEVkPS5exhc3gRI_gzZTQcLLCl6INvd9nYNvw-OBweSn8DgL4TShQbqqEgA8bmK-A4vsaAU3HWJNU8Qdq7SPq7v6mGaxEm6xl_gQ9eexqw" alt="Bàn chải"/>
            </div>
            <h4 class="font-bold text-slate-900 mb-1">Set Bàn Chải Tre</h4>
            <p class="text-primary font-bold">$12.99</p>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div class="relative aspect-square mb-5 overflow-hidden rounded-xl bg-slate-50">
              <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4xXtyqN2sCIQeQYHijinUVRUvwHNxJ7V-91DjpWM1tztr3LdoIA3tl3T8-2ZCBcsUlJ3IQx7p5qlV3YAG9T0xSFM8ZUzeGy9OgGkb7oMcxS5XQmhTTw4-H5jkkvTZxmW6obl6JvYL_xKXsCN4CmOhajfJqD03gEMXUC4lWacXCSnLT4bHPuduzEEd2QA1PQRaOUR9d88swL8qZ_6nzHzBP8BaNU0b3yySoYJJrzuGUhUs3LeypVP9NFDk665_lebX0QSFG_ZSH1Y" alt="Lọ thủy tinh"/>
            </div>
            <h4 class="font-bold text-slate-900 mb-1">Lọ Thủy Tinh (Set 3)</h4>
            <p class="text-primary font-bold">$24.50</p>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div class="relative aspect-square mb-5 overflow-hidden rounded-xl bg-slate-50">
              <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYD36oU415BRWPc7UVu3Ow1F4bnEdY2AEW8TcK0EvV7Af09ySwtOOEPeYHcgwmJo_p1MJEVtO9YX7bLrn10E27GgGpmTwWvvTbny5DbSRNdvVFWVB4lQq7R4CKW2MS5MmZsGV18mtLrx9_frUyiR4qJPJU7wOsLBvdBrpwNFxAJ4i_pyesjDONB1apC221o-JZ3OjWkg_hmPcKHjWIYILKcLR2CQP5jeDwSYCmDNpudfo21neGA_FVFpKyE-sEKb-fviLKFoz0Kxo" alt="Xà phòng"/>
            </div>
            <h4 class="font-bold text-slate-900 mb-1">Xà Phòng Hữu Cơ</h4>
            <p class="text-primary font-bold">$8.00</p>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div class="relative aspect-square mb-5 overflow-hidden rounded-xl bg-slate-50">
              <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFPdc_5GmsWjilmjAAHCj9OfGxqeNw0PT9ZmlxF54t_TBwueJu_rft85Gw0Xk5qk_W24e17hX1u7vUNP4FCn6fwNLiGqq_pn9F7KIP-2c3Hmvfn4ulDHDT2A3FY_wtEJw3pzgyJhTXz9REqEskZbu7dhIUEl8GiZPjhaCBaqPzhkLVbMiKlVoCROlXgPb6SsxoxogQcncGsbWDWmTy4lr6RpGUABiC3ApxBVJtTb2K0PsUN_C9iK2G30PiHt_d9vaYhnuNkVAHgFc" alt="Hộp cơm"/>
            </div>
            <h4 class="font-bold text-slate-900 mb-1">Hộp Cơm Thép Không Gỉ</h4>
            <p class="text-primary font-bold">$32.00</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-[#eef2e6] rounded-[2.5rem] p-12 md:p-20 text-center shadow-sm">
        <h2 class="text-3xl md:text-4xl font-bold mb-16 text-slate-900">Tại Sao Chọn Zero-Waste?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="flex flex-col items-center">
            <div class="size-20 bg-primary text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
              <span class="material-symbols-outlined text-4xl">energy_savings_leaf</span>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900">Thân Thiện Môi Trường</h3>
            <p class="text-slate-600 leading-relaxed">Nguyên liệu được khai thác bền vững, tôn trọng tự nhiên và bảo tồn đa dạng sinh học.</p>
          </div>
          <div class="flex flex-col items-center">
            <div class="size-20 bg-primary text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
              <span class="material-symbols-outlined text-4xl">recycling</span>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900">Giảm Thiểu Nhựa</h3>
            <p class="text-slate-600 leading-relaxed">Loại bỏ nhựa dùng một lần bằng các giải pháp thay thế bền bỉ, có thể tái sử dụng.</p>
          </div>
          <div class="flex flex-col items-center">
            <div class="size-20 bg-primary text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
              <span class="material-symbols-outlined text-4xl">science</span>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900">Thành Phần Tự Nhiên</h3>
            <p class="text-slate-600 leading-relaxed">Công thức sạch, không hóa chất độc hại, an toàn tuyệt đối cho gia đình bạn.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
