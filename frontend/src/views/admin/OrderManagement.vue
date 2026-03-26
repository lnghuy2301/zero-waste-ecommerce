<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Order from '@/service/order.ts'
import { notify } from '@/utils/notifier.ts'

const orders = ref<any[]>([])
const loading = ref(false)
const selectedOrderIds = ref<number[]>([])

const showDetailModal = ref(false)
const currentOrder = ref<any>(null)

// Load danh sách đơn hàng
const loadOrders = async () => {
  loading.value = true
  try {
    const res = await Order.getAllOrders()
    orders.value = Array.isArray(res) ? res : []
  } catch (e) {
    notify.error('Không tải được danh sách đơn hàng')
    orders.value = []
  } finally {
    loading.value = false
  }
}

// Click vào dòng để chọn
const toggleSelect = (id: number) => {
  const index = selectedOrderIds.value.indexOf(id)
  if (index > -1) {
    selectedOrderIds.value.splice(index, 1)
  } else {
    selectedOrderIds.value.push(id)
  }
}

// Xem chi tiết
const viewDetail = (order: any) => {
  currentOrder.value = order
  showDetailModal.value = true
}

// Cập nhật trạng thái (thêm nút cho từng trạng thái)
const updateStatus = async (id: number, status: string) => {
  if (!confirm(`Đổi trạng thái đơn hàng thành "${status}"?`)) return

  try {
    await Order.updateOrderStatus(id, status)
    notify.success(`Đã cập nhật thành ${status}`)
    loadOrders()
  } catch (e) {
    notify.error('Cập nhật trạng thái thất bại')
  }
}

// Hủy đơn
const cancelOrder = async (id: number) => {
  if (!confirm('Hủy đơn hàng này?')) return
  try {
    await Order.cancelOrder(id)
    notify.success('Hủy đơn hàng thành công')
    loadOrders()
  } catch (e) {
    notify.error('Hủy thất bại')
  }
}

// Xóa nhiều
const deleteSelected = async () => {
  if (selectedOrderIds.value.length === 0) return
  if (!confirm(`Xóa ${selectedOrderIds.value.length} đơn hàng?`)) return
  try {
    await Order.deleteListOrders(selectedOrderIds.value)
    notify.success('Xóa thành công')
    selectedOrderIds.value = []
    loadOrders()
  } catch (e) {
    notify.error('Xóa thất bại')
  }
}

onMounted(loadOrders)
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Quản lý Đơn hàng</h1>
        <p class="text-slate-500">Click vào dòng để chọn • Chỉ Admin</p>
      </div>
      <button
        v-if="selectedOrderIds.length > 0"
        @click="deleteSelected"
        class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
      >
        Xóa {{ selectedOrderIds.length }} đơn hàng
      </button>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-500">Đang tải đơn hàng...</div>

    <div v-else class="bg-white rounded-3xl shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-slate-100 border-b">
          <tr>
            <th class="px-6 py-4 text-left font-medium text-slate-700 w-10"></th>
            <th class="px-6 py-4 text-left font-medium text-slate-700">Mã đơn</th>
            <th class="px-6 py-4 text-left font-medium text-slate-700">Khách hàng ID</th>
            <th class="px-6 py-4 text-left font-medium text-slate-700">Tổng tiền</th>
            <th class="px-6 py-4 text-left font-medium text-slate-700">Trạng thái</th>
            <th class="px-6 py-4 text-left font-medium text-slate-700">Địa chỉ giao</th>
            <th class="px-6 py-4 text-left font-medium text-slate-700">Ngày tạo</th>
            <th class="px-6 py-4 text-center font-medium text-slate-700">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="order in orders"
            :key="order.id"
            @click="toggleSelect(order.id)"
            class="hover:bg-slate-50 cursor-pointer transition-all"
            :class="
              selectedOrderIds.includes(order.id) ? 'bg-[#f8fdf0] border-l-4 border-[#658a22]' : ''
            "
          >
            <td class="px-6 py-5 text-center">
              <div
                v-if="selectedOrderIds.includes(order.id)"
                class="w-5 h-5 mx-auto bg-[#658a22] text-white rounded-full flex items-center justify-center text-xs font-bold"
              >
                ✓
              </div>
            </td>
            <td class="px-6 py-5 font-medium text-slate-800">{{ order.code || 'N/A' }}</td>
            <td class="px-6 py-5 text-slate-800">{{ order.accountId }}</td>
            <td class="px-6 py-5 font-bold text-emerald-600">
              {{ Number(order.totalAmount || 0).toLocaleString('vi-VN') }}đ
            </td>
            <td class="px-6 py-5">
              <span
                :class="{
                  'inline-block px-4 py-1 text-xs font-bold rounded-full': true,
                  'bg-yellow-100 text-yellow-700': order.status === 'PENDING',
                  'bg-blue-100 text-blue-700': order.status === 'PAID',
                  'bg-purple-100 text-purple-700': order.status === 'SHIPPING',
                  'bg-green-100 text-green-700': order.status === 'COMPLETED',
                  'bg-red-100 text-red-700': order.status === 'CANCELLED',
                }"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-5 text-slate-600 text-sm">{{ order.shippingAddress }}</td>
            <td class="px-6 py-5 text-slate-600 text-sm">
              {{ new Date(order.createdAt).toLocaleString('vi-VN') }}
            </td>
            <td class="px-6 py-5 text-center space-x-3">
              <button
                @click.stop="viewDetail(order)"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                Chi tiết
              </button>

              <button
                v-if="order.status === 'PENDING'"
                @click.stop="updateStatus(order.id, 'PAID')"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                Đã thanh toán
              </button>

              <button
                v-if="order.status === 'PAID'"
                @click.stop="updateStatus(order.id, 'SHIPPING')"
                class="text-purple-600 hover:text-purple-700 font-medium"
              >
                Đang giao
              </button>

              <button
                v-if="order.status === 'SHIPPING'"
                @click.stop="updateStatus(order.id, 'COMPLETED')"
                class="text-green-600 hover:text-green-700 font-medium"
              >
                Hoàn thành
              </button>

              <button
                v-if="order.status === 'PENDING'"
                @click.stop="cancelOrder(order.id)"
                class="text-red-600 hover:text-red-700 font-medium"
              >
                Hủy
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Chi tiết đơn hàng -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"
      @click.self="showDetailModal = false"
    >
      <div
        class="bg-white rounded-[40px] w-full max-w-3xl p-10 shadow-2xl max-h-[90vh] overflow-auto"
        @click.stop
      >
        <h2 class="text-2xl font-black mb-6 flex items-center gap-3 text-slate-900">
          <span class="w-3 h-8 bg-[#658a22] rounded"></span>
          Chi tiết đơn hàng #{{ currentOrder?.code }}
        </h2>

        <div class="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p class="text-slate-500 text-sm">Tổng tiền</p>
            <p class="text-3xl font-bold text-emerald-600">
              {{ Number(currentOrder?.totalAmount || 0).toLocaleString('vi-VN') }}đ
            </p>
          </div>
          <div>
            <p class="text-slate-500 text-sm">Trạng thái</p>
            <span
              class="inline-block px-5 py-2 rounded-full font-bold text-sm"
              :class="{
                'bg-yellow-100 text-yellow-700': currentOrder?.status === 'PENDING',
                'bg-blue-100 text-blue-700': currentOrder?.status === 'PAID',
                'bg-purple-100 text-purple-700': currentOrder?.status === 'SHIPPING',
                'bg-green-100 text-green-700': currentOrder?.status === 'COMPLETED',
                'bg-red-100 text-red-700': currentOrder?.status === 'CANCELLED',
              }"
            >
              {{ currentOrder?.status }}
            </span>
          </div>
          <div>
            <p class="text-slate-500 text-sm">Địa chỉ giao hàng</p>
            <p class="font-medium text-slate-800">{{ currentOrder?.shippingAddress }}</p>
          </div>
          <div>
            <p class="text-slate-500 text-sm">Ngày tạo</p>
            <p class="font-medium text-slate-800">
              {{ new Date(currentOrder?.createdAt).toLocaleString('vi-VN') }}
            </p>
          </div>
        </div>

        <h3 class="font-bold text-lg mb-5 text-slate-900">Chi tiết sản phẩm</h3>
        <div class="space-y-5">
          <div
            v-for="item in currentOrder?.orderItems || []"
            :key="item.id"
            class="flex justify-between items-center border-b pb-5 last:border-0"
          >
            <div>
              <p class="font-semibold text-slate-800">{{ item.variant?.name || 'Sản phẩm' }}</p>
              <p class="text-sm text-slate-600">
                Số lượng: <span class="font-medium">{{ item.quantity }}</span>
              </p>
            </div>
            <div class="text-right">
              <p class="font-bold text-emerald-600 text-lg">
                {{ Number(item.price).toLocaleString('vi-VN') }}đ
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-10">
          <button
            @click="showDetailModal = false"
            class="px-10 py-3.5 border border-slate-300 rounded-2xl font-medium text-slate-700 hover:bg-slate-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
