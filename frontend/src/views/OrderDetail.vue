<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

// --- CÁC HÀM FORMAT ---
const formatCurrency = (amount: number | string) => {
  if (!amount) return '0đ'
  return Number(amount).toLocaleString('vi-VN') + 'đ'
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
    notify.error('Không thể hủy đơn hàng lúc này. Vui lòng thử lại sau!')
  } finally {
    isCanceling.value = false
  }
}

const handleReorder = async (order: any) => {
  if (!order.orderItems || order.orderItems.length === 0) {
    notify.error('Đơn hàng này không có sản phẩm để mua lại.')
    return
  }
  if (!userId.value) {
    notify.error('Vui lòng đăng nhập để thực hiện.')
    return
  }

  try {
    const reorderPromises = order.orderItems.map((item: any) => {
      const payload = {
        accountId: Number(userId.value),
        variantId: Number(item.variantId || item.variant?.id),
        quantity: Number(item.quantity),
      }
      return Cart.create(payload)
    })

    await Promise.all(reorderPromises)
    window.dispatchEvent(new CustomEvent('cart-updated'))
    notify.success('Đã thêm các sản phẩm này vào giỏ hàng!')
    router.push('/cartpayment')
  } catch (error: any) {
    console.error('Lỗi khi mua lại đơn hàng:', error)
    notify.error('Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại!')
  }
}

const goToProduct = (productId: number | undefined) => {
  if (!productId) return
  router.push(`/product/${productId}`)
}

const goBack = () => {
  // Thay đổi dòng này cho khớp với tên route hoặc đường dẫn trang Order của bạn
  // Có thể dùng router.push('/orders') nếu bạn muốn trỏ về một path cố định
  router.back()
}

// --- CÁC HÀM XỬ LÝ ĐÁNH GIÁ ---
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  if (selectedMediaFiles.value.length + files.length > 5) {
    notify.error('Bạn chỉ được tải lên tối đa 5 hình ảnh/video!')
    return
  }

  Array.from(files).forEach((file) => {
    selectedMediaFiles.value.push(file)
    const previewUrl = URL.createObjectURL(file)
    mediaPreviewUrls.value.push(previewUrl)
  })

  if (fileInputRef.value) fileInputRef.value.value = ''
}

const removeMedia = (index: number) => {
  const urlToRevoke = mediaPreviewUrls.value[index]
  if (urlToRevoke) URL.revokeObjectURL(urlToRevoke)
  mediaPreviewUrls.value.splice(index, 1)
  selectedMediaFiles.value.splice(index, 1)
}

const openReviewModalForProduct = (order: any, item: any) => {
  orderToReview.value = order
  selectedItemToReview.value = item
  selectedProductToReview.value = item.variant?.product?.id || item.variant?.productId

  reviewContent.value = ''
  reviewRating.value = 5
  selectedMediaFiles.value = []
  mediaPreviewUrls.value.forEach((url) => URL.revokeObjectURL(url))
  mediaPreviewUrls.value = []

  isReviewModalOpen.value = true
}

const closeReviewModal = () => {
  isReviewModalOpen.value = false
  orderToReview.value = null
  selectedProductToReview.value = null
  selectedItemToReview.value = null
  mediaPreviewUrls.value.forEach((url) => URL.revokeObjectURL(url))
  mediaPreviewUrls.value = []
  selectedMediaFiles.value = []
}

const submitReview = async () => {
  if (!reviewContent.value.trim()) {
    notify.error('Vui lòng nhập nội dung đánh giá!')
    return
  }
  if (!selectedProductToReview.value) {
    notify.error('Không xác định được sản phẩm cần đánh giá!')
    return
  }

  isSubmittingReview.value = true
  try {
    const createdComment = await CommentService.createComment(selectedProductToReview.value, {
      content: reviewContent.value,
      rating: reviewRating.value,
    })

    const commentId = createdComment.id || createdComment.data?.id

    if (commentId && selectedMediaFiles.value.length > 0) {
      const uploadPromises = selectedMediaFiles.value.map((file) =>
        MediaService.uploadReviewMedia(commentId, file),
      )
      await Promise.all(uploadPromises)
    }

    notify.success('Cảm ơn bạn đã đánh giá sản phẩm!')
    closeReviewModal()
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá!'
    notify.error(errorMsg)
  } finally {
    isSubmittingReview.value = false
  }
}

onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      const userData = JSON.parse(userStr)
      userId.value = userData.id
    } catch (e) {
      console.error('Lỗi đọc thông tin user từ localStorage', e)
    }
  }
  if (orderId) fetchDetail()
})
</script>

<template>
  <div class="max-w-5xl mx-auto p-4 md:p-8">
    <div v-if="loading" class="p-10 text-center text-gray-500">
      Đang tải chi tiết đơn hàng...
    </div>

    <div v-else-if="selectedOrder" class="animate-fadeIn">
      <button
        @click="goBack"
        class="mb-6 flex items-center text-gray-600 hover:text-black transition-colors font-medium"
      >
        &larr; Quay lại danh sách đơn hàng
      </button>

      <div class="bg-white border rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
        <div class="bg-gray-50 p-6 border-b">
          <div class="flex flex-wrap justify-between items-center gap-4 mb-4">
            <span class="font-bold text-lg">Mã đơn: {{ selectedOrder.code }}</span>
            <div class="flex flex-wrap items-center gap-3">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-sm font-semibold',
                  getStatusInfo(selectedOrder.status).color,
                ]"
              >
                {{ getStatusInfo(selectedOrder.status).label }}
              </span>
              <button
                v-if="selectedOrder.status === 'PENDING'"
                @click="handleCancelOrder(selectedOrder.id)"
                :disabled="isCanceling"
                class="px-4 py-1.5 border border-red-500 text-red-600 hover:bg-red-50 rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {{ isCanceling ? 'Đang hủy...' : 'Hủy đơn hàng' }}
              </button>
              <button
                v-if="['COMPLETED', 'CANCELLED'].includes(selectedOrder.status)"
                @click="handleReorder(selectedOrder)"
                class="px-4 py-1.5 border border-green-500 text-green-600 hover:bg-green-50 rounded-md text-sm font-semibold transition-colors"
              >
                Mua lại
              </button>
            </div>
          </div>

          <div
            v-if="selectedOrder.status !== 'CANCELLED'"
            class="flex items-center justify-between mt-8 px-4 relative"
          >
            <div
              v-for="step in [0, 1, 2, 3]"
              :key="step"
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center z-10 font-bold transition-colors duration-300',
                getStatusInfo(selectedOrder.status).step >= step
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-500',
              ]"
            >
              {{ step + 1 }}
            </div>
            <div
              class="absolute h-1 bg-gray-200 left-8 right-8 top-3.5 z-0 overflow-hidden rounded-full"
            >
              <div
                class="h-full bg-green-500 transition-all duration-500 ease-in-out"
                :style="{ width: `${(getStatusInfo(selectedOrder.status).step / 3) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="font-bold mb-4 text-gray-800">Sản phẩm đã đặt</h3>
            <div class="space-y-4">
              <div
                v-for="item in selectedOrder.orderItems"
                :key="item.id"
                @click="goToProduct(item.variant?.product?.id || item.variant?.productId)"
                class="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group"
              >
                <div
                  class="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border group-hover:border-green-300 transition-colors"
                >
                  <img
                    :src="item.variant?.product?.mainImage || '/placeholder.jpg'"
                    alt="product"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <p
                    class="font-medium text-sm text-gray-800 group-hover:text-green-600 transition-colors"
                  >
                    {{ item.variant?.name }}
                  </p>
                  <p class="font-semibold text-sm mt-1">{{ formatCurrency(item.price) }}</p>
                  <div class="flex items-center justify-between mt-2">
                    <p class="text-xs text-gray-500">Số lượng: x{{ item.quantity }}</p>
                    <button
                      v-if="selectedOrder.status === 'COMPLETED'"
                      @click.stop="openReviewModalForProduct(selectedOrder, item)"
                      class="px-3 py-1 bg-white border border-green-500 text-green-600 hover:bg-green-50 rounded shadow-sm text-xs font-semibold transition-colors"
                    >
                      Đánh giá
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4 text-sm">
            <div class="bg-orange-50 p-4 rounded-xl">
              <p class="font-bold text-orange-800 mb-1">Địa chỉ giao hàng</p>
              <p class="text-orange-900 leading-relaxed">{{ selectedOrder.shippingAddress }}</p>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-600">Phương thức thanh toán:</span>
              <span class="font-medium text-gray-800">{{
                  selectedOrder.paymentMethod?.name || 'Thanh toán khi nhận hàng (COD)'
                }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold pt-2 text-red-600">
              <span>Tổng cộng:</span>
              <span>{{ formatCurrency(selectedOrder.totalAmount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="isReviewModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn px-4"
      >
        <div class="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 relative">
          <h2 class="text-xl font-bold mb-5 text-gray-800">Đánh giá sản phẩm</h2>
          <div class="mb-5 p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-4">
            <div
              class="w-14 h-14 bg-white rounded-lg border border-gray-100 overflow-hidden flex-shrink-0"
            >
              <img
                :src="selectedItemToReview?.variant?.product?.mainImage || '/placeholder.jpg'"
                alt="img"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <p class="text-sm font-bold text-gray-800 line-clamp-2">
                {{ selectedItemToReview?.variant?.name }}
              </p>
              <p class="text-xs text-gray-500 mt-1">Thuộc đơn: {{ orderToReview?.code }}</p>
            </div>
          </div>

          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-700 mb-2">Chất lượng sản phẩm</label>
            <div class="flex gap-2">
              <button
                v-for="star in 5"
                :key="star"
                @click="reviewRating = star"
                class="text-3xl transition-transform hover:scale-110 focus:outline-none"
                :class="star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'"
              >
                ★
              </button>
            </div>
          </div>

          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-700 mb-2"
            >Chia sẻ trải nghiệm của bạn</label
            >
            <textarea
              v-model="reviewContent"
              rows="3"
              placeholder="Sản phẩm dùng tốt không? Đóng gói như thế nào?"
              class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
            ></textarea>
          </div>

          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <label class="block text-sm font-medium text-gray-700">Thêm hình ảnh/video</label>
              <span class="text-xs text-gray-400">(Tối đa 5 file)</span>
            </div>
            <input
              type="file"
              ref="fileInputRef"
              @change="handleFileChange"
              multiple
              accept="image/*,video/*"
              class="hidden"
            />
            <div class="flex flex-wrap gap-3">
              <div
                v-for="(url, index) in mediaPreviewUrls"
                :key="index"
                class="relative w-16 h-16 rounded-lg border border-gray-200 overflow-hidden group"
              >
                <img
                  v-if="selectedMediaFiles[index]?.type?.startsWith('image/')"
                  :src="url"
                  class="w-full h-full object-cover"
                />
                <video v-else :src="url" class="w-full h-full object-cover"></video>
                <button
                  @click="removeMedia(index)"
                  class="absolute top-0.5 right-0.5 bg-black bg-opacity-50 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span class="text-[10px] font-bold">✕</span>
                </button>
              </div>
              <button
                v-if="mediaPreviewUrls.length < 5"
                @click="triggerFileInput"
                class="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-500 transition-colors"
              >
                <span class="text-xl">+</span>
              </button>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              @click="closeReviewModal"
              :disabled="isSubmittingReview"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Trở lại
            </button>
            <button
              @click="submitReview"
              :disabled="isSubmittingReview"
              class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition shadow"
            >
              {{ isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.2s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
