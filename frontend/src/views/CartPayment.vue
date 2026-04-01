<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Cart } from '../service/cart.ts'
import { Profile } from '@/service/profile.ts'
import { OrderService } from '@/service/order.ts'
import api from '@/service/api.ts' // ← thêm dòng này

const router = useRouter()
const cartItems = ref<any[]>([])
const loading = ref(false)
const selectedIds = ref<number[]>([])
const accountId = ref<number | null>(null)
const shippingInfo = ref({
  fullName: '',
  phone: '',
  address: '',
  note: '',
})
const paymentMethod = ref('cod')

// --- HELPER ---
const formatVND = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
}

const getImageUrl = (item: any) => {
  if (!item) return 'https://placehold.co/400x400/eef2e6/658a22?text=No+Image'
  const path =
    item.variant?.image ||
    item.variant?.mainImage ||
    item.variant?.product?.mainImage ||
    item.product?.mainImage ||
    item.image
  if (!path) return 'https://placehold.co/400x400/eef2e6/658a22?text=No+Image'
  if (path.startsWith('http')) return path
  return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`
}

const syncHeaderCart = () => {
  window.dispatchEvent(new CustomEvent('cart-updated'))
}

// --- COMPUTED ---
const selectedItems = computed(() =>
  cartItems.value.filter((item) => selectedIds.value.includes(item.id)),
)

const subtotal = computed(() => {
  return selectedItems.value.reduce((sum, item) => {
    const price = item.price || item.variant?.price || item.product?.price || 0
    return sum + Number(price) * item.quantity
  }, 0)
})

const shippingFee = computed(() => (subtotal.value >= 500000 || subtotal.value === 0 ? 0 : 30000))

const total = computed(() => subtotal.value + shippingFee.value)

const isAllSelected = computed({
  get: () => cartItems.value.length > 0 && selectedIds.value.length === cartItems.value.length,
  set: (val) => {
    selectedIds.value = val ? cartItems.value.map((item) => item.id) : []
  },
})

// --- METHODS ---
const fetchData = async () => {
  const userJson = localStorage.getItem('user')
  if (!userJson) return
  const user = JSON.parse(userJson)
  accountId.value = Number(user.id)
  loading.value = true
  try {
    // Lấy giỏ hàng
    const cartRes = await Cart.getByUser(Number(user.id))
    let rawItems = Array.isArray(cartRes) ? cartRes : cartRes.data || []

    // Lấy thông tin đầy đủ của từng variant (bao gồm ảnh)
    for (let item of rawItems) {
      const variantId = item.variantId || item.variant?.id
      if (variantId) {
        try {
          const variantRes = await api.get(`/product-variant/${variantId}`)
          item.variant = variantRes.data
        } catch (e) {
          console.warn(`Không lấy được variant ${variantId}`)
        }
      }
    }
    cartItems.value = rawItems
    // Mặc định chọn tất cả
    selectedIds.value = cartItems.value.map((item: any) => item.id)

    // Load profile
    const profileData = await Profile.getCustomerProfile(Number(user.id))
    if (profileData) {
      shippingInfo.value.fullName = profileData.fullName || ''
      shippingInfo.value.phone = profileData.phone || ''
      shippingInfo.value.address = profileData.address || ''
    }
    syncHeaderCart()
  } catch (e) {
    console.error('Lỗi tải giỏ hàng:', e)
  } finally {
    loading.value = false
  }
}

const updateQuantity = async (item: any, change: number) => {
  const newQty = item.quantity + change
  if (newQty < 1) return
  const oldQty = item.quantity
  item.quantity = newQty
  try {
    const userJson = localStorage.getItem('user')
    const user = userJson ? JSON.parse(userJson) : null
    const vId = Number(item.variantId || item.variant?.id)
    const payload = {
      accountId: Number(user?.id),
      variantId: vId,
      quantity: Number(newQty),
    }
    await Cart.update(item.id, payload)
    syncHeaderCart()
  } catch (e: any) {
    item.quantity = oldQty
  }
}

const removeItem = async (id: number) => {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
  try {
    await Cart.delete(id)
    cartItems.value = cartItems.value.filter((i) => i.id !== id)
    selectedIds.value = selectedIds.value.filter((sid) => sid !== id)
    syncHeaderCart()
  } catch (error) {
    alert('Lỗi khi xóa sản phẩm.')
  }
}

const removeSelectedItems = async () => {
  if (selectedIds.value.length === 0) return alert('Vui lòng chọn sản phẩm!')
  if (!confirm(`Xóa ${selectedIds.value.length} sản phẩm đã chọn?`)) return
  try {
    await Cart.deleteList(selectedIds.value)
    cartItems.value = cartItems.value.filter((item) => !selectedIds.value.includes(item.id))
    selectedIds.value = []
    syncHeaderCart()
  } catch (error) {
    alert('Lỗi khi xóa danh sách.')
  }
}

const handleSubmit = async () => {
  if (selectedItems.value.length === 0) return alert('Vui lòng chọn sản phẩm!')
  if (!shippingInfo.value.fullName || !shippingInfo.value.phone || !shippingInfo.value.address) {
    return alert('Vui lòng điền đầy đủ thông tin giao hàng!')
  }
  try {
    const orderPayload = {
      accountId: Number(accountId.value),
      shippingAddress: `${shippingInfo.value.fullName} - ${shippingInfo.value.phone} - ${shippingInfo.value.address}`,
      paymentMethodId: paymentMethod.value === 'cod' ? 1 : 2,
      items: selectedItems.value.map((item) => ({
        variantId: Number(item.variantId || item.variant?.id),
        quantity: Number(item.quantity),
      })),
    }
    const response = await OrderService.createOrder(orderPayload)
    if (response) {
      alert('Đặt hàng thành công!')
      await Cart.deleteList(selectedIds.value)
      syncHeaderCart()
      router.push('/orders')
    }
  } catch (error: any) {
    alert('Đặt hàng thất bại!')
  }
}

onMounted(fetchData)
</script>

<template>
  <main
    class="mx-auto max-w-[1200px] px-4 py-10 bg-white/60 backdrop-blur-md min-h-screen font-sans rounded-3xl my-6 shadow-2xl border border-white/50"
  >
    <div class="mb-10 text-center lg:text-left px-4">
      <h2 class="text-4xl font-black text-slate-900 uppercase italic">Thanh Toán</h2>
      <p class="text-[#658a22] font-black mt-2 tracking-tight uppercase text-xs italic">
        Cửa hàng Zero Waste - Sống Xanh Mỗi Ngày
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div class="lg:col-span-5">
        <div class="bg-white/80 rounded-[2rem] p-6 shadow-xl border-2 border-white/50">
          <div
            class="flex items-center justify-between mb-8 pb-4 border-b-2 border-dashed border-slate-100"
          >
            <div class="flex items-center gap-3">
              <input type="checkbox" v-model="isAllSelected" class="w-5 h-5 accent-[#658a22]" />
              <span class="font-black text-slate-800 uppercase text-xs">
                Tất cả ({{ cartItems.length }})
              </span>
            </div>
            <button
              @click="removeSelectedItems"
              class="text-red-500 font-black text-[10px] uppercase hover:underline"
              :disabled="selectedIds.length === 0"
            >
              XÓA ĐÃ CHỌN
            </button>
          </div>

          <div class="space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex gap-4 items-center bg-white p-3 rounded-2xl border border-slate-50 shadow-sm"
            >
              <input
                type="checkbox"
                :value="item.id"
                v-model="selectedIds"
                class="w-4 h-4 accent-[#658a22]"
              />

              <div
                class="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 shrink-0 overflow-hidden"
              >
                <img
                  :src="getImageUrl(item)"
                  class="w-full h-full object-cover"
                  alt="product"
                  onerror="this.src = 'https://placehold.co/400x400/eef2e6/658a22?text=No+Image'"
                />
              </div>

              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-slate-900 text-[13px] leading-snug line-clamp-2 mb-1">
                  {{ item.variant?.product?.name || item.product?.name || item.name || 'Sản phẩm' }}
                </h4>
                <p
                  v-if="item.variant?.name"
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2"
                >
                  {{ item.variant.name }}
                </p>

                <div class="flex justify-between items-center mt-2">
                  <div
                    class="flex items-center bg-slate-100 rounded-lg overflow-hidden border border-slate-200"
                  >
                    <button
                      @click="updateQuantity(item, -1)"
                      class="px-2 py-1 text-slate-500 font-black hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span class="px-2 py-1 text-[11px] font-black text-slate-800">{{
                      item.quantity
                    }}</span>
                    <button
                      @click="updateQuantity(item, 1)"
                      class="px-2 py-1 text-slate-500 font-black hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-black text-[#658a22] text-sm">
                      {{ formatVND(item.variant?.price || item.price || 0) }}
                    </span>
                    <button @click="removeItem(item.id)" class="text-slate-300 hover:text-red-500">
                      <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="cartItems.length === 0"
              class="text-center py-10 text-slate-400 font-bold uppercase text-[10px]"
            >
              Giỏ hàng đang trống
            </div>
          </div>

          <div
            class="mt-8 pt-6 border-t-2 border-slate-100 space-y-3 font-bold text-[11px] uppercase text-slate-400"
          >
            <div class="flex justify-between">
              <span>Tạm tính</span>
              <span class="text-slate-600">{{ formatVND(subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Phí ship</span>
              <span class="text-slate-600">
                {{ shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee) }}
              </span>
            </div>
            <div
              class="flex justify-between text-slate-900 text-xl pt-4 border-t-2 border-dashed italic"
            >
              <span>Tổng</span>
              <span class="text-[#658a22] font-black">{{ formatVND(total) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 space-y-8 text-slate-800">
        <section class="bg-white/80 p-8 rounded-[2rem] shadow-xl border-2 border-white/50">
          <h3 class="text-xl font-black mb-6 uppercase italic flex items-center gap-3">
            <span
              class="bg-[#658a22] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm"
            >
              01
            </span>
            Thông Tin Giao Hàng
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <input
              v-model="shippingInfo.fullName"
              placeholder="Họ tên người nhận"
              class="col-span-1 p-4 bg-white/50 border-2 border-slate-100 rounded-2xl focus:border-[#658a22] outline-none font-bold text-sm"
            />
            <input
              v-model="shippingInfo.phone"
              placeholder="Số điện thoại"
              class="col-span-1 p-4 bg-white/50 border-2 border-slate-100 rounded-2xl focus:border-[#658a22] outline-none font-bold text-sm"
            />
            <input
              v-model="shippingInfo.address"
              placeholder="Địa chỉ chi tiết (Số nhà, đường...)"
              class="col-span-2 p-4 bg-white/50 border-2 border-slate-100 rounded-2xl focus:border-[#658a22] outline-none font-bold text-sm"
            />
            <textarea
              v-model="shippingInfo.note"
              placeholder="Ghi chú thêm cho shipper..."
              class="col-span-2 p-4 bg-white/50 border-2 border-slate-100 rounded-2xl focus:border-[#658a22] outline-none font-bold text-sm h-24"
            ></textarea>
          </div>
        </section>

        <section class="bg-white/80 p-8 rounded-[2rem] shadow-xl border-2 border-white/50">
          <h3 class="text-xl font-black mb-6 uppercase italic flex items-center gap-3">
            <span
              class="bg-[#658a22] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm"
            >
              02
            </span>
            Thanh Toán
          </h3>
          <div class="space-y-3">
            <label
              :class="[
                'flex items-center p-5 rounded-2xl cursor-pointer border-2 transition-all',
                paymentMethod === 'cod'
                  ? 'border-[#658a22] bg-[#f4f7ee]'
                  : 'border-slate-100 bg-white/50',
              ]"
            >
              <input
                type="radio"
                v-model="paymentMethod"
                value="cod"
                class="w-4 h-4 accent-[#658a22]"
              />
              <span class="ml-3 font-bold uppercase text-xs">Tiền mặt (COD)</span>
            </label>
            <label
              :class="[
                'flex items-center p-5 rounded-2xl cursor-pointer border-2 transition-all',
                paymentMethod === 'bank_transfer'
                  ? 'border-[#658a22] bg-[#f4f7ee]'
                  : 'border-slate-100 bg-white/50',
              ]"
            >
              <input
                type="radio"
                v-model="paymentMethod"
                value="bank_transfer"
                class="w-4 h-4 accent-[#658a22]"
              />
              <span class="ml-3 font-bold uppercase text-xs">Chuyển khoản / QR Pay</span>
            </label>
          </div>

          <button
            @click="handleSubmit"
            :disabled="cartItems.length === 0"
            class="w-full mt-8 bg-[#1e293b] hover:bg-black text-white p-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            XÁC NHẬN ĐẶT HÀNG | {{ formatVND(total) }}
          </button>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
