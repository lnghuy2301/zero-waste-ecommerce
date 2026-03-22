<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import api from '@/service/api.ts'

const route = useRoute()
const product = ref<any>(null)
const variants = ref<any[]>([])
const selectedVariant = ref<any>(null)
const promotions = ref<any[]>([]) // Lấy tất cả promotion để tính giảm
const giftProducts = ref<any[]>([])
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
    const [prodRes, variantRes, promoRes, bundleRes] = await Promise.all([
      api.get(`/product/${id}`),
      api.get('/product-variant'),
      api.get('/promotion'),
      api.get(`/bundle-item?bundleProductId=${id}`),
    ])

    product.value = prodRes.data
    variants.value = variantRes.data.filter((v: any) => v.productId === id)
    promotions.value = promoRes.data

    if (variants.value.length > 0) {
      selectedVariant.value = variants.value[0]
    }

    giftProducts.value = []
    for (const b of bundleRes.data) {
      const variantRes = await api.get(`/product-variant/${b.componentVariantId}`)
      const variant = variantRes.data

      const giftProdRes = await api.get(`/product/${variant.productId}`)
      const giftProduct = giftProdRes.data

      giftProducts.value.push({
        ...giftProduct,
        variantName: variant.name,
        variantPrice: Number(variant.price),
        quantity: b.quantity,
        bundleImage: b.image || giftProduct.mainImage,
      })
    }
  } catch (e) {
    console.error('Lỗi tải dữ liệu:', e)
  } finally {
    loading.value = false
  }
}

const getDiscountedPrice = (variant: any) => {
  if (!variant.promotionId) return variant.price

  const promo = promotions.value.find((p) => p.id === variant.promotionId)
  if (!promo || !promo.isActive) return variant.price

  let finalPrice = Number(variant.price)
  if (promo.discountType === 'PERCENT') {
    finalPrice *= 1 - Number(promo.discountValue) / 100
  } else if (promo.discountType === 'FIXED_AMOUNT') {
    finalPrice -= Number(promo.discountValue)
  }

  return Math.max(0, finalPrice)
}

const updateQuantity = (val: number) => {
  if (quantity.value + val < 1) return
  quantity.value += val
}

onMounted(fetchData)
watch(() => route.params.id, fetchData)
</script>

<template>
  <main class="mx-auto max-w-[1200px] w-full px-4 py-8 font-sans">
    <div v-if="loading" class="text-center py-20 text-slate-600">
      <p class="text-lg">Đang tải thông tin...</p>
    </div>

    <div v-else-if="!product" class="text-center py-20 text-slate-500 text-xl">
      Không tìm thấy sản phẩm
    </div>

    <div v-else>
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 mb-6 text-[15px] font-medium text-slate-500">
        <RouterLink to="/" class="hover:text-red-600">Trang Chủ</RouterLink>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <span class="text-slate-900 font-bold">{{ product.name }}</span>
      </nav>

      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-100"
      >
        <!-- Cột Trái: Ảnh -->
        <div class="space-y-4">
          <div
            class="aspect-square w-full bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200"
          >
            <img :src="getImageUrl(product.mainImage)" class="w-[85%] h-[85%] object-contain" />
          </div>
        </div>

        <!-- Cột Phải: Nội dung -->
        <div class="flex flex-col gap-6">
          <h1 class="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            {{ product.name }}
          </h1>

          <!-- GIÁ (gạch ngang gốc + giá sau giảm) -->
          <div class="flex items-center gap-4">
            <div class="flex items-baseline gap-3">
              <p
                v-if="selectedVariant && selectedVariant.promotionId"
                class="text-2xl text-slate-400 line-through"
              >
                {{ Number(selectedVariant.price).toLocaleString('vi-VN') }}đ
              </p>
              <p class="text-4xl font-extrabold text-red-600">
                {{
                  selectedVariant
                    ? Number(getDiscountedPrice(selectedVariant)).toLocaleString('vi-VN')
                    : '---'
                }}đ
              </p>
            </div>
            <span
              v-if="selectedVariant && selectedVariant.promotionId"
              class="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded"
            >
              GIẢM {{ promotions.find((p) => p.id === selectedVariant.promotionId)?.discountValue
              }}{{
                promotions.find((p) => p.id === selectedVariant.promotionId)?.discountType ===
                'PERCENT'
                  ? '%'
                  : 'đ'
              }}
            </span>
            <span v-else class="px-2 py-1 bg-green-100 text-green-600 text-xs font-bold rounded">
              HOT SALE
            </span>
          </div>

          <div v-if="variants.length > 0" class="space-y-3">
            <p class="text-sm font-bold text-slate-700 uppercase">Phân loại sản phẩm:</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                v-for="v in variants"
                :key="v.id"
                @click="selectedVariant = v"
                :class="[
                  'px-3 py-3 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center justify-center text-center leading-tight',
                  selectedVariant?.id === v.id
                    ? 'border-red-600 bg-red-50 text-red-600'
                    : 'border-slate-200 text-slate-600 hover:border-slate-400',
                ]"
              >
                {{ v.name }}
                <span class="text-[11px] font-normal opacity-70 mt-1">{{ v.color }}</span>
              </button>
            </div>
          </div>

          <p
            class="text-slate-600 text-base leading-relaxed italic border-l-4 border-slate-200 pl-4"
          >
            {{ product.description }}
          </p>

          <div class="flex flex-col sm:flex-row items-center gap-4 py-6 border-t border-slate-100">
            <div
              class="flex items-center border-2 border-slate-200 rounded-xl bg-slate-100 h-14 overflow-hidden"
            >
              <button
                @click="updateQuantity(-1)"
                class="px-5 h-full hover:bg-slate-200 text-slate-700 active:bg-slate-300"
              >
                <span class="material-symbols-outlined font-bold">remove</span>
              </button>
              <input
                type="text"
                readonly
                :value="quantity"
                class="w-12 text-center bg-transparent border-none focus:ring-0 text-slate-900 font-black text-xl"
              />
              <button
                @click="updateQuantity(1)"
                class="px-5 h-full hover:bg-slate-200 text-slate-700 active:bg-slate-300"
              >
                <span class="material-symbols-outlined font-bold">add</span>
              </button>
            </div>

            <button
              class="w-full flex-1 bg-slate-900 hover:bg-black text-white font-black h-14 rounded-xl flex items-center justify-center gap-3 transition-all"
            >
              <span class="material-symbols-outlined">shopping_cart</span>
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
        </div>
      </div>

      <!-- SẢN PHẨM TẶNG KÈM - CHỈ HIỆN NẾU CÓ bundleItem -->
      <section v-if="giftProducts.length > 0" class="mt-16">
        <div class="flex items-center gap-3 mb-8 border-b-2 border-red-600 pb-2 w-fit">
          <span class="material-symbols-outlined text-red-600 scale-125">redeem</span>
          <h3 class="text-2xl font-black text-slate-900">Sản Phẩm Tặng Kèm</h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <RouterLink
            v-for="gift in giftProducts"
            :key="gift.id"
            :to="`/product/${gift.id}`"
            class="group bg-white p-5 rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div class="aspect-square rounded-2xl bg-slate-50 overflow-hidden mb-4 relative p-4">
              <img
                :src="getImageUrl(gift.mainImage || gift.bundleImage)"
                class="w-full h-full object-contain group-hover:scale-110 transition-duration-500"
              />
              <div
                class="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl"
              >
                QUÀ TẶNG
              </div>
            </div>
            <p class="font-black text-slate-900 text-base mb-1 truncate">{{ gift.name }}</p>
            <p class="text-red-600 font-bold text-sm">
              {{ gift.variantName }} - {{ gift.quantity }} cái
            </p>
            <p class="text-slate-600 text-sm">
              Trị giá: {{ Number(gift.variantPrice || 650000).toLocaleString('vi-VN') }}đ
            </p>
          </RouterLink>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

.font-sans {
  font-family: 'Inter', sans-serif;
}

input {
  color: #0f172a !important;
  opacity: 1 !important;
}
</style>
