<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import api from '@/service/api.ts'

const products = ref<any[]>([])
const categories = ref<any[]>([])
const variantMap = ref<Map<number, any[]>>(new Map())
const loading = ref(true)
const route = useRoute()
const searchQuery = ref('')

const getImageUrl = (path: string | null) => {
  if (!path) return 'https://via.placeholder.com/300x300?text=Không+có+ảnh'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
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

    const res = await api.get(url)
    products.value = res.data

    const variantRes = await api.get('/product-variant')
    const allVariants = variantRes.data
    const map = new Map<number, any[]>()
    allVariants.forEach((v: any) => {
      if (!map.has(v.productId)) map.set(v.productId, [])
      map.get(v.productId)!.push(v)
    })
    variantMap.value = map
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value
  const q = searchQuery.value.toLowerCase().trim()
  return products.value.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)),
  )
})

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

const getLowestPrice = (productId: number) => {
  const variants = variantMap.value.get(productId) || []
  if (variants.length === 0) return null
  const prices = variants.map((v: any) => Number(v.price))
  return Math.min(...prices)
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 py-10">
    <div class="flex gap-8">
      <div class="w-64 hidden lg:block">
        <h3 class="font-bold text-lg mb-4 text-[#658a22]">Danh mục</h3>
        <ul class="space-y-2">
          <li v-for="cat in categories" :key="cat.id">
            <RouterLink
              :to="`/products?category=${cat.id}`"
              class="block py-2 px-3 text-[#658a22] hover:bg-[#658a22]/10 hover:text-[#58791d] rounded-xl transition-colors font-medium"
              :class="{ 'bg-[#658a22]/10 font-semibold': route.query.category == cat.id }"
            >
              {{ cat.name }}
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/products"
              class="block py-2 px-3 text-[#658a22] hover:bg-[#658a22]/10 hover:text-[#58791d] rounded-xl transition-colors font-medium"
              :class="{ 'bg-[#658a22]/10 font-semibold': !route.query.category }"
            >
              Tất cả sản phẩm
            </RouterLink>
          </li>
        </ul>
      </div>

      <div class="flex-1">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-black text-slate-900">Tất cả sản phẩm</h1>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm sản phẩm..."
            class="w-80 border-2 border-slate-300 rounded-2xl px-5 py-3 focus:border-[#658a22] focus:ring-2 focus:ring-[#658a22]/30 outline-none transition-all text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div v-if="loading" class="text-center py-20 text-slate-600">Đang tải...</div>
        <div v-else-if="filteredProducts.length === 0" class="text-center py-20 text-slate-500">
          Không tìm thấy sản phẩm nào phù hợp.
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-md transition-all group flex flex-col"
          >
            <div class="aspect-square relative overflow-hidden bg-slate-50">
              <img
                :src="getImageUrl(product.mainImage)"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt="main image"
                loading="lazy"
              />
              <div
                v-if="product.status === 'OUT_OF_STOCK'"
                class="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium"
              >
                Hết hàng
              </div>
            </div>

            <div class="p-5 flex flex-col flex-grow">
              <h4 class="font-bold text-slate-900 text-base mb-2 line-clamp-2">
                {{ product.name }}
              </h4>
              <p class="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">
                {{
                  product.description || 'Sản phẩm thân thiện với môi trường, chất liệu bền vững.'
                }}
              </p>

              <div class="mt-auto">
                <div class="flex items-baseline gap-2 mb-4">
                  <span class="text-2xl font-bold text-[#658a22]">
                    <template v-if="variantMap.get(product.id)?.length > 0">
                      {{ getLowestPrice(product.id)?.toLocaleString('vi-VN') }}đ
                    </template>
                    <template v-else> Liên hệ </template>
                  </span>
                </div>

                <RouterLink
                  :to="`/product/${product.id}`"
                  class="block w-full bg-[#658a22] hover:bg-[#58791d] text-white text-center py-3 rounded-2xl font-semibold transition-all text-sm"
                >
                  Xem chi tiết
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
