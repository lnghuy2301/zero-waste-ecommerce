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

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openLightbox = (mediaUrl: string) => {
  currentLightboxMedia.value = mediaUrl
  isLightboxOpen.value = true
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  currentLightboxMedia.value = null
}

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
      api.get(`/bundle-item?bundleProductId=${id}`).catch(() => ({ data: [] })),
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

// Reset số lượng về 1 mỗi khi người dùng đổi phân loại
watch(selectedVariant, () => {
  quantity.value = 1
})

const updateQuantity = (val: number) => {
  const maxStock = selectedVariant.value?.stock ?? selectedVariant.value?.stockQuantity ?? selectedVariant.value?.quantity ?? 999
  const MAX_LIMIT = 20

  if (quantity.value + val < 1) return

  if (quantity.value + val > maxStock) {
    alert(`Rất tiếc, sản phẩm này chỉ còn ${maxStock} sản phẩm trong kho!`)
    return
  }

  if (quantity.value + val > MAX_LIMIT) {
    alert(`Bạn chỉ được đặt tối đa ${MAX_LIMIT} sản phẩm cho mỗi lần mua!`)
    return
  }

  quantity.value += val
}

// Kiểm tra tính hợp lệ khi người dùng tự nhập số vào ô input
const validateQuantity = () => {
  let val = Math.floor(Number(quantity.value))
  const maxStock = selectedVariant.value?.stock ?? selectedVariant.value?.stockQuantity ?? selectedVariant.value?.quantity ?? 999
  const MAX_LIMIT = 20

  // Nếu nhập bậy (chữ, bỏ trống) hoặc <= 0 thì set về 1
  if (isNaN(val) || val < 1) {
    val = 1
  } else if (val > maxStock) {
    alert(`Rất tiếc, sản phẩm này chỉ còn ${maxStock} sản phẩm trong kho!`)
    val = maxStock
  } else if (val > MAX_LIMIT) {
    alert(`Bạn chỉ được đặt tối đa ${MAX_LIMIT} sản phẩm cho mỗi lần mua!`)
    val = MAX_LIMIT
  }

  quantity.value = val
}

onMounted(fetchData)
watch(() => route.params.id, fetchData)
</script>

<template>
  <main class="mx-auto max-w-[1200px] w-full px-4 py-8 font-sans relative">
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 text-slate-400">
      <span class="material-symbols-outlined text-5xl text-[#658a22] animate-bounce mb-4">eco</span>
      <p class="font-bold uppercase tracking-widest text-sm text-[#658a22]">Đang tải sản phẩm...</p>
    </div>

    <div v-else-if="!product" class="text-center py-32 bg-white rounded-[2rem] border-2 border-slate-100 border-dashed text-slate-500">
      <span class="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
      <p class="font-bold text-lg">Không tìm thấy sản phẩm.</p>
    </div>

    <div v-else>
      <nav class="flex items-center gap-2 mb-8 text-[13px] font-bold text-slate-400 uppercase tracking-wide">
        <RouterLink to="/" class="hover:text-[#658a22] transition-colors flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">home</span>
          Trang Chủ
        </RouterLink>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <RouterLink to="/products" class="hover:text-[#658a22] transition-colors">Cửa hàng</RouterLink>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <span class="text-slate-800">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border-2 border-slate-100">
        <div class="lg:col-span-5 space-y-4">
          <div class="aspect-square w-full bg-[#f4f7ee]/50 rounded-3xl overflow-hidden flex items-center justify-center border-2 border-[#658a22]/10 relative group">
            <img :src="getImageUrl(product.mainImage)" class="w-[85%] h-[85%] object-contain group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>

        <div class="lg:col-span-7 flex flex-col gap-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-2">{{ product.name }}</h1>
            <div class="flex items-center gap-4 text-sm font-bold text-slate-400">
              <span class="flex items-center gap-1">
                <span class="text-yellow-400 text-lg">★</span>
                5.0 ({{ commentTotal }} đánh giá)
              </span>
            </div>
          </div>

          <div class="flex items-center gap-4 p-5 bg-[#f4f7ee]/50 rounded-2xl border border-[#658a22]/10">
            <div class="flex items-baseline gap-3">
              <p v-if="selectedVariant?.promotionId" class="text-xl text-slate-400 line-through font-bold">
                {{ Number(selectedVariant.price).toLocaleString('vi-VN') }}đ
              </p>
              <p class="text-4xl font-black text-[#d00000]">
                {{ selectedVariant ? Number(getDiscountedPrice(selectedVariant)).toLocaleString('vi-VN') : '---' }}đ
              </p>
            </div>
          </div>

          <div v-if="variants.length > 0" class="space-y-3">
            <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest">Chọn phân loại</p>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="v in variants" :key="v.id" @click="selectedVariant = v"
                :class="['px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center justify-center text-center leading-tight min-w-[100px]', selectedVariant?.id === v.id ? 'border-[#658a22] bg-[#eef4e6] text-[#658a22] shadow-sm' : 'border-slate-100 text-slate-600 hover:border-slate-300 bg-slate-50 hover:bg-white']"
              >
                {{ v.name }}
                <span class="text-[10px] font-normal opacity-70 mt-1 uppercase tracking-wider">{{ v.color }}</span>
              </button>
            </div>
          </div>

          <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <p class="text-slate-600 text-sm leading-relaxed text-justify">
              {{ product.description || 'Sản phẩm thay thế hoàn hảo cho đồ nhựa dùng một lần.' }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t-2 border-dashed border-slate-100 mt-auto">
            <div class="flex items-center border-2 border-slate-200 rounded-2xl bg-white h-14 overflow-hidden w-full sm:w-auto">
              <button @click="updateQuantity(-1)" class="px-5 h-full hover:bg-slate-100 text-slate-700 font-black text-lg">-</button>

              <input
                type="number"
                v-model.number="quantity"
                @change="validateQuantity"
                @blur="validateQuantity"
                class="w-14 text-center bg-transparent border-none focus:ring-0 text-slate-900 font-black text-lg hide-arrows"
              />

              <button
                @click="updateQuantity(1)"
                class="px-5 h-full hover:bg-slate-100 text-slate-700 font-black text-lg disabled:opacity-30 disabled:cursor-not-allowed"
                :disabled="quantity >= 20 || quantity >= (selectedVariant?.stock ?? selectedVariant?.stockQuantity ?? selectedVariant?.quantity ?? 999)"
              >+</button>
            </div>

            <button @click="handleAddToCart" :disabled="isAdding" class="w-full flex-1 bg-[#1e293b] hover:bg-black text-white font-black h-14 rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-sm">
              {{ isAdding ? 'ĐANG XỬ LÝ...' : 'THÊM VÀO GIỎ' }}
            </button>
          </div>
        </div>
      </div>

      <div class="mt-12 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border-2 border-slate-100">
        <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
          Đánh giá sản phẩm
          <span class="text-sm font-bold bg-[#eef4e6] text-[#658a22] px-3 py-1 rounded-full">
            {{ commentTotal }} Đánh giá
          </span>
        </h2>

        <div v-if="isCommentsLoading" class="py-10 text-center text-slate-400 font-bold">
          <span class="material-symbols-outlined animate-spin text-3xl mb-2">sync</span>
          <p>Đang tải đánh giá...</p>
        </div>

        <div v-else-if="comments.length === 0" class="py-16 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <span class="material-symbols-outlined text-5xl text-slate-300 mb-3">chat_bubble_outline</span>
          <p class="text-slate-500 font-bold">Chưa có đánh giá nào cho sản phẩm này.</p>
        </div>

        <div v-else class="space-y-8">
          <div v-for="comment in comments" :key="comment.id" class="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
            <div class="flex items-start gap-4">

              <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white shadow-sm">
                <img
                  v-if="comment.account?.avatar"
                  :src="getImageUrl(comment.account.avatar)"
                  class="w-full h-full object-cover"
                />
                <span v-else class="material-symbols-outlined text-slate-400">person</span>
              </div>

              <div class="flex-1">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <p class="font-bold text-slate-800">
                    {{ comment.account?.profile?.fullName || comment.account?.email || 'Khách hàng ẩn danh' }}
                  </p>
                  <p class="text-xs text-slate-400 font-medium">{{ formatDate(comment.createdAt) }}</p>
                </div>

                <div class="flex text-sm mb-3 gap-0.5">
                  <span v-for="star in 5" :key="star" class="text-lg" :class="star <= Number(comment.rating || 5) ? 'text-yellow-400' : 'text-slate-200'">
                    ★
                  </span>
                </div>

                <p class="text-slate-600 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                  {{ comment.content }}
                </p>

                <div v-if="comment.media && comment.media.length > 0" class="flex flex-wrap gap-3">
                  <div
                    v-for="item in comment.media"
                    :key="item.id"
                    @click="openLightbox(item.url || item.path)"
                    class="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-[#658a22] transition-colors relative group"
                  >
                    <video v-if="isVideo(item.url || item.path)" :src="getImageUrl(item.url || item.path)" class="w-full h-full object-cover"></video>
                    <img v-else :src="getImageUrl(item.url || item.path)" class="w-full h-full object-cover" />

                    <div v-if="isVideo(item.url || item.path)" class="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span class="material-symbols-outlined text-white text-2xl drop-shadow-md">play_circle</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-if="isLightboxOpen" class="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10" @click.self="closeLightbox">
      <button @click="closeLightbox" class="absolute top-6 right-6 text-white hover:text-red-400 bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
        <span class="material-symbols-outlined">close</span>
      </button>

      <div class="max-w-4xl max-h-full w-full rounded-2xl overflow-hidden shadow-2xl relative">
        <video v-if="isVideo(currentLightboxMedia)" :src="getImageUrl(currentLightboxMedia)" controls autoplay class="w-full max-h-[85vh] object-contain bg-black"></video>
        <img v-else :src="getImageUrl(currentLightboxMedia)" class="w-full max-h-[85vh] object-contain" />
      </div>
    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
.font-sans { font-family: 'Inter', sans-serif; }

/* Ẩn mũi tên lên/xuống mặc định của input type="number" */
.hide-arrows::-webkit-inner-spin-button,
.hide-arrows::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.hide-arrows {
  -moz-appearance: textfield;
}
</style>
