<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@/utils/notifier.ts'
import { OrderService } from '../service/order.ts'
import { Cart } from '../service/cart.ts'

const router = useRouter()
const userId = ref<number | null>(null)

const orders = ref<any[]>([])
const loading = ref(false)
const isCanceling = ref(false)

// --- CẤU HÌNH CÁC TABS ---
const activeTab = ref<string>('ALL')

const tabs = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'PENDING', label: 'Chờ xử lý' },
  { id: 'PAID', label: 'Đã thanh toán' },
  { id: 'SHIPPING', label: 'Đang giao' },
  { id: 'COMPLETED', label: 'Hoàn thành' },
  { id: 'CANCELLED', label: 'Đã hủy' },
]

const getOrderCount = (tabId: string) => {
  if (tabId === 'ALL') return orders.value.length
  return orders.value.filter((o) => o.status === tabId).length
}

const displayedOrders = computed(() => {
  if (activeTab.value === 'ALL') return orders.value
  return orders.value.filter((o) => o.status === activeTab.value)
})

// --- CÁC HÀM FORMAT ---
const formatCurrency = (amount: number | string) => {
  if (!amount) return '0đ'
  return Number(amount).toLocaleString('vi-VN') + 'đ'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN')
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
const fetchOrders = async () => {
  if (!userId.value) return
  loading.value = true
  try {
    orders.value = await OrderService.getOrdersByUser(userId.value)
  } catch (error: any) {
    notify.error(error?.message || 'Lỗi tải danh sách đơn hàng!')
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
    const index = orders.value.findIndex((o) => o.id === id)
    if (index !== -1) {
      orders.value[index].status = 'CANCELLED'
    }
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

// --- CHUYỂN TRANG CHI TIẾT ---
const viewDetail = (id: number) => {
  router.push({ name: 'detailorders', params: { id: id } })
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
  if (userId.value) fetchOrders()
})
</script>

<template>
  <div class="max-w-5xl mx-auto p-4 md:p-8">
    <div v-if="loading && orders.length === 0" class="p-10 text-center text-gray-500">
      Đang tải thông tin...
    </div>

    <div v-else>
      <div class="mb-8 border-b border-gray-200 overflow-x-auto hide-scrollbar">
        <nav class="-mb-px flex space-x-6 min-w-max" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'whitespace-nowrap border-b-2 py-4 px-2 text-sm md:text-base font-bold transition-colors flex items-center gap-2',
            ]"
          >
            {{ tab.label }}
            <span
              v-if="getOrderCount(tab.id) > 0"
              :class="[
                activeTab === tab.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600',
                'rounded-full px-2.5 py-0.5 text-xs font-medium',
              ]"
            >
              {{ getOrderCount(tab.id) }}
            </span>
          </button>
        </nav>
      </div>

      <div class="grid gap-4">
        <template v-if="displayedOrders.length > 0">
          <div
            v-for="order in displayedOrders"
            :key="order.id"
            @click="viewDetail(order.id)"
            class="bg-white border rounded-xl p-5 cursor-pointer hover:border-green-400 hover:shadow-md transition-all group flex flex-col"
          >
            <div class="flex flex-wrap justify-between items-center w-full">
              <div class="flex gap-4 items-center">
                <div :class="['p-3 rounded-full', getStatusInfo(order.status).color]">📦</div>
                <div>
                  <p class="font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                    #{{ order.code }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">{{ formatDate(order.createdAt) }}</p>
                </div>
              </div>
              <div class="text-right mt-2 md:mt-0">
                <p class="font-bold text-gray-800">{{ formatCurrency(order.totalAmount) }}</p>
                <span
                  :class="[
                    'inline-block mt-2 text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded',
                    getStatusInfo(order.status).color,
                  ]"
                >
                  {{ getStatusInfo(order.status).label }}
                </span>
              </div>
            </div>
            <div
              class="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3 w-full"
              @click.stop
            >
              <button
                v-if="order.status === 'PENDING'"
                @click="handleCancelOrder(order.id)"
                :disabled="isCanceling"
                class="px-4 py-1.5 border border-red-500 text-red-500 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
              >
                Hủy đơn
              </button>
              <button
                v-if="['COMPLETED', 'CANCELLED'].includes(order.status)"
                @click="handleReorder(order)"
                class="px-4 py-1.5 border border-green-500 text-green-600 hover:bg-green-50 rounded-md text-sm font-medium transition-colors"
              >
                Mua lại
              </button>
            </div>
          </div>
        </template>
        <div v-else class="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p class="text-gray-400">Không có đơn hàng nào ở trạng thái này.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
