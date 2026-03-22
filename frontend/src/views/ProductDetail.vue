<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import api from '@/service/api.ts'

const route = useRoute()
const product = ref<any>(null)
const variants = ref<any[]>([])
const selectedVariant = ref<any>(null)
const giftProducts = ref<any[]>([]) // Danh sách sản phẩm tặng kèm (Category 6)
const loading = ref(true)
const quantity = ref(1)

const getImageUrl = (path: string | null) => {
  if (!path) return 'https://via.placeholder.com/400x400?text=Không+có+ảnh'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`
}

const fetchData = async () => {
  const id = Number(route.params.id)
  if (!id) return

  loading.value = true
  try {
    // 1. Lấy chi tiết sản phẩm
    const prodRes = await api.get(`/product/${id}`)
    product.value = prodRes.data

    // 2. Lấy biến thể của sản phẩm
    const variantRes = await api.get('/product-variant')
    const allVariants = variantRes.data.filter((v: any) => v.productId === id)
    variants.value = allVariants

    // Mặc định chọn biến thể đầu tiên
    if (allVariants.length > 0) {
      selectedVariant.value = allVariants[0]
    }

    // 3. Lấy sản phẩm tặng kèm (Danh mục id = 6 - Set Quà Tặng)
    const allProdRes = await api.get('/product?categoryId=6')
    giftProducts.value = allProdRes.data.slice(0, 4) // Lấy 4 cái đầu làm quà tặng demo
  } catch (e) {
    console.error('Lỗi khi tải dữ liệu:', e)
  } finally {
    loading.value = false
  }
}

const selectVariant = (v: any) => {
  selectedVariant.value = v
}

const updateQuantity = (val: number) => {
  if (quantity.value + val < 1) return
  quantity.value += val
}

onMounted(fetchData)

// Theo dõi sự thay đổi ID trên URL để tải lại dữ liệu nếu người dùng nhấn vào sản phẩm khác
watch(() => route.params.id, fetchData)
</script>

<template>
  <main class="mx-auto max-w-[1200px] w-full px-4 py-8 sm:px-6 lg:px-8">
    <div v-if="loading" class="text-center py-20 text-slate-600">
      <div
        class="animate-spin inline-block w-8 h-8 border-4 border-[#658a22] border-t-transparent rounded-full mb-4"
      ></div>
      <p>Đang tải thông tin sản phẩm...</p>
    </div>

    <div v-else-if="!product" class="text-center py-20 text-slate-500">Không tìm thấy sản phẩm</div>

    <div v-else>
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
        <RouterLink to="/" class="hover:text-[#658a22] transition-colors">Trang Chủ</RouterLink>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <RouterLink
          :to="`/products?category=${product.categoryId}`"
          class="hover:text-[#658a22] transition-colors"
        >
          {{ product.category?.name || 'Danh mục' }}
        </RouterLink>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <span class="text-slate-900 font-semibold">{{ product.name }}</span>
      </nav>

      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100"
      >
        <!-- Cột Trái: Ảnh Sản Phẩm -->
        <div class="flex flex-col gap-4">
          <div
            class="aspect-square w-full bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-slate-100"
          >
            <img
              :src="getImageUrl(product.mainImage)"
              :alt="product.name"
              class="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
            />
          </div>
        </div>

        <!-- Cột Phải: Thông tin Sản Phẩm -->
        <div class="flex flex-col gap-6">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-slate-900 mb-2">
              {{ product.name }}
            </h1>

            <!-- Giá thay đổi theo biến thể -->
            <div class="flex items-baseline gap-3 mt-4">
              <p class="text-4xl font-black text-[#658a22]">
                <template v-if="selectedVariant">
                  {{ Number(selectedVariant.price).toLocaleString('vi-VN') }}đ
                </template>
                <template v-else>Liên hệ</template>
              </p>
              <span v-if="selectedVariant?.sku" class="text-xs text-slate-400 font-mono"
                >SKU: {{ selectedVariant.sku }}</span
              >
            </div>
          </div>

          <!-- Lựa chọn biến thể -->
          <div v-if="variants.length > 0" class="space-y-4 py-4 border-t border-slate-100">
            <p class="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Chọn loại sản phẩm:
            </p>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="v in variants"
                :key="v.id"
                @click="selectVariant(v)"
                :class="[
                  'px-5 py-2.5 rounded-xl border-2 font-semibold transition-all text-sm',
                  selectedVariant?.id === v.id
                    ? 'border-[#658a22] bg-[#658a22]/5 text-[#658a22]'
                    : 'border-slate-100 text-slate-600 hover:border-slate-300',
                ]"
              >
                {{ v.name }}
                <span class="block text-[10px] opacity-60 font-normal">
                  {{ v.color }} {{ v.size ? `- ${v.size}` : '' }}
                </span>
              </button>
            </div>
          </div>

          <div class="text-slate-600 leading-relaxed">
            {{ product.description || 'Sản phẩm thân thiện với môi trường, chất liệu bền vững.' }}
          </div>

          <!-- Hành động -->
          <div class="flex flex-col gap-5 py-6 border-y border-slate-100 mt-auto">
            <div class="flex items-center gap-4">
              <!-- Số lượng -->
              <div class="flex items-center border-2 border-slate-100 rounded-2xl bg-slate-50 h-14">
                <button @click="updateQuantity(-1)" class="px-4 hover:text-[#658a22]">
                  <span class="material-symbols-outlined">remove</span>
                </button>
                <span class="w-8 text-center font-bold text-lg">{{ quantity }}</span>
                <button @click="updateQuantity(1)" class="px-4 hover:text-[#658a22]">
                  <span class="material-symbols-outlined">add</span>
                </button>
              </div>

              <button
                class="flex-1 bg-[#658a22] hover:bg-[#58791d] text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#658a22]/20 active:scale-95"
              >
                <span class="material-symbols-outlined">shopping_cart</span>
                THÊM VÀO GIỎ HÀNG
              </button>
            </div>
          </div>

          <!-- Thông số nhanh -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
              <span class="material-symbols-outlined text-[#658a22]">eco</span>
              <span class="text-xs font-medium text-slate-600"
                >Eco-friendly {{ product.ecoFriendliness }}/10</span
              >
            </div>
            <div class="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
              <span class="material-symbols-outlined text-[#658a22]">reusable_roll</span>
              <span class="text-xs font-medium text-slate-600">{{
                product.reusability || 'Tái sử dụng'
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sản phẩm tặng kèm (Danh mục 6) -->
      <section v-if="giftProducts.length > 0" class="mt-20 mb-10">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-2xl font-black text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-red-500">featured_seasonal</span>
            Sản Phẩm Tặng Kèm
          </h3>
          <span class="text-sm font-medium text-slate-400"
            >(Áp dụng cho đơn hàng từ 2.000.000đ)</span
          >
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <RouterLink
            v-for="gift in giftProducts"
            :key="gift.id"
            :to="`/product/${gift.id}`"
            class="group bg-white p-4 rounded-3xl border border-slate-100 hover:border-[#658a22] transition-all"
          >
            <div class="aspect-square rounded-2xl bg-slate-50 overflow-hidden mb-4 relative">
              <img
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                :src="getImageUrl(gift.mainImage)"
                alt="Gift Image"
              />
              <div
                class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg"
              >
                QUÀ TẶNG
              </div>
            </div>
            <p class="font-bold text-slate-900 text-sm mb-1 truncate">{{ gift.name }}</p>
            <p class="text-[#658a22] font-semibold text-xs">
              Giá trị: {{ Number(650000).toLocaleString('vi-VN') }}đ
            </p>
          </RouterLink>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* Bạn có thể thêm các hiệu ứng CSS tại đây nếu cần */
</style>
