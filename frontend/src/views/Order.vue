<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import OrderService from '../service/order.ts';
import OrderDetailService from '../service/order_detail.ts';

const router = useRouter();
const userId = ref<number | null>(null);

const orders = ref<any[]>([]);
const selectedOrder = ref<any>(null);
const loading = ref(false);
const isCanceling = ref(false);

// --- STATE CHO ĐÁNH GIÁ (REVIEW) ---
const isReviewModalOpen = ref(false);
const orderToReview = ref<any>(null);
const reviewContent = ref('');
const reviewRating = ref(5);

// --- CẤU HÌNH CÁC TABS ---
const activeTab = ref<string>('ALL');

const tabs = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'PENDING', label: 'Chờ xử lý' },
  { id: 'PAID', label: 'Đã thanh toán' },
  { id: 'SHIPPING', label: 'Đang giao' },
  { id: 'COMPLETED', label: 'Hoàn thành' },
  { id: 'CANCELLED', label: 'Đã hủy' }
];

const getOrderCount = (tabId: string) => {
  if (tabId === 'ALL') return orders.value.length;
  return orders.value.filter(o => o.status === tabId).length;
};

const displayedOrders = computed(() => {
  if (activeTab.value === 'ALL') return orders.value;
  return orders.value.filter(o => o.status === activeTab.value);
});

// --- CÁC HÀM FORMAT ---
const formatCurrency = (amount: number | string) => {
  if (!amount) return '0đ';
  return Number(amount).toLocaleString('vi-VN') + 'đ';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const getStatusInfo = (status: string) => {
  const map: Record<string, any> = {
    'PENDING': { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700', step: 0 },
    'PAID': { label: 'Đã thanh toán', color: 'bg-blue-100 text-blue-700', step: 1 },
    'SHIPPING': { label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-700', step: 2 },
    'COMPLETED': { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', step: 3 },
    'CANCELLED': { label: 'Đã hủy', color: 'bg-red-100 text-red-700', step: -1 },
  };
  return map[status] || { label: status, color: 'bg-gray-100 text-gray-700', step: 0 };
};

// --- CÁC HÀM GỌI API ---
const fetchOrders = async () => {
  if (!userId.value) return;
  loading.value = true;
  try {
    orders.value = await OrderService.getOrdersByUser(userId.value);
  } catch (error) {
    console.error("Lỗi tải đơn hàng:", error);
  } finally {
    loading.value = false;
  }
};

// ĐÃ CẬP NHẬT: GỌI THÊM API ORDER_DETAIL Ở ĐÂY
const viewDetail = async (id: number) => {
  loading.value = true;
  try {
    // 1. Lấy thông tin vỏ đơn hàng
    const orderData = await OrderService.getOrderById(id);

    // 2. Gọi API OrderDetail để lấy ruột đơn hàng
    const orderDetails = await OrderDetailService.getOrderDetailsByOrder(id);

    // 3. Gắn chi tiết vào đơn hàng để hiển thị
    if (orderData) {
      orderData.orderItems = orderDetails || [];
      selectedOrder.value = orderData;
    }
  } catch (error) {
    console.error("Lỗi tải chi tiết đơn hàng:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancelOrder = async (id: number) => {
  const confirmCancel = confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
  if (!confirmCancel) return;

  isCanceling.value = true;
  try {
    await OrderService.cancelOrder(id);
    alert("Đã hủy đơn hàng thành công!");

    if (selectedOrder.value && selectedOrder.value.id === id) {
      selectedOrder.value.status = 'CANCELLED';
    }
    const index = orders.value.findIndex(o => o.id === id);
    if (index !== -1) {
      orders.value[index].status = 'CANCELLED';
    }
  } catch (error) {
    console.error("Lỗi hủy đơn hàng:", error);
    alert("Không thể hủy đơn hàng lúc này.");
  } finally {
    isCanceling.value = false;
  }
};

// --- CÁC HÀM XỬ LÝ ĐIỀU HƯỚNG MỚI ---
const handleReorder = (order: any) => {
  // Tránh lỗi nếu orderItems trống
  if (!order.orderItems || order.orderItems.length === 0) {
    alert("Đơn hàng này không có sản phẩm để mua lại.");
    return;
  }

  const itemsToReorder = order.orderItems.map((item: any) => ({
    variantId: item.variantId,
    quantity: item.quantity
  }));

  console.log("Đang thêm vào giỏ hàng các sản phẩm:", itemsToReorder);
  alert("Đã thêm các sản phẩm này vào giỏ hàng của bạn!");
  router.push('/cart');
};

const goToProduct = (productId: number | undefined) => {
  if (!productId) return;
  router.push(`/product/${productId}`);
};

// --- CÁC HÀM XỬ LÝ ĐÁNH GIÁ ---
const openReviewModal = (order: any) => {
  orderToReview.value = order;
  reviewContent.value = '';
  reviewRating.value = 5;
  isReviewModalOpen.value = true;
};

const closeReviewModal = () => {
  isReviewModalOpen.value = false;
  orderToReview.value = null;
};

const submitReview = async () => {
  if (!reviewContent.value.trim()) {
    alert("Vui lòng nhập nội dung đánh giá!");
    return;
  }

  console.log("Đang gửi đánh giá cho đơn:", orderToReview.value.id);
  alert("Cảm ơn bạn đã đánh giá đơn hàng!");
  closeReviewModal();
};

const backToList = () => {
  selectedOrder.value = null;
};

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      userId.value = userData.id;
    } catch (e) {
      console.error("Lỗi đọc thông tin user từ localStorage", e);
    }
  }

  if (userId.value) {
    fetchOrders();
  } else {
    console.warn("Chưa đăng nhập hoặc không tìm thấy ID");
  }
});
</script>

<template>
  <div class="max-w-5xl mx-auto p-4 md:p-8">
    <div v-if="loading && !selectedOrder && orders.length === 0" class="p-10 text-center text-gray-500">
      Đang tải thông tin...
    </div>

    <div v-else>
      <button
        v-if="selectedOrder"
        @click="backToList"
        class="mb-6 flex items-center text-gray-600 hover:text-black transition-colors font-medium"
      >
        &larr; Quay lại danh sách đơn hàng
      </button>

      <div v-else class="mb-8 border-b border-gray-200 overflow-x-auto hide-scrollbar">
        <nav class="-mb-px flex space-x-6 min-w-max" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'whitespace-nowrap border-b-2 py-4 px-2 text-sm md:text-base font-bold transition-colors flex items-center gap-2'
            ]"
          >
            {{ tab.label }}
            <span
              v-if="getOrderCount(tab.id) > 0"
              :class="[
                activeTab === tab.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600',
                'rounded-full px-2.5 py-0.5 text-xs font-medium'
              ]"
            >
              {{ getOrderCount(tab.id) }}
            </span>
          </button>
        </nav>
      </div>

      <div v-if="selectedOrder" class="bg-white border rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
        <div class="bg-gray-50 p-6 border-b">
          <div class="flex flex-wrap justify-between items-center gap-4 mb-4">
            <span class="font-bold text-lg">Mã đơn: {{ selectedOrder.code }}</span>
            <div class="flex flex-wrap items-center gap-3">
              <span :class="['px-3 py-1 rounded-full text-sm font-semibold', getStatusInfo(selectedOrder.status).color]">
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
                v-if="selectedOrder.status === 'COMPLETED'"
                @click="openReviewModal(selectedOrder)"
                class="px-4 py-1.5 bg-green-500 text-white hover:bg-green-600 rounded-md text-sm font-semibold transition-colors shadow-sm"
              >
                Đánh giá đơn hàng
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

          <div v-if="selectedOrder.status !== 'CANCELLED'" class="flex items-center justify-between mt-8 px-4 relative">
            <div
              v-for="step in [0, 1, 2, 3]"
              :key="step"
              :class="['w-8 h-8 rounded-full flex items-center justify-center z-10 font-bold', getStatusInfo(selectedOrder.status).step >= step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500']"
            >
              {{ step + 1 }}
            </div>
            <div class="absolute h-1 bg-gray-200 left-8 right-8 top-3.5 z-0"></div>
            <div
              class="absolute h-1 bg-green-500 left-8 top-3.5 z-0 transition-all duration-500"
              :style="{ width: `${(getStatusInfo(selectedOrder.status).step / 3) * 85}%` }"
            ></div>
          </div>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="font-bold mb-4 text-gray-800">Sản phẩm đã đặt</h3>
            <div class="space-y-2">
              <div
                v-for="item in selectedOrder.orderItems"
                :key="item.id"
                @click="goToProduct(item.variant?.product?.id || item.variant?.productId)"
                class="flex gap-4 items-center border-b border-gray-100 pb-3 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group"
              >
                <div class="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border group-hover:border-green-300 transition-colors">
                  <img :src="item.variant?.product?.mainImage || '/placeholder.jpg'" alt="product" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-sm text-gray-800 group-hover:text-green-600 transition-colors">{{ item.variant?.name }}</p>
                  <p class="text-xs text-gray-500 mt-1">SL: x{{ item.quantity }}</p>
                </div>
                <p class="font-semibold text-sm">{{ formatCurrency(item.price) }}</p>
              </div>
              <div v-if="!selectedOrder.orderItems || selectedOrder.orderItems.length === 0" class="text-gray-400 text-sm italic">
                Chưa có sản phẩm nào trong đơn hàng này.
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
              <span class="font-medium text-gray-800">{{ selectedOrder.paymentMethod?.name || 'Thanh toán khi nhận hàng (COD)' }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold pt-2 text-red-600">
              <span>Tổng cộng:</span>
              <span>{{ formatCurrency(selectedOrder.totalAmount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid gap-4">
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
                  <p class="font-bold text-gray-800 group-hover:text-green-600 transition-colors">#{{ order.code }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ formatDate(order.createdAt) }}</p>
                </div>
              </div>
              <div class="text-right mt-2 md:mt-0">
                <p class="font-bold text-gray-800">{{ formatCurrency(order.totalAmount) }}</p>
                <span :class="['inline-block mt-2 text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded', getStatusInfo(order.status).color]">
                  {{ getStatusInfo(order.status).label }}
                </span>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3 w-full" @click.stop>
              <button
                v-if="order.status === 'PENDING'"
                @click="handleCancelOrder(order.id)"
                :disabled="isCanceling"
                class="px-4 py-1.5 border border-red-500 text-red-500 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
              >
                Hủy đơn
              </button>

              <button
                v-if="order.status === 'COMPLETED'"
                @click="openReviewModal(order)"
                class="px-4 py-1.5 bg-green-500 text-white hover:bg-green-600 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Đánh giá
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

    <div v-if="isReviewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn px-4">
      <div class="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 relative">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Đánh giá đơn hàng #{{ orderToReview?.code }}</h2>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Chất lượng sản phẩm</label>
          <div class="flex gap-2">
            <button
              v-for="star in 5" :key="star"
              @click="reviewRating = star"
              class="text-3xl transition-transform hover:scale-110 focus:outline-none"
              :class="star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'"
            >
              ★
            </button>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Chia sẻ trải nghiệm của bạn</label>
          <textarea
            v-model="reviewContent"
            rows="4"
            placeholder="Sản phẩm dùng tốt không? Đóng gói như thế nào?"
            class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
          ></textarea>
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="closeReviewModal"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Trở lại
          </button>
          <button
            @click="submitReview"
            class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition shadow"
          >
            Gửi đánh giá
          </button>
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
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
