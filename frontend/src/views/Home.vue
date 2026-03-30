<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Category } from '@/service/category.ts'

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
  currentPage.value = (currentPage.value + 1) % totalPages.value
}

const prevPage = () => {
  currentPage.value = (currentPage.value - 1 + totalPages.value) % totalPages.value
}

// --- AUTO-PLAY ---
const autoPlayInterval = ref<number | null>(null)

const startAutoPlay = () => {
  if (autoPlayInterval.value) clearInterval(autoPlayInterval.value)
  autoPlayInterval.value = setInterval(nextPage, 3000)
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
    const data = await Category.getAllCategories()
    categories.value = data
  } catch (error) {
    console.error('Lỗi khi tải danh mục:', error)
  } finally {
    isLoading.value = false
  }
}

const BACKEND_URL = 'http://localhost:3000'

const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) {
    return 'https://placehold.co/600x400/eef2e6/658a22?text=Zero+Waste'
  }
  return `${BACKEND_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
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
  <div class="bg-transparent min-h-screen">
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
            to="/products"
            class="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Mua Sắm Ngay
            <span class="material-symbols-outlined ml-2">arrow_forward</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <section
      class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-md rounded-3xl my-10"
    >
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

        <div class="overflow-hidden py-8" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
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
                  :to="`/products?category=${category.id}`"
                  class="group/card relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer shadow-md hover:shadow-2xl transition-all"
                >
                  <img
                    :alt="category.name"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    :src="getImageUrl(category.image)"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover/card:from-black/80 transition-colors duration-500"
                  ></div>

                  <div class="absolute bottom-8 left-8 right-8">
                    <h3 class="text-3xl font-bold text-white mb-3">{{ category.name }}</h3>
                    <span
                      class="text-sm font-bold text-white/90 uppercase tracking-widest border-b-2 border-primary pb-1"
                    >
                      Xem Bộ Sưu Tập
                    </span>
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

    <section class="py-20 bg-white/20 backdrop-blur-sm">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm"
      >
        <div class="flex justify-between items-end mb-10">
          <div>
            <h2 class="text-3xl font-bold mb-2 text-slate-900">Sản Phẩm Mới</h2>
            <p class="text-slate-500">
              Những sự bổ sung mới nhất cho danh mục thân thiện với môi trường
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <p class="text-primary font-bold">129.000đ</p>
          </div>

          <!-- Các sản phẩm mới khác giữ nguyên -->
        </div>
      </div>
    </section>

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
