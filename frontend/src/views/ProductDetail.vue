<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import api from '@/service/api.ts'
import CommentService from '@/service/comment.ts' // Mở import CommentService

const route = useRoute()
const product = ref<any>(null)
const variants = ref<any[]>([])
const selectedVariant = ref<any>(null)
const giftProducts = ref<any[]>([])
const loading = ref(true)
const quantity = ref(1)

// --- STATE CHO ĐÁNH GIÁ (REVIEW) ---
const comments = ref<any[]>([])
const commentTotal = ref(0)
const isCommentsLoading = ref(false)

// --- STATE CHO LIGHTBOX XEM ẢNH/VIDEO TO ---
const isLightboxOpen = ref(false)
const currentLightboxMedia = ref<any>(null)

const getImageUrl = (path: string | null) => {
  if (!path) return 'https://via.placeholder.com/400x400?text=Không+có+ảnh'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`
}

// Kiểm tra xem file media có phải là video không
const isVideo = (url: string | null) => {
  if (!url) return false
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm']
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext))
}

const openLightbox = (media: any) => {
  currentLightboxMedia.value = media
  isLightboxOpen.value = true
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  currentLightboxMedia.value = null
}

// ĐÃ SỬA: Lấy dữ liệu Đánh giá thật từ Database
const fetchComments = async (id: number) => {
  isCommentsLoading.value = true
  try {
    const response = await CommentService.getComments({ productId: id })
    const responseData = response.data || response;

    comments.value = responseData.data || responseData.items || responseData || [];
    commentTotal.value = responseData.meta?.total || comments.value.length;
  } catch (error) {
    console.error("Lỗi khi tải đánh giá:", error)
  } finally {
    isCommentsLoading.value = false
  }
}

const fetchData = async () => {
  const id = Number(route.params.id)
  if (!id) return

  loading.value = true
  try {
    const prodRes = await api.get(`/product/${id}`)
    product.value = prodRes.data

    const variantRes = await api.get('/product-variant')
    variants.value = variantRes.data.filter((v: any) => v.productId === id)

    if (variants.value.length > 0) {
      selectedVariant.value = variants.value[0]
    }

    const bundleRes = await api.get(`/bundle-item?bundleProductId=${id}`)
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

    // Gọi API lấy đánh giá thật
    fetchComments(id)

  } catch (e) {
    console.error('Lỗi tải dữ liệu:', e)
  } finally {
    loading.value = false
  }
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
        <RouterLink to="/" class="hover:text-red-600">Trang Chủ</RouterLink>
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
            <p class="text-4xl font-extrabold text-red-600">
              {{ selectedVariant ? Number(selectedVariant.price).toLocaleString('vi-VN') : '---' }}đ
            </p>
            <span class="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">HOT SALE</span>
          </div>

          <div v-if="variants.length > 0" class="space-y-3">
            <p class="text-sm font-bold text-slate-700 uppercase">Phân loại sản phẩm:</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                v-for="v in variants" :key="v.id" @click="selectedVariant = v"
                :class="[
                  'px-3 py-3 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center justify-center text-center leading-tight',
                  selectedVariant?.id === v.id ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-200 text-slate-600 hover:border-slate-400',
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
              <button @click="updateQuantity(-1)" class="px-5 h-full hover:bg-slate-200 text-slate-700 active:bg-slate-300">
                <span class="material-symbols-outlined font-bold">remove</span>
              </button>
              <input type="text" readonly :value="quantity" class="w-12 text-center bg-transparent border-none focus:ring-0 text-slate-900 font-black text-xl" />
              <button @click="updateQuantity(1)" class="px-5 h-full hover:bg-slate-200 text-slate-700 active:bg-slate-300">
                <span class="material-symbols-outlined font-bold">add</span>
              </button>
            </div>

            <button class="w-full flex-1 bg-slate-900 hover:bg-black text-white font-black h-14 rounded-xl flex items-center justify-center gap-3 transition-all">
              <span class="material-symbols-outlined">shopping_cart</span> THÊM VÀO GIỎ HÀNG
            </button>
          </div>
        </div>
      </div>

      <section v-if="giftProducts.length > 0" class="mt-16">
        <div class="flex items-center gap-3 mb-8 border-b-2 border-red-600 pb-2 w-fit">
          <span class="material-symbols-outlined text-red-600 scale-125">redeem</span>
          <h3 class="text-2xl font-black text-slate-900">Sản Phẩm Tặng Kèm</h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <RouterLink v-for="gift in giftProducts" :key="gift.id" :to="`/product/${gift.id}`" class="group bg-white p-5 rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div class="aspect-square rounded-2xl bg-slate-50 overflow-hidden mb-4 relative p-4">
              <img :src="getImageUrl(gift.mainImage || gift.bundleImage)" class="w-full h-full object-contain group-hover:scale-110 transition-duration-500" />
              <div class="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl">QUÀ TẶNG</div>
            </div>
            <p class="font-black text-slate-900 text-base mb-1 truncate">{{ gift.name }}</p>
            <p class="text-red-600 font-bold text-sm">{{ gift.variantName }} - {{ gift.quantity }} cái</p>
            <p class="text-slate-600 text-sm">Trị giá: {{ Number(gift.variantPrice || 650000).toLocaleString('vi-VN') }}đ</p>
          </RouterLink>
        </div>
      </section>

      <section class="mt-16 bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-xl">
        <div class="flex items-center gap-3 mb-8 border-b-2 border-red-600 pb-2 w-fit">
          <span class="material-symbols-outlined text-red-600 scale-125">grade</span>
          <h3 class="text-2xl font-black text-slate-900">Đánh Giá Sản Phẩm ({{ commentTotal }})</h3>
        </div>

        <div v-if="isCommentsLoading" class="text-center py-10 text-slate-500"><p>Đang tải đánh giá...</p></div>
        <div v-else-if="comments.length === 0" class="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p class="text-xl text-slate-400">Chưa có đánh giá nào cho sản phẩm này.</p>
        </div>

        <div v-else class="space-y-8">
          <div v-for="comment in comments" :key="comment.id" class="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 overflow-hidden border border-slate-200 flex-shrink-0">
                <img v-if="comment.account?.profile?.avatar" :src="getImageUrl(comment.account.profile.avatar)" class="w-full h-full object-cover">
                <span v-else>{{ (comment.account?.profile?.fullName || 'K').charAt(0).toUpperCase() }}</span>
              </div>

              <div class="flex-1">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                  <h4 class="font-bold text-slate-800 text-base">{{ comment.account?.profile?.fullName || 'Khách hàng' }}</h4>
                  <span class="text-xs text-slate-400 font-mono">{{ new Date(comment.ngay_tao || comment.createdAt).toLocaleDateString('vi-VN') }}</span>
                </div>

                <div class="flex gap-0.5 text-yellow-400 text-sm mb-3">
                  <span v-for="star in 5" :key="star" :class="star <= comment.rating ? 'text-yellow-400' : 'text-gray-200'">★</span>
                </div>

                <p class="text-slate-600 text-base leading-relaxed mb-4">
                  {{ comment.noi_dung || comment.content }}
                </p>

                <div v-if="comment.media?.length" class="flex flex-wrap gap-2.5">
                  <div v-for="m in comment.media" :key="m.id" class="relative group cursor-pointer w-20 h-20 rounded-xl overflow-hidden border border-slate-100" @click="openLightbox(m)">
                    <img v-if="!isVideo(m.url)" :src="getImageUrl(m.url)" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <video v-else :src="getImageUrl(m.url)" class="w-full h-full object-cover"></video>

                    <div v-if="isVideo(m.url)" class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <span class="material-symbols-outlined text-white text-3xl">play_circle</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <div v-if="isLightboxOpen" class="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4" @click.self="closeLightbox">
    <button @click="closeLightbox" class="absolute top-6 right-6 text-white text-3xl hover:text-red-600 transition-colors">
      <span class="material-symbols-outlined scale-150">close</span>
    </button>

    <div class="max-w-4xl max-h-[90vh] flex items-center justify-center relative">
      <img v-if="!isVideo(currentLightboxMedia?.url)" :src="getImageUrl(currentLightboxMedia?.url)" class="w-full h-full object-contain" />
      <video v-else :src="getImageUrl(currentLightboxMedia?.url)" controls autoplay class="w-full h-full object-contain"></video>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
.font-sans { font-family: 'Inter', sans-serif; }
input { color: #0f172a !important; opacity: 1 !important; }
</style>
