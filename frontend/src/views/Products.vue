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

// Lưu trữ biến thể đang được chọn cho mỗi sản phẩm
const selectedVariants = ref<Map<number, any>>(new Map())

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

    const [prodRes, variantRes] = await Promise.all([api.get(url), api.get('/product-variant')])

    products.value = prodRes.data
    const allVariants = variantRes.data

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

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value
  const q = searchQuery.value.toLowerCase().trim()
  return products.value.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)),
  )
})

const handleVariantChange = (productId: number, variant: any) => {
  selectedVariants.value.set(productId, variant)
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
  <!-- Nhúng font Inter để giao diện mượt mà hơn -->
  <main class="max-w-7xl mx-auto px-4 py-10 font-sans selection:bg-red-100 selection:text-red-600">
    <div class="flex flex-col lg:flex-row gap-10">
      <!-- Sidebar Danh mục -->
      <aside class="w-full lg:w-72 flex-shrink-0">
        <div class="sticky top-24 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
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

          <div class="relative w-full md:w-96">
            <span
              class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              >search</span
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Bạn đang tìm gì hôm nay?"
              class="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl pl-12 pr-5 py-3.5 focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/5 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-32 text-slate-400">
          <div
            class="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"
          ></div>
          <p class="font-bold">Đang tải bộ sưu tập...</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div
            v-for="product in filteredProducts"
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

              <!-- Giá và Nút bấm -->
              <div class="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest"
                    >Giá bán</span
                  >
                  <span class="text-2xl font-black text-red-600">
                    <template v-if="selectedVariants.has(product.id)">
                      {{ Number(selectedVariants.get(product.id).price).toLocaleString('vi-VN') }}đ
                    </template>
                    <template v-else>Liên hệ</template>
                  </span>
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
