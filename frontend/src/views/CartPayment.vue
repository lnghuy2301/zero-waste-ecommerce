<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Thêm router để chuyển trang
import { Cart } from '../service/cart.ts';
import { Profile } from '@/service/profile.ts';
import OrderService from "@/service/order.ts";

const router = useRouter();
const cartItems = ref<any[]>([]);
const loading = ref(false);
const selectedIds = ref<number[]>([]);
const accountId = ref<number | null>(null);

const shippingInfo = ref({
  fullName: '',
  phone: '',
  address: '',
  note: ''
});

const paymentMethod = ref('cod'); // Mặc định là COD

// --- HELPER ---
const formatVND = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
};

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return 'https://placehold.co/400x400?text=No+Image';
  if (path.startsWith('http')) return path;
  return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`;
};

const syncHeaderCart = () => {
  window.dispatchEvent(new CustomEvent('cart-updated'));
};

// --- COMPUTED ---
const selectedItems = computed(() =>
  cartItems.value.filter(item => selectedIds.value.includes(item.id))
);

const subtotal = computed(() => {
  return selectedItems.value.reduce((sum, item) => {
    const price = item.variant?.price || item.product?.price || 0;
    return sum + (Number(price) * item.quantity);
  }, 0);
});

const shippingFee = computed(() => (subtotal.value >= 500000 || subtotal.value === 0 ? 0 : 30000));
const total = computed(() => subtotal.value + shippingFee.value);

const isAllSelected = computed({
  get: () => cartItems.value.length > 0 && selectedIds.value.length === cartItems.value.length,
  set: (val) => { selectedIds.value = val ? cartItems.value.map(item => item.id) : []; }
});

// --- METHODS ---
const fetchData = async () => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return;
  const user = JSON.parse(userJson);
  accountId.value = Number(user.id);
  loading.value = true;
  try {
    const [cartData, profileData] = await Promise.all([
      Cart.getByUser(Number(user.id)),
      Profile.getCustomerProfile(Number(user.id))
    ]);
    cartItems.value = Array.isArray(cartData) ? cartData : (cartData.data || []);
    selectedIds.value = cartItems.value.map((item: any) => item.id);
    if (profileData) {
      shippingInfo.value.fullName = profileData.fullName || '';
      shippingInfo.value.phone = profileData.phone || '';
      shippingInfo.value.address = profileData.address || '';
    }
    syncHeaderCart();
  } finally {
    loading.value = false;
  }
};

const updateQuantity = async (item: any, change: number) => {
  const newQty = item.quantity + change;
  if (newQty < 1) return;
  const oldQty = item.quantity;
  item.quantity = newQty;
  try {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    const vId = Number(item.variantId || item.variant?.id);
    const payload = {
      accountId: Number(user?.id),
      variantId: vId,
      quantity: Number(newQty)
    };
    await Cart.update(item.id, payload);
    syncHeaderCart();
  } catch (e: any) {
    item.quantity = oldQty;
  }
};

const removeItem = async (id: number) => {
  if (!confirm("Xóa sản phẩm này?")) return;
  await Cart.delete(id);
  cartItems.value = cartItems.value.filter(i => i.id !== id);
  selectedIds.value = selectedIds.value.filter(sid => sid !== id);
  syncHeaderCart();
};

// --- XỬ LÝ ĐẶT HÀNG ---
const handleSubmit = async () => {
  if (selectedItems.value.length === 0) return alert("Vui lòng chọn sản phẩm!");
  if (!shippingInfo.value.fullName || !shippingInfo.value.phone || !shippingInfo.value.address) {
    return alert("Vui lòng điền đầy đủ thông tin giao hàng!");
  }

  try {
    // CHUẨN HÓA PAYLOAD THEO ĐÚNG OrderRequestDto
    const orderPayload = {
      accountId: Number(accountId.value),
      // Gộp Tên + SĐT vào địa chỉ vì DTO của bạn chỉ có mỗi trường shippingAddress
      shippingAddress: `${shippingInfo.value.fullName} - ${shippingInfo.value.phone} - ${shippingInfo.value.address}`,

      // QUAN TRỌNG: Backend cần ID (số nguyên), không phải tên phương thức
      // Giả sử: COD là 1, Chuyển khoản là 2 (Bạn hãy kiểm tra lại ID trong DB của bạn)
      paymentMethodId: paymentMethod.value === 'cod' ? 1 : 2,

      // Danh sách sản phẩm (OrderDetailRequestDto)
      items: selectedItems.value.map(item => ({
        variantId: Number(item.variantId || item.variant?.id),
        quantity: Number(item.quantity),
        // bundleId: item.bundleId ? Number(item.bundleId) : undefined // Mở ra nếu có dùng bundle
      }))
    };

    console.log('Dữ liệu gửi lên Backend (Chuẩn DTO):', orderPayload);

    // Gọi API từ Order service bạn đã viết
    const response = await OrderService.createOrder(orderPayload);

    if (response) {
      alert("Đặt hàng thành công!");

      // Xóa giỏ hàng sau khi đặt thành công
      await Cart.deleteList(selectedIds.value);
      syncHeaderCart();

      // Chuyển hướng sang trang đơn hàng
      router.push('/orders');
    }
  } catch (error: any) {
    console.error("Lỗi đặt hàng chi tiết:", error.response?.data);
    const serverMessage = error.response?.data?.message;
    alert("Đặt hàng thất bại: " + (Array.isArray(serverMessage) ? serverMessage.join(', ') : serverMessage));
  }
};

onMounted(fetchData);
</script>

<template>
  <main class="mx-auto max-w-[1200px] px-4 py-10 bg-[#f8fafc] min-h-screen font-sans">
    <div class="mb-10 text-center lg:text-left">
      <h2 class="text-4xl font-black text-slate-900 uppercase italic">Thanh Toán</h2>
      <p class="text-slate-500 font-medium mt-2 tracking-tight">Dự án Recycle Store - Zero Waste</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div class="lg:col-span-5">
        <div class="bg-white rounded-[2rem] p-8 shadow-xl border-2 border-slate-100">
          <div class="flex items-center justify-between mb-8 pb-4 border-b-2 border-dashed">
            <div class="flex items-center gap-3">
              <input type="checkbox" v-model="isAllSelected" class="w-5 h-5 accent-[#658a22]" />
              <span class="font-black text-slate-800 uppercase text-sm">Chọn Tất Cả ({{ cartItems.length }})</span>
            </div>
          </div>

          <div class="space-y-6 max-h-[400px] overflow-y-auto pr-2">
            <div v-for="item in cartItems" :key="item.id" class="flex gap-4 items-center">
              <input type="checkbox" :value="item.id" v-model="selectedIds" class="w-4 h-4 accent-[#658a22]" />
              <div class="w-16 h-16 rounded-xl bg-slate-50 border">
                <img :src="getImageUrl(item.variant?.product?.mainImage || item.product?.mainImage)" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-slate-900 text-xs truncate">{{ item.variant?.product?.name }}</h4>
                <div class="flex justify-between mt-2">
                  <div class="flex items-center bg-slate-100 rounded-lg">
                    <button @click="updateQuantity(item, -1)" class="px-2">-</button>
                    <span class="px-2 text-xs font-bold">{{ item.quantity }}</span>
                    <button @click="updateQuantity(item, 1)" class="px-2">+</button>
                  </div>
                  <span class="font-bold text-[#658a22] text-sm">{{ formatVND(item.variant?.price || item.product?.price) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t-2 border-slate-100 space-y-3 font-bold text-xs uppercase text-slate-400">
            <div class="flex justify-between"><span>Tạm tính</span><span>{{ formatVND(subtotal) }}</span></div>
            <div class="flex justify-between"><span>Phí ship</span><span>{{ shippingFee === 0 ? 'Free' : formatVND(shippingFee) }}</span></div>
            <div class="flex justify-between text-slate-900 text-xl pt-4 border-t italic">
              <span>Tổng</span><span class="text-[#658a22]">{{ formatVND(total) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 space-y-8">
        <section class="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-slate-100">
          <h3 class="text-xl font-black mb-6 uppercase italic flex items-center gap-3">
            <span class="bg-[#658a22] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">01</span>
            Thông Tin Giao Hàng
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <input v-model="shippingInfo.fullName" placeholder="Họ tên" class="col-span-1 p-4 bg-slate-50 rounded-2xl outline-none focus:border-[#658a22] border-2 border-transparent" />
            <input v-model="shippingInfo.phone" placeholder="Số điện thoại" class="col-span-1 p-4 bg-slate-50 rounded-2xl outline-none focus:border-[#658a22] border-2 border-transparent" />
            <input v-model="shippingInfo.address" placeholder="Địa chỉ chi tiết" class="col-span-2 p-4 bg-slate-50 rounded-2xl outline-none focus:border-[#658a22] border-2 border-transparent" />
            <textarea v-model="shippingInfo.note" placeholder="Ghi chú đơn hàng..." class="col-span-2 p-4 bg-slate-50 rounded-2xl outline-none h-24 border-2 border-transparent"></textarea>
          </div>
        </section>

        <section class="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-slate-100">
          <h3 class="text-xl font-black mb-6 uppercase italic flex items-center gap-3">
            <span class="bg-[#658a22] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">02</span>
            Thanh Toán
          </h3>
          <div class="space-y-3">
            <label :class="['flex items-center p-5 rounded-2xl cursor-pointer border-2 transition-all', paymentMethod === 'cod' ? 'border-[#658a22] bg-[#f4f7ee]' : 'border-slate-50 bg-slate-50']">
              <input type="radio" v-model="paymentMethod" value="cod" class="w-4 h-4 accent-[#658a22]" />
              <span class="ml-3 font-bold uppercase text-sm">Tiền mặt (COD)</span>
            </label>
            <label :class="['flex items-center p-5 rounded-2xl cursor-pointer border-2 transition-all', paymentMethod === 'bank_transfer' ? 'border-[#658a22] bg-[#f4f7ee]' : 'border-slate-50 bg-slate-50']">
              <input type="radio" v-model="paymentMethod" value="bank_transfer" class="w-4 h-4 accent-[#658a22]" />
              <span class="ml-3 font-bold uppercase text-sm">Chuyển khoản / QR</span>
            </label>
          </div>

          <button @click="handleSubmit" class="w-full mt-8 bg-[#1e293b] hover:bg-black text-white p-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-lg active:scale-95">
            Xác Nhận Đặt Hàng | {{ formatVND(total) }}
          </button>
        </section>
      </div>
    </div>
  </main>
</template>
