<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { notify } from '@/utils/notifier.ts'
import { OrderService } from '../service/order.ts'
import OrderDetailService from '../service/order_detail.ts'
import CommentService from '../service/comment.ts'
import MediaService from '../service/media.ts'
import { Cart } from '../service/cart.ts'

const route = useRoute()
const router = useRouter()

const orderId = Number(route.params.id)
const userId = ref<number | null>(null)

const selectedOrder = ref<any>(null)
const loading = ref(false)
const isCanceling = ref(false)

// --- STATE CHO ĐÁNH GIÁ (REVIEW) ---
const isReviewModalOpen = ref(false)
const orderToReview = ref<any>(null)
const reviewContent = ref('')
const reviewRating = ref(5)
const selectedItemToReview = ref<any>(null)
const selectedProductToReview = ref<number | null>(null)
const isSubmittingReview = ref(false)

// --- STATE CHO UPLOAD MEDIA ---
const selectedMediaFiles = ref<File[]>([])
const mediaPreviewUrls = ref<string[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

// --- CÁC HÀM FORMAT & HELPER ---
const formatCurrency = (amount: number | string) => {
  if (!amount) return '0đ'
  return Number(amount).toLocaleString('vi-VN') + 'đ'
}

const getImageUrl = (path: string | null) => {
  if (!path) return '/placeholder.jpg'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`
}

const getStatusInfo = (status: string) => {
  const map: Record<string, any> = {
    PENDING: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700', step: 0 },
    PAID: { label: 'Đã thanh toán', color: 'bg-blue-100 text-blue-700', step: 1 },
    SHIPPING: { label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-700', step: 2 },
    COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', step: 3 },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', step: -1 },
  }
  return map[status] || { label: status, color: 'bg-gray-100 text-gray-700', step: 0 }
}

// --- LOGIC PHƯƠNG THỨC THANH TOÁN ---
const getPaymentMethodInfo = computed(() => {
  if (!selectedOrder.value) return { name: 'Đang tải...', icon: 'payments', logo: '' }

  // Lấy tên phương thức từ backend (ví dụ: "online_momo", "online_paypal" hoặc "cod")
  const method = selectedOrder.value.paymentMethod?.name || selectedOrder.value.paymentMethod || ''
  const methodStr = String(method).toLowerCase()

  if (methodStr.includes('momo')) {
    return { name: 'Ví điện tử MoMo', icon: '', logo: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png' }
  }
  if (methodStr.includes('paypal')) {
    return { name: 'Cổng thanh toán PayPal', icon: '', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' }
  }
  if (methodStr.includes('cod') || selectedOrder.value.paymentMethodId === 1) {
    return { name: 'Thanh toán khi nhận hàng (COD)', icon: 'local_shipping', logo: '' }
  }
  return { name: 'Chuyển khoản / QR Pay', icon: 'qr_code_2', logo: '' }
})

// --- TÁCH THÔNG TIN GIAO HÀNG TỪ CHUỖI ---
const parsedShippingInfo = computed(() => {
  if (!selectedOrder.value?.shippingAddress) return { name: '', phone: '', address: '' }
  const addressString = selectedOrder.value.shippingAddress
  const parts = addressString.split(' - ')
  if (parts.length >= 3) {
    return {
      name: parts[0].trim(),
      phone: parts[1].trim(),
      address: parts.slice(2).join(' - ').trim()
    }
  }
  return {
    name: selectedOrder.value.account?.profile?.fullName || selectedOrder.value.account?.username || 'Khách hàng',
    phone: '---',
    address: addressString
  }
})

// --- CÁC HÀM GỌI API ---
const fetchDetail = async () => {
  if (!orderId) return
  loading.value = true
  try {
    const orderData = await OrderService.getOrderById(orderId)
    const orderDetails = await OrderDetailService.getOrderDetailsByOrder(orderId)
    if (orderData) {
      orderData.orderItems = orderDetails || []
      selectedOrder.value = orderData
    }
  } catch (error: any) {
    notify.error(error?.message || 'Lỗi tải chi tiết đơn hàng!')
  } finally {
    loading.value = false
  }
}

const handleCancelOrder = async (id: number) => {
  const confirmCancel = confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')
  if (!confirmCancel) return
  isCanceling.value = true
  try {
    await OrderService.cancelOrder(id)
    notify.success('Đã hủy đơn hàng thành công!')
    selectedOrder.value.status = 'CANCELLED'
  } catch (error) {
    notify.error('Không thể hủy đơn hàng lúc này.')
  } finally {
    isCanceling.value = false
  }
}

const handleReorder = async (order: any) => {
  if (!order.orderItems || order.orderItems.length === 0) return
  if (!userId.value) return notify.error('Vui lòng đăng nhập!')
  try {
    const reorderPromises = order.orderItems.map((item: any) => {
      return Cart.create({
        accountId: Number(userId.value),
        variantId: Number(item.variantId || item.variant?.id),
        quantity: Number(item.quantity),
      })
    })
    await Promise.all(reorderPromises)
    window.dispatchEvent(new CustomEvent('cart-updated'))
    notify.success('Đã thêm vào giỏ hàng!')
    router.push('/cartpayment')
  } catch (error: any) {
    notify.error('Lỗi khi mua lại đơn hàng.')
  }
}

const goToProduct = (productId: number | undefined) => {
  if (productId) router.push(`/product/${productId}`)
}

// --- CÁC HÀM XỬ LÝ ĐÁNH GIÁ ---
const triggerFileInput = () => fileInputRef.value?.click()
const handleFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return
  Array.from(files).forEach((file) => {
    selectedMediaFiles.value.push(file)
    mediaPreviewUrls.value.push(URL.createObjectURL(file))
  })
}
const removeMedia = (index: number) => {
  URL.revokeObjectURL(mediaPreviewUrls.value[index])
  mediaPreviewUrls.value.splice(index, 1)
  selectedMediaFiles.value.splice(index, 1)
}
const openReviewModalForProduct = (order: any, item: any) => {
  orderToReview.value = order
  selectedItemToReview.value = item
  selectedProductToReview.value = item.variant?.product?.id || item.variant?.productId
  isReviewModalOpen.value = true
}
const closeReviewModal = () => {
  isReviewModalOpen.value = false
  mediaPreviewUrls.value.forEach(url => URL.revokeObjectURL(url))
  mediaPreviewUrls.value = []
  selectedMediaFiles.value = []
}

const submitReview = async () => {
  if (!reviewContent.value.trim()) return notify.error('Vui lòng nhập nội dung!')
  isSubmittingReview.value = true
  try {
    const createdComment = await CommentService.createComment(selectedProductToReview.value!, {
      content: reviewContent.value,
      rating: reviewRating.value,
    })
    const commentId = createdComment.id || createdComment.data?.id
    if (commentId && selectedMediaFiles.value.length > 0) {
      await Promise.all(selectedMediaFiles.value.map(file => MediaService.uploadReviewMedia(commentId, file)))
    }
    notify.success('Đánh giá thành công!')
    closeReviewModal()
  } catch (error) {
    notify.error('Lỗi gửi đánh giá.')
  } finally {
    isSubmittingReview.value = false
  }
}

onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) userId.value = JSON.parse(userStr).id
  if (orderId) fetchDetail()
})
</script>

<template>
  <div class="max-w-5xl mx-auto p-4 md:p-8">
    <div v-if="loading" class="p-10 text-center text-gray-500 italic">Đang tải chi tiết đơn hàng...</div>

    <div v-else-if="selectedOrder" class="animate-fadeIn">
      <button @click="router.back()" class="mb-6 flex items-center text-gray-400 hover:text-black transition-colors font-bold uppercase text-xs tracking-widest">
        &larr; Quay lại danh sách đơn hàng
      </button>

      <div class="bg-white border rounded-[2.5rem] shadow-xl overflow-hidden animate-fadeIn">
        <div class="bg-slate-50 p-8 border-b border-dashed border-slate-200">
          <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 class="font-black text-2xl text-slate-800 italic uppercase">Mã đơn: {{ selectedOrder.code }}</h2>
            <div class="flex flex-wrap items-center gap-3">
              <span :class="['px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border', getStatusInfo(selectedOrder.status).color]">
                {{ getStatusInfo(selectedOrder.status).label }}
              </span>
              <button v-if="selectedOrder.status === 'PENDING'" @click="handleCancelOrder(selectedOrder.id)" :disabled="isCanceling" class="px-4 py-1.5 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm">
                {{ isCanceling ? 'Đang hủy...' : 'Hủy đơn hàng' }}
              </button>
            </div>
          </div>

          <div v-if="selectedOrder.status !== 'CANCELLED'" class="flex items-center justify-between mt-10 px-6 relative">
            <div v-for="step in [0, 1, 2, 3]" :key="step" :class="['w-10 h-10 rounded-full flex items-center justify-center z-10 font-black transition-all duration-500 shadow-md', getStatusInfo(selectedOrder.status).step >= step ? 'bg-[#658a22] text-white scale-110' : 'bg-white text-slate-300 border-2 border-slate-100']">
              {{ step + 1 }}
            </div>
            <div class="absolute h-1.5 bg-slate-100 left-12 right-12 top-[1.15rem] z-0 overflow-hidden rounded-full shadow-inner">
              <div class="h-full bg-[#658a22] transition-all duration-700 ease-in-out" :style="{ width: `${(getStatusInfo(selectedOrder.status).step / 3) * 100}%` }"></div>
            </div>
          </div>
        </div>

        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 class="font-black mb-6 text-slate-800 uppercase italic text-sm tracking-widest">Sản phẩm đã đặt</h3>
            <div class="space-y-5">
              <div v-for="item in selectedOrder.orderItems" :key="item.id" @click="goToProduct(item.variant?.product?.id || item.variant?.productId)" class="flex gap-5 items-center border-b border-slate-50 pb-5 last:border-0 cursor-pointer group">
                <div class="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100 group-hover:border-[#658a22] transition-all shadow-sm">
                  <img :src="getImageUrl(item.variant?.product?.mainImage)" alt="product" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <p class="font-black text-sm text-slate-800 group-hover:text-[#658a22] transition-colors line-clamp-2 uppercase">{{ item.variant?.name }}</p>
                  <p class="font-black text-[#658a22] text-sm mt-1 italic">{{ formatCurrency(item.price) }}</p>
                  <div class="flex items-center justify-between mt-3">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số lượng: x{{ item.quantity }}</p>
                    <button v-if="selectedOrder.status === 'COMPLETED'" @click.stop="openReviewModalForProduct(selectedOrder, item)" class="px-3 py-1 bg-white border-2 border-slate-100 text-slate-600 hover:text-[#658a22] hover:border-[#658a22] rounded-xl shadow-sm text-[10px] font-black uppercase transition-all">Đánh giá</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
              <h4 class="font-black text-slate-800 mb-5 text-[11px] uppercase tracking-widest italic flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">local_shipping</span> Thông tin giao hàng
              </h4>
              <div class="space-y-4">
                <div class="flex flex-col sm:flex-row gap-4">
                  <div class="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Người nhận</p>
                    <p class="font-black text-slate-800 text-xs">{{ parsedShippingInfo.name }}</p>
                  </div>
                  <div class="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Số điện thoại</p>
                    <p class="font-black text-slate-800 text-xs">{{ parsedShippingInfo.phone }}</p>
                  </div>
                </div>
                <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Địa chỉ chi tiết</p>
                  <p class="font-bold text-slate-700 text-xs leading-relaxed italic">{{ parsedShippingInfo.address }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <h4 class="font-black text-slate-800 mb-4 text-[11px] uppercase tracking-widest italic">Phương thức thanh toán</h4>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <img v-if="getPaymentMethodInfo.logo" :src="getPaymentMethodInfo.logo" class="h-6 w-6 object-contain" />
                  <span v-else class="material-symbols-outlined text-slate-400 text-xl">{{ getPaymentMethodInfo.icon }}</span>
                  <span class="font-black text-slate-700 text-xs uppercase">{{ getPaymentMethodInfo.name }}</span>
                </div>
                <span :class="['px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm border', selectedOrder.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-green-50 text-green-600 border-green-100']">
                  {{ selectedOrder.status === 'PENDING' ? 'Chờ xử lý' : 'Đã thanh toán' }}
                </span>
              </div>
            </div>

            <div class="flex justify-between items-center px-4 pt-4 border-t-2 border-dashed border-slate-100">
              <span class="text-slate-400 font-black uppercase tracking-widest text-sm italic">Tổng đơn hàng:</span>
              <span class="text-3xl font-black text-[#d00000]">{{ formatCurrency(selectedOrder.totalAmount) }}</span>
            </div>

            <button v-if="['COMPLETED', 'CANCELLED'].includes(selectedOrder.status)" @click="handleReorder(selectedOrder)" class="w-full mt-4 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95">Mua lại ngay</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
