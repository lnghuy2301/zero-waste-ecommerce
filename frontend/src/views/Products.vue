<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import api from '@/service/api.ts'

const products = ref<any[]>([])
const categories = ref<any[]>([])
const variantMap = ref<Map<number, any[]>>(new Map())
const promotions = ref<any[]>([])
const loading = ref(true)
const route = useRoute()
const router = useRouter()
const searchQuery = ref('')

const selectedVariants = ref<Map<number, any>>(new Map())
const sortOption = ref('newest')
const showOnlyPromotion = ref(false)

const currentPage = ref(1)
const itemsPerPage = 15

// --- QUẢN LÝ SIDEBAR ---
const isCategoryOpen = ref(false)

const getImageUrl = (path: string | null) => {
  if (!path) return 'https://via.placeholder.com/300x300?text=No+Image'
  return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`
}

const fetchCategories = async () => {
  try {
    const res = await api.get('/category')
    categories.value = res.data
  } catch (e) {
    console.error('Lỗi lấy danh mục:', e)
  }
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const categoryId = route.query.category
    let url = '/product'
    if (categoryId) url += `?categoryId=${categoryId}`

    const [prodRes, variantRes, promoRes] = await Promise.all([
      api.get(url),
      api.get('/product-variant'),
      api.get('/promotion'),
    ])

    products.value = prodRes.data
    const allVariants = variantRes.data
    promotions.value = promoRes.data

    const map = new Map<number, any[]>()
    const initialSelected = new Map<number, any>()

    allVariants.forEach((v: any) => {
      if (!map.has(v.productId)) map.set(v.productId, [])
      map.get(v.productId)!.push(v)
    })

    products.value.forEach((p) => {
      const variants = map.get(p.id) || []
      if (variants.length > 0) initialSelected.set(p.id, variants[0])
    })

    variantMap.value = map
    selectedVariants.value = initialSelected
    currentPage.value = 1
  } catch (e) {
    console.error('Lỗi lấy sản phẩm:', e)
  } finally {
    loading.value = false
  }
}

const filteredAndSortedProducts = computed(() => {
  let list = [...products.value]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(p => p.name.toLowerCase().includes(q))
  }
  if (sortOption.value === 'price-asc') {
    list.sort((a, b) => (getLowestPrice(a.id) || Infinity) - (getLowestPrice(b.id) || Infinity))
  } else if (sortOption.value === 'price-desc') {
    list.sort((a, b) => (getLowestPrice(b.id) || -Infinity) - (getLowestPrice(a.id) || -Infinity))
  } else {
    list.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
  }
  return list
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredAndSortedProducts.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredAndSortedProducts.value.length / itemsPerPage))

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleVariantChange = (productId: number, variant: any) => {
  selectedVariants.value.set(productId, variant)
}

const getLowestPrice = (productId: number) => {
  const variants = variantMap.value.get(productId) || []
  if (variants.length === 0) return null
  let minPrice = Infinity
  for (const v of variants) {
    const discounted = getDiscountedPrice(v)
    if (discounted < minPrice) minPrice = discounted
  }
  return minPrice === Infinity ? null : minPrice
}

const getDiscountedPrice = (variant: any) => {
  if (!variant.promotionId) return Number(variant.price)
  const promo = promotions.value.find(p => p.id === variant.promotionId)
  if (!promo || !promo.isActive) return Number(variant.price)
  let finalPrice = Number(variant.price)
  if (promo.discountType === 'PERCENT') finalPrice *= (1 - Number(promo.discountValue) / 100)
  else if (promo.discountType === 'FIXED_AMOUNT') finalPrice -= Number(promo.discountValue)
  return Math.max(0, finalPrice)
}

watch(() => route.query.category, () => {
  fetchProducts()
  isCategoryOpen.value = false
})

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<template>
  <div class="font-inter">
    <transition name="fade">
      <div
        v-if="isCategoryOpen"
        @click="isCategoryOpen = false"
        class="fixed inset-0 top-[80px] bg-slate-900/40 backdrop-blur-sm z-[30]"
      ></div>
    </transition>

<<<<<<< HEAD
    <!-- Sidebar Danh mục (slide-in mobile + desktop) -->
    <!-- Sidebar Danh mục (slide-in mobile + desktop) -->
    <aside
      class="fixed top-16 left-0 h-[calc(100vh-64px)] w-80 max-w-full bg-white z-40 shadow-[20px_0_40px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out overflow-y-auto"
=======
    <aside
      class="fixed top-[80px] left-0 w-80 max-w-full bg-white z-[40] shadow-[20px_0_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out overflow-y-auto h-[calc(100vh-80px)]"
>>>>>>> 0cf8cd5ae488f71b94585f8078e962e4d7f1828e
      :class="isCategoryOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="p-8">
        <div class="flex items-center justify-between mb-8">
          <h3 class="font-black text-2xl text-slate-800 flex items-center gap-3 uppercase tracking-tight italic">
            <span class="w-10 h-10 bg-[#f4f7ee] text-[#658a22] rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">category</span>
            </span>
            Danh mục
          </h3>
          <button @click="isCategoryOpen = false" class="lg:hidden text-slate-400 hover:text-red-500">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <ul class="space-y-3">
          <li>
            <RouterLink
              to="/products"
              class="flex items-center justify-between py-4 px-6 rounded-2xl font-bold text-sm uppercase transition-all"
              :class="[!route.query.category ? 'bg-[#658a22] text-white shadow-lg shadow-[#658a22]/20' : 'bg-slate-50 text-slate-600 hover:bg-[#f4f7ee] hover:text-[#658a22]']"
            >
              Tất cả sản phẩm
              <span v-if="!route.query.category" class="material-symbols-outlined text-sm">check_circle</span>
            </RouterLink>
          </li>
          <li v-for="cat in categories" :key="cat.id">
            <RouterLink
              :to="`/products?category=${cat.id}`"
              class="flex items-center justify-between py-4 px-6 rounded-2xl font-bold text-sm uppercase transition-all"
              :class="[route.query.category == cat.id ? 'bg-[#658a22] text-white shadow-lg shadow-[#658a22]/20' : 'bg-slate-50 text-slate-600 hover:bg-[#f4f7ee] hover:text-[#658a22]']"
            >
              {{ cat.name }}
              <span v-if="route.query.category == cat.id" class="material-symbols-outlined text-sm">check_circle</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </aside>

    <main class="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 border-b border-slate-100 pb-8">
        <div>
          <h1 class="text-4xl font-black text-slate-900 uppercase italic tracking-tight">
            Cửa Hàng <span class="text-[#658a22]">Xanh</span>
          </h1>
          <p class="text-slate-500 mt-1 font-medium italic">Khám phá {{ filteredAndSortedProducts.length }} lựa chọn bền vững</p>
        </div>

        <div class="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <button
            @click="isCategoryOpen = !isCategoryOpen"
            class="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
          >
            <span class="material-symbols-outlined">filter_list</span>
            LỌC DANH MỤC
          </button>

          <div class="relative flex-grow sm:flex-grow-0 sm:w-64">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              class="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:border-[#658a22] outline-none transition-all font-bold text-sm"
            />
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20">
        <span class="material-symbols-outlined text-4xl animate-spin text-[#658a22]">progress_activity</span>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="product in paginatedProducts" :key="product.id"
             class="group bg-white rounded-[32px] p-4 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">

          <div class="aspect-square rounded-[24px] overflow-hidden bg-slate-50 mb-5 cursor-pointer" @click="router.push(`/product/${product.id}`)">
            <img :src="getImageUrl(product.mainImage)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>

          <RouterLink :to="`/product/${product.id}`" class="font-black text-slate-800 text-sm mb-3 line-clamp-2 hover:text-[#658a22] transition-colors h-10">
            {{ product.name }}
          </RouterLink>

          <div class="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá bán</span>
              <span class="text-[17px] font-black text-[#d00000]">
                {{ Number(getDiscountedPrice(selectedVariants.get(product.id) || {})).toLocaleString('vi-VN') }}đ
              </span>
            </div>
            <RouterLink :to="`/product/${product.id}`" class="w-10 h-10 rounded-2xl bg-[#f4f7ee] text-[#658a22] flex items-center justify-center hover:bg-[#658a22] hover:text-white transition-all">
              <span class="material-symbols-outlined text-sm">add</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="mt-16 flex justify-center gap-2">
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
                :class="['w-12 h-12 rounded-2xl font-black transition-all border', currentPage === page ? 'bg-[#658a22] text-white border-[#658a22]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#658a22]']">
          {{ page }}
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
.font-inter { font-family: 'Inter', sans-serif; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

aside::-webkit-scrollbar { width: 4px; }
aside::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
