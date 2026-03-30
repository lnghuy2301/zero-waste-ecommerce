<script setup lang="ts">
import { ref, onMounted, computed } from 'vue' // Thêm computed
import Order from '@/service/order.ts'
import { notify } from '@/utils/notifier.ts'

const orders = ref<any[]>([])
const loading = ref(false)
const selectedOrderIds = ref<number[]>([])

const showDetailModal = ref(false)
const currentOrder = ref<any>(null)

// --- PHẦN TÌM KIẾM MỚI ---
const searchAccountId = ref('')

// Logic lọc đơn hàng dựa trên ID khách hàng (accountId)
const filteredOrders = computed(() => {
  if (!searchAccountId.value.trim()) {
    return orders.value
  }
  return orders.value.filter((order) =>
    String(order.accountId).toLowerCase().includes(searchAccountId.value.trim().toLowerCase()),
  )
})
// -------------------------

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

// Cập nhật trạng thái
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
  <div class="max-w-7xl mx-auto p-6 bg-transparent min-h-screen">
    <div
      class="flex flex-wrap justify-between items-center mb-10 sticky top-0 z-40 bg-white/40 backdrop-blur-lg py-6 -mx-6 px-6 border-b border-white/20 shadow-sm"
    >
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Quản lý Đơn hàng</h1>
        <p class="text-slate-500 font-medium">Click vào dòng để chọn • Chỉ Admin</p>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative">
          <input
            v-model="searchAccountId"
            type="text"
            placeholder="Tìm ID khách hàng..."
            class="pl-6 pr-6 py-3 bg-white border-2 border-slate-100 focus:border-[#658a22] rounded-2xl outline-none transition-all w-64 font-bold text-slate-700 shadow-sm shadow-slate-100"
          />
        </div>

        <button
          v-if="selectedOrderIds.length > 0"
          @click="deleteSelected"
          class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-red-100 transition-all"
        >
          Xóa {{ selectedOrderIds.length }} đơn hàng
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center py-20 font-bold text-slate-400 uppercase tracking-widest animate-pulse"
    >
      Đang tải đơn hàng...
    </div>

    <div
      v-else
      class="bg-white/70 backdrop-blur-md rounded-[32px] shadow-xl overflow-hidden border border-white/30"
    >
      <table class="w-full">
        <thead class="bg-white/30 border-b border-white/20">
          <tr>
            <th
              class="px-6 py-5 text-left font-bold text-slate-400 uppercase text-[11px] tracking-widest w-10"
            ></th>
            <th
              class="px-6 py-5 text-left font-bold text-slate-400 uppercase text-[11px] tracking-widest"
            >
              Mã đơn
            </th>
            <th
              class="px-6 py-5 text-left font-bold text-slate-400 uppercase text-[11px] tracking-widest"
            >
              Khách hàng ID
            </th>
            <th
              class="px-6 py-5 text-left font-bold text-slate-400 uppercase text-[11px] tracking-widest"
            >
              Tổng tiền
            </th>
            <th
              class="px-6 py-5 text-left font-bold text-slate-400 uppercase text-[11px] tracking-widest"
            >
              Trạng thái
            </th>
            <th
              class="px-6 py-5 text-left font-bold text-slate-400 uppercase text-[11px] tracking-widest"
            >
              Địa chỉ giao
            </th>
            <th
              class="px-6 py-5 text-left font-bold text-slate-400 uppercase text-[11px] tracking-widest"
            >
              Ngày tạo
            </th>
            <th
              class="px-6 py-5 text-center font-bold text-slate-400 uppercase text-[11px] tracking-widest"
            >
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            @click="toggleSelect(order.id)"
            class="hover:bg-white/40 cursor-pointer transition-all group"
            :class="
              selectedOrderIds.includes(order.id) ? 'bg-[#f8fdf0] border-l-4 border-[#658a22]' : ''
            "
          >
            <td class="px-6 py-5 text-center">
              <div
                v-if="selectedOrderIds.includes(order.id)"
                class="w-5 h-5 mx-auto bg-[#658a22] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
              >
                ✓
              </div>
              <div
                v-else
                class="w-5 h-5 mx-auto border-2 border-slate-200 rounded-full group-hover:border-slate-300"
              ></div>
            </td>
            <td class="px-6 py-5 font-bold text-slate-800">{{ order.code || 'N/A' }}</td>
            <td class="px-6 py-5 font-bold text-slate-600">#{{ order.accountId }}</td>
            <td class="px-6 py-5 font-black text-emerald-600">
              {{ Number(order.totalAmount || 0).toLocaleString('vi-VN') }}đ
            </td>
            <td class="px-6 py-5">
              <span
                :class="{
                  'inline-block px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-xl': true,
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
            <td class="px-6 py-5 text-slate-500 text-sm font-medium max-w-[200px] truncate">
              {{ order.shippingAddress }}
            </td>
            <td class="px-6 py-5 text-slate-400 text-xs font-bold">
              {{ new Date(order.createdAt).toLocaleString('vi-VN') }}
            </td>
            <td class="px-6 py-5 text-center space-x-2">
              <button
                @click.stop="viewDetail(order)"
                class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all"
              >
                Chi tiết
              </button>

              <button
                v-if="order.status === 'PENDING'"
                @click.stop="updateStatus(order.id, 'PAID')"
                class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all"
              >
                Thanh toán
              </button>

              <button
                v-if="order.status === 'PAID'"
                @click.stop="updateStatus(order.id, 'SHIPPING')"
                class="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-100 transition-all"
              >
                Giao hàng
              </button>

              <button
                v-if="order.status === 'SHIPPING'"
                @click.stop="updateStatus(order.id, 'COMPLETED')"
                class="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-100 transition-all"
              >
                Xong
              </button>

              <button
                v-if="order.status === 'PENDING'"
                @click.stop="cancelOrder(order.id)"
                class="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all"
              >
                Hủy
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="showDetailModal = false"
    >
      <div
        class="bg-white/90 backdrop-blur-xl rounded-[40px] w-full max-w-3xl p-10 shadow-2xl max-h-[90vh] overflow-auto border border-white/50"
        @click.stop
      >
        <h2 class="text-2xl font-black mb-6 flex items-center gap-3 text-slate-900">
          <span class="w-3 h-8 bg-[#658a22] rounded-full"></span>
          Chi tiết đơn hàng #{{ currentOrder?.code }}
        </h2>

        <div class="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">
              Tổng tiền
            </p>
            <p class="text-3xl font-black text-emerald-600">
              {{ Number(currentOrder?.totalAmount || 0).toLocaleString('vi-VN') }}đ
            </p>
          </div>
          <div>
            <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">
              Trạng thái
            </p>
            <span
              class="inline-block px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-tight"
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
            <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">
              Địa chỉ giao hàng
            </p>
            <p class="font-bold text-slate-800">{{ currentOrder?.shippingAddress }}</p>
          </div>
          <div>
            <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">
              Ngày tạo
            </p>
            <p class="font-bold text-slate-800">
              {{ new Date(currentOrder?.createdAt).toLocaleString('vi-VN') }}
            </p>
          </div>
        </div>

        <h3 class="font-black text-lg mb-5 text-slate-900 uppercase tracking-tight">
          Danh sách sản phẩm
        </h3>
        <div class="space-y-4">
          <div
            v-for="item in currentOrder?.orderItems || []"
            :key="item.id"
            class="flex justify-between items-center bg-white/40 p-5 rounded-2xl border border-white/20 mb-4"
          >
            <div>
              <p class="font-bold text-slate-800 text-lg">{{ item.variant?.name || 'Sản phẩm' }}</p>
              <p class="text-sm text-slate-500 font-bold uppercase tracking-tighter">
                Số lượng: <span class="text-[#658a22]">{{ item.quantity }}</span>
              </p>
            </div>
            <div class="text-right">
              <p class="font-black text-emerald-600 text-xl">
                {{ Number(item.price).toLocaleString('vi-VN') }}đ
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-10">
          <button
            @click="showDetailModal = false"
            class="px-10 py-4 border-2 border-slate-100 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
