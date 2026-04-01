<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import api from '@/service/api.ts'
import CommentService from '@/service/comment.ts'
import { Cart } from '@/service/cart.ts'

const route = useRoute()
const product = ref<any>(null)
const variants = ref<any[]>([])
const selectedVariant = ref<any>(null)
const promotions = ref<any[]>([])
const giftProducts = ref<any[]>([])
const loading = ref(true)
const quantity = ref(1)

// --- STATE CHO GIỎ HÀNG ---
const isAdding = ref(false)

// --- STATE CHO ĐÁNH GIÁ (REVIEW) ---
const comments = ref<any[]>([])
const commentTotal = ref(0)
const isCommentsLoading = ref(false)

// --- STATE CHO LIGHTBOX ---
const isLightboxOpen = ref(false)
const currentLightboxMedia = ref<any>(null)

// --- CÁC HÀM HELPER ---
const getImageUrl = (path: string | null) => {
  if (!path) return 'https://via.placeholder.com/400x400?text=Không+có+ảnh'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`
}

const isVideo = (url: string | null) => {
  if (!url) return false
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm']
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext))
}

const openLightbox = (media: any) => {
  currentLightboxMedia.value = media
  isLightboxOpen.value = true
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  currentLightboxMedia.value = null
}

// --- LOGIC THÊM VÀO GIỎ HÀNG ---
const handleAddToCart = async () => {
  if (!selectedVariant.value) {
    alert('Vui lòng chọn phân loại sản phẩm!')
    return
  }

  const userJson = localStorage.getItem('user')
  const user = userJson ? JSON.parse(userJson) : null
  const currentUserId = user ? Number(user.id) : null

  if (!currentUserId) {
    alert('Vui lòng đăng nhập để mua hàng!')
    return
  }

  isAdding.value = true
  try {
    const payload = {
      accountId: currentUserId,
      variantId: Number(selectedVariant.value.id),
      quantity: Number(quantity.value),
    }

    await Cart.create(payload)

    // Phát sự kiện toàn cục cập nhật Header
    window.dispatchEvent(new CustomEvent('cart-updated'))

    alert(`Thành công! Đã thêm vào giỏ hàng.`)
  } catch (error: any) {
    console.error('Lỗi chi tiết:', error.response?.data)
    const message = error.response?.data?.message || 'Lỗi không xác định'
    alert(Array.isArray(message) ? message.join('\n') : message)
  } finally {
    isAdding.value = false
  }
}

// --- FETCH DATA ---
const fetchComments = async (id: number) => {
  isCommentsLoading.value = true
  try {
    const response = await CommentService.getComments({ productId: id })
    const responseData = response.data || response
    comments.value = responseData.data || responseData.items || responseData || []
    commentTotal.value = responseData.meta?.total || comments.value.length
  } catch (error) {
    console.error('Lỗi khi tải đánh giá:', error)
  } finally {
    isCommentsLoading.value = false
  }
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
      api.get(`/bundle-item?bundleProductId=${id}`).catch(() => ({ data: [] })), // Bắt lỗi nếu API bundle không tồn tại
    ])

    product.value = prodRes.data
    promotions.value = promoRes.data
    variants.value = variantRes.data.filter((v: any) => v.productId === id)

    if (variants.value.length > 0) {
      selectedVariant.value = variants.value[0]
    }

    giftProducts.value = []
    for (const b of bundleRes.data) {
      const vRes = await api.get(`/product-variant/${b.componentVariantId}`)
      const variant = vRes.data
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

    await fetchComments(id)
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
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 text-slate-400">
      <span class="material-symbols-outlined text-5xl text-[#658a22] animate-bounce mb-4">eco</span>
      <p class="font-bold uppercase tracking-widest text-sm text-[#658a22]">Đang tải sản phẩm...</p>
    </div>

    <div
      v-else-if="!product"
      class="text-center py-32 bg-white rounded-[2rem] border-2 border-slate-100 border-dashed text-slate-500"
    >
      <span class="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
      <p class="font-bold text-lg">Không tìm thấy sản phẩm.</p>
    </div>

    <div v-else>
      <nav
        class="flex items-center gap-2 mb-8 text-[13px] font-bold text-slate-400 uppercase tracking-wide"
      >
        <RouterLink to="/" class="hover:text-[#658a22] transition-colors flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">home</span>
          Trang Chủ
        </RouterLink>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <RouterLink to="/products" class="hover:text-[#658a22] transition-colors">
          Cửa hàng
        </RouterLink>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <span class="text-slate-800">{{ product.name }}</span>
      </nav>

      <div
        class="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border-2 border-slate-100"
      >
        <div class="lg:col-span-5 space-y-4">
          <div
            class="aspect-square w-full bg-[#f4f7ee]/50 rounded-3xl overflow-hidden flex items-center justify-center border-2 border-[#658a22]/10 relative group"
          >
            <img
              :src="getImageUrl(product.mainImage)"
              class="w-[85%] h-[85%] object-contain group-hover:scale-105 transition-transform duration-500"
            />

            <div
              class="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-[#658a22] text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm border border-[#658a22]/20"
            >
              <span class="material-symbols-outlined text-sm">recycling</span>
              Thân thiện môi trường
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 flex flex-col gap-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-2">
              {{ product.name }}
            </h1>
            <div class="flex items-center gap-4 text-sm font-bold text-slate-400">
              <span class="flex items-center gap-1"
                ><span class="material-symbols-outlined text-yellow-400 text-lg">star</span> 5.0 ({{
                  commentTotal
                }}
                đánh giá)</span
              >
              <span>|</span>
              <span class="text-[#658a22] bg-[#eef4e6] px-2 py-0.5 rounded-md">Có sẵn hàng</span>
            </div>
          </div>

          <div
            class="flex items-center gap-4 p-5 bg-[#f4f7ee]/50 rounded-2xl border border-[#658a22]/10"
          >
            <div class="flex items-baseline gap-3">
              <p
                v-if="selectedVariant?.promotionId"
                class="text-xl text-slate-400 line-through font-bold"
              >
                {{ Number(selectedVariant.price).toLocaleString('vi-VN') }}đ
              </p>
              <p class="text-4xl font-black text-[#d00000]">
                {{
                  selectedVariant
                    ? Number(getDiscountedPrice(selectedVariant)).toLocaleString('vi-VN')
                    : '---'
                }}đ
              </p>
            </div>

            <span
              v-if="selectedVariant?.promotionId"
              class="px-3 py-1 bg-[#658a22] text-white text-[11px] font-black rounded-full uppercase tracking-widest shadow-md"
            >
              GIẢM {{ promotions.find((p) => p.id === selectedVariant.promotionId)?.discountValue
              }}{{
                promotions.find((p) => p.id === selectedVariant.promotionId)?.discountType ===
                'PERCENT'
                  ? '%'
                  : 'đ'
              }}
            </span>
          </div>

          <div v-if="variants.length > 0" class="space-y-3">
            <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Chọn phân loại
            </p>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="v in variants"
                :key="v.id"
                @click="selectedVariant = v"
                :class="[
                  'px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center justify-center text-center leading-tight min-w-[100px]',
                  selectedVariant?.id === v.id
                    ? 'border-[#658a22] bg-[#eef4e6] text-[#658a22] shadow-sm'
                    : 'border-slate-100 text-slate-600 hover:border-slate-300 bg-slate-50 hover:bg-white',
                ]"
              >
                {{ v.name }}
                <span class="text-[10px] font-normal opacity-70 mt-1 uppercase tracking-wider">{{
                  v.color
                }}</span>
              </button>
            </div>
          </div>

          <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <p class="text-slate-600 text-sm leading-relaxed text-justify">
              {{
                product.description ||
                'Sản phẩm thay thế hoàn hảo cho đồ nhựa dùng một lần. Chất liệu an toàn, dễ dàng phân hủy hoặc tái sử dụng nhiều lần.'
              }}
            </p>
          </div>

          <div
            class="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t-2 border-dashed border-slate-100 mt-auto"
          >
            <div
              class="flex items-center border-2 border-slate-200 rounded-2xl bg-white h-14 overflow-hidden w-full sm:w-auto"
            >
              <button
                @click="updateQuantity(-1)"
                class="px-5 h-full hover:bg-slate-100 text-slate-700 transition-colors font-black text-lg"
              >
                -
              </button>
              <input
                type="text"
                readonly
                :value="quantity"
                class="w-12 text-center bg-transparent border-none focus:ring-0 text-slate-900 font-black text-lg"
              />
              <button
                @click="updateQuantity(1)"
                class="px-5 h-full hover:bg-slate-100 text-slate-700 transition-colors font-black text-lg"
              >
                +
              </button>
            </div>

            <button
              @click="handleAddToCart"
              :disabled="isAdding"
              class="w-full flex-1 bg-[#1e293b] hover:bg-black text-white font-black h-14 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 uppercase tracking-widest text-sm"
            >
              <span v-if="!isAdding" class="material-symbols-outlined">shopping_bag</span>
              <span v-else class="material-symbols-outlined animate-spin">sync</span>
              {{ isAdding ? 'ĐANG XỬ LÝ...' : 'THÊM VÀO GIỎ' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

.font-sans {
  font-family: 'Inter', sans-serif;
}
</style>
