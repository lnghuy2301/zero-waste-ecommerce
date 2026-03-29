<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import api from '@/service/api.ts'
import CommentService from '@/service/comment.ts'
import { Cart } from '@/service/cart.ts' // Đảm bảo import đúng service đã viết

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
// --- LOGIC THÊM VÀO GIỎ HÀNG ---
const handleAddToCart = async () => {
  if (!selectedVariant.value) {
    alert('Vui lòng chọn phân loại sản phẩm!')
    return
  }

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const currentUserId = user ? Number(user.id) : null;

  if (!currentUserId) {
    alert('Vui lòng đăng nhập để mua hàng!');
    return;
  }

  isAdding.value = true
  try {
    const payload = {
      accountId: currentUserId,
      variantId: Number(selectedVariant.value.id),
      quantity: Number(quantity.value)
    }

    // 1. Gửi lên server
    await Cart.create(payload)

    // 2. PHÁT SỰ KIỆN TOÀN CỤC (QUAN TRỌNG)
    // Chúng ta bắn tin nhắn: "Này các component khác, giỏ hàng vừa cập nhật đấy!"
    window.dispatchEvent(new CustomEvent('cart-updated'));

    alert(`Thành công! Đã thêm vào giỏ hàng.`)
  } catch (error: any) {
    console.error('Lỗi chi tiết:', error.response?.data);
    const message = error.response?.data?.message || 'Lỗi không xác định';
    alert(Array.isArray(message) ? message.join('\n') : message);
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
      api.get(`/bundle-item?bundleProductId=${id}`),
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
    <div v-if="loading" class="text-center py-20 text-slate-600">
      <p class="text-lg">Đang tải thông tin...</p>
    </div>

    <div v-else-if="!product" class="text-center py-20 text-slate-500 text-xl">
      Không tìm thấy sản phẩm
    </div>

    <div v-else>
      <nav class="flex items-center gap-2 mb-6 text-[15px] font-medium text-slate-500">
        <RouterLink to="/" class="hover:text-red-600 transition-colors">Trang Chủ</RouterLink>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <span class="text-slate-900 font-bold">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-100">
        <div class="space-y-4">
          <div class="aspect-square w-full bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200">
            <img :src="getImageUrl(product.mainImage)" class="w-[85%] h-[85%] object-contain" />
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <h1 class="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            {{ product.name }}
          </h1>

          <div class="flex items-center gap-4">
            <div class="flex items-baseline gap-3">
              <p v-if="selectedVariant?.promotionId" class="text-2xl text-slate-400 line-through">
                {{ Number(selectedVariant.price).toLocaleString('vi-VN') }}đ
              </p>
              <p class="text-4xl font-extrabold text-red-600">
                {{ selectedVariant ? Number(getDiscountedPrice(selectedVariant)).toLocaleString('vi-VN') : '---' }}đ
              </p>
            </div>
            <span v-if="selectedVariant?.promotionId" class="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">
              GIẢM {{ promotions.find((p) => p.id === selectedVariant.promotionId)?.discountValue }}{{ promotions.find((p) => p.id === selectedVariant.promotionId)?.discountType === 'PERCENT' ? '%' : 'đ' }}
            </span>
          </div>

          <div v-if="variants.length > 0" class="space-y-3">
            <p class="text-sm font-bold text-slate-700 uppercase tracking-wide">Phân loại sản phẩm:</p>
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

          <p class="text-slate-600 text-base leading-relaxed italic border-l-4 border-slate-200 pl-4">
            {{ product.description }}
          </p>

          <div class="flex flex-col sm:flex-row items-center gap-4 py-6 border-t border-slate-100">
            <div class="flex items-center border-2 border-slate-200 rounded-xl bg-slate-100 h-14 overflow-hidden">
              <button @click="updateQuantity(-1)" class="px-5 h-full hover:bg-slate-200 text-slate-700 transition-colors">
                <span class="material-symbols-outlined font-bold">remove</span>
              </button>
              <input type="text" readonly :value="quantity" class="w-12 text-center bg-transparent border-none focus:ring-0 text-slate-900 font-black text-xl" />
              <button @click="updateQuantity(1)" class="px-5 h-full hover:bg-slate-200 text-slate-700 transition-colors">
                <span class="material-symbols-outlined font-bold">add</span>
              </button>
            </div>

            <button
              @click="handleAddToCart"
              :disabled="isAdding"
              class="w-full flex-1 bg-slate-900 hover:bg-black text-white font-black h-14 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isAdding" class="material-symbols-outlined">shopping_cart</span>
              <span v-else class="material-symbols-outlined animate-spin">sync</span>
              {{ isAdding ? 'ĐANG XỬ LÝ...' : 'THÊM VÀO GIỎ HÀNG' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
