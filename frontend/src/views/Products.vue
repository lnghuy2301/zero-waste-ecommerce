<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import api from '@/service/api.ts'

const products = ref<any[]>([])
const categories = ref<any[]>([])
const variantMap = ref<Map<number, any[]>>(new Map())
const promotions = ref<any[]>([])
const loading = ref(true)
const route = useRoute()
const searchQuery = ref('')

// Lưu biến thể đang chọn
const selectedVariants = ref<Map<number, any>>(new Map())

// Sort options
const sortOption = ref('newest') // mặc định: mới nhất

const getImageUrl = (path: string | null) => {
  if (!path) return 'https://via.placeholder.com/300x300?text=Không+có+ảnh'
  return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`
}

const fetchCategories = async () => {
  try {
    const res = await api.get('/category')
    categories.value = res.data
  } catch (e) {
    console.error(e)
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
      if (variants.length > 0) {
        initialSelected.set(p.id, variants[0])
      }
    })

    variantMap.value = map
    selectedVariants.value = initialSelected
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const filteredAndSortedProducts = computed(() => {
  let list = [...products.value]

  // Lọc theo tìm kiếm
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)),
    )
  }

  // Sắp xếp
  if (sortOption.value === 'price-asc') {
    list.sort((a, b) => {
      const priceA = getLowestPrice(a.id) || Infinity
      const priceB = getLowestPrice(b.id) || Infinity
      return priceA - priceB
    })
  } else if (sortOption.value === 'price-desc') {
    list.sort((a, b) => {
      const priceA = getLowestPrice(a.id) || -Infinity
      const priceB = getLowestPrice(b.id) || -Infinity
      return priceB - priceA
    })
  } else if (sortOption.value === 'newest') {
    list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  } else if (sortOption.value === 'reviews-desc') {
    list.sort((a, b) => (b.soLuongDanhGia || 0) - (a.soLuongDanhGia || 0))
  } else if (sortOption.value === 'rating-desc') {
    list.sort((a, b) => (b.danhGiaTrungBinh || 0) - (a.danhGiaTrungBinh || 0))
  }

  return list
})

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

  const promo = promotions.value.find((p) => p.id === variant.promotionId)
  if (!promo || !promo.isActive) return Number(variant.price)

  let finalPrice = Number(variant.price)
  if (promo.discountType === 'PERCENT') {
    finalPrice *= 1 - Number(promo.discountValue) / 100
  } else if (promo.discountType === 'FIXED_AMOUNT') {
    finalPrice -= Number(promo.discountValue)
  }

  return Math.max(0, finalPrice)
}

watch(
  () => route.query.category,
  () => {
    fetchProducts()
  },
)

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 py-10 font-sans selection:bg-red-100 selection:text-red-600">
    <div class="flex flex-col lg:flex-row gap-10">
      <!-- Sidebar Danh mục -->
      <aside class="w-full lg:w-72 flex-shrink-0">
        <div
          class="sticky top-24 bg-background-light p-6 rounded-3xl border border-slate-100 shadow-sm"
        >
          <h3 class="font-black text-xl mb-6 text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-red-600">category</span>
            Danh mục
          </h3>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/products"
                class="flex items-center justify-between py-3 px-4 rounded-2xl transition-all font-bold text-[15px]"
                :class="[
                  !route.query.category
                    ? 'bg-red-50 text-red-600'
                    : 'text-slate-600 hover:bg-slate-50',
                ]"
              >
                Tất cả sản phẩm
                <span
                  v-if="!route.query.category"
                  class="w-1.5 h-1.5 rounded-full bg-red-600"
                ></span>
              </RouterLink>
            </li>
            <li v-for="cat in categories" :key="cat.id">
              <RouterLink
                :to="`/products?category=${cat.id}`"
                class="flex items-center justify-between py-3 px-4 rounded-2xl transition-all font-bold text-[15px]"
                :class="[
                  route.query.category == cat.id
                    ? 'bg-red-50 text-red-600'
                    : 'text-slate-600 hover:bg-slate-50',
                ]"
              >
                {{ cat.name }}
                <span
                  v-if="route.query.category == cat.id"
                  class="w-1.5 h-1.5 rounded-full bg-red-600"
                ></span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Danh sách sản phẩm -->
      <div class="flex-1">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10"
        >
          <div>
            <h1 class="text-4xl font-black text-slate-900 tracking-tight">Cửa hàng</h1>
            <p class="text-slate-500 mt-1 font-medium">
              Khám phá các sản phẩm thân thiện môi trường
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div class="relative flex-1 md:w-80">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                >search</span
              >
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Bạn đang tìm gì hôm nay?"
                class="w-full border-2 border-slate-300 bg-white text-slate-900 rounded-2xl pl-12 pr-5 py-3 focus:border-red-600 focus:ring-4 focus:ring-red-600/20 outline-none transition-all font-medium placeholder:text-slate-400"
              />
            </div>

            <!-- Sắp xếp -->
            <select
              v-model="sortOption"
              class="w-full sm:w-48 border-2 border-slate-300 bg-white text-slate-900 rounded-2xl px-4 py-3 focus:border-red-600 focus:ring-4 focus:ring-red-600/20 outline-none transition-all font-medium"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
              <option value="reviews-desc">Nhiều đánh giá nhất</option>
              <option value="rating-desc">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-32 text-slate-400">
          <div
            class="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"
          ></div>
          <p class="font-bold">Đang tải bộ sưu tập...</p>
        </div>

        <div
          v-else-if="filteredAndSortedProducts.length === 0"
          class="text-center py-20 text-slate-500"
        >
          Không tìm thấy sản phẩm nào phù hợp.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div
            v-for="product in filteredAndSortedProducts"
            :key="product.id"
            class="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-red-900/5 transition-all duration-500 flex flex-col p-4"
          >
            <!-- Hình ảnh -->
            <div class="aspect-square relative overflow-hidden rounded-[1.5rem] bg-slate-100 mb-5">
              <img
                :src="getImageUrl(product.mainImage)"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="product image"
              />
              <div class="absolute top-3 right-3">
                <button
                  class="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-900 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  <span class="material-symbols-outlined text-[20px]">favorite</span>
                </button>
              </div>
            </div>

            <div class="flex flex-col flex-grow px-2">
              <h4
                class="font-black text-slate-900 text-xl mb-2 line-clamp-1 group-hover:text-red-600 transition-colors"
              >
                {{ product.name }}
              </h4>

              <!-- Chọn biến thể -->
              <div v-if="variantMap.get(product.id)?.length" class="mb-5">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="variant in variantMap.get(product.id)"
                    :key="variant.id"
                    @click="handleVariantChange(product.id, variant)"
                    :class="[
                      'px-3 py-1.5 text-[11px] font-black rounded-xl border-2 transition-all uppercase tracking-wider',
                      selectedVariants.get(product.id)?.id === variant.id
                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                        : 'border-slate-100 text-slate-500 hover:border-slate-300',
                    ]"
                  >
                    {{ variant.name }}
                  </button>
                </div>
              </div>

              <!-- Giá (gạch ngang gốc + giá sau giảm) -->
              <div class="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest"
                    >Giá bán</span
                  >
                  <div class="flex items-baseline gap-2">
                    <span
                      v-if="
                        selectedVariants.has(product.id) &&
                        selectedVariants.get(product.id).promotionId
                      "
                      class="text-sm text-slate-400 line-through"
                    >
                      {{ Number(selectedVariants.get(product.id).price).toLocaleString('vi-VN') }}đ
                    </span>
                    <span class="text-2xl font-black text-red-600">
                      <template v-if="selectedVariants.has(product.id)">
                        {{
                          Number(
                            getDiscountedPrice(selectedVariants.get(product.id)),
                          ).toLocaleString('vi-VN')
                        }}đ
                      </template>
                      <template v-else>Liên hệ</template>
                    </span>
                  </div>
                </div>

                <RouterLink
                  :to="`/product/${product.id}`"
                  class="bg-slate-100 hover:bg-red-600 text-slate-900 hover:text-white p-3 rounded-2xl transition-all group/btn"
                >
                  <span
                    class="material-symbols-outlined font-bold group-hover/btn:translate-x-1 transition-transform"
                    >arrow_forward</span
                  >
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

.font-sans {
  font-family: 'Inter', sans-serif;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
