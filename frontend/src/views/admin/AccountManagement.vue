<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Account from '@/service/account.ts'
import { notify } from '@/utils/notifier.ts'
import Profile from '@/service/profile.ts'

const accounts = ref<any[]>([])
const loading = ref(false)
const selectedAccountIds = ref<number[]>([])

const showDetailModal = ref(false)
const currentAccount = ref<any>(null)
const sortBy = ref('SPENT_DESC') // Mặc định sắp xếp theo tiền cao nhất

// === Bộ lọc & Phân trang ===
const searchQuery = ref('') // Ô tìm kiếm
const filterStatus = ref('ALL') // 'ALL' | 'ACTIVE' | 'LOCKED'
const currentPage = ref(1)
const itemsPerPage = 10

// 1. Load tài khoản (Sửa hàm này để gọi API lấy dữ liệu có thống kê)
const loadAccounts = async () => {
  loading.value = true
  try {
    // Gọi getTopCustomers để có sẵn fullName, totalSpent, totalOrders từ Backend
    const res = await Account.getTopCustomers()
    accounts.value = Array.isArray(res) ? res : []
    currentPage.value = 1
  } catch (e) {
    notify.error('Không tải được danh sách tài khoản')
    accounts.value = []
  } finally {
    loading.value = false
  }
}

// 2. Logic Tìm kiếm, Lọc & Sắp xếp (Bổ sung logic sort vào đây)
const filteredList = computed(() => {
  let list = [...accounts.value]

  // Lọc theo trạng thái trước
  if (filterStatus.value !== 'ALL') {
    const isLookingForActive = filterStatus.value === 'ACTIVE'
    list = list.filter((acc) => acc.isActive === isLookingForActive)
  }

  // Lọc danh sách theo email, ID hoặc Tên khách hàng (nếu có)
  if (searchQuery.value.trim()) {
    const term = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (acc) =>
        acc.email?.toLowerCase().includes(term) ||
        acc.id?.toString().includes(term) ||
        acc.fullName?.toLowerCase().includes(term),
    )
  }

  // LOGIC SẮP XẾP: Tiền chi trả (Giảm dần) -> Số đơn hàng (Giảm dần)
  // Tìm phần return list.sort(...) cũ và thay bằng:
  return list.sort((a, b) => {
    const moneyA = Number(a.totalSpent || 0)
    const moneyB = Number(b.totalSpent || 0)
    const ordersA = Number(a.totalOrders || 0)
    const ordersB = Number(b.totalOrders || 0)

    switch (sortBy.value) {
      case 'SPENT_DESC':
        return moneyB - moneyA
      case 'SPENT_ASC':
        return moneyA - moneyB
      case 'ORDERS_DESC':
        return ordersB - ordersA
      case 'ORDERS_ASC':
        return ordersA - ordersB
      default:
        return 0
    }
  })
})

// Logic Phân trang
const pagedAccounts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredList.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(filteredList.value.length / itemsPerPage) || 1
})

// Click vào dòng để chọn
const toggleSelect = (id: number) => {
  const index = selectedAccountIds.value.indexOf(id)
  if (index > -1) selectedAccountIds.value.splice(index, 1)
  else selectedAccountIds.value.push(id)
}

// Xem chi tiết + load profile
const viewDetail = async (account: any) => {
  currentAccount.value = account

  // Load profile nếu chưa có (Dành cho thông tin chi tiết như địa chỉ, giới tính)
  if (!account.customerProfile) {
    try {
      const profile = await Profile.getCustomerProfile(account.id)
      currentAccount.value.customerProfile = profile
    } catch (e) {
      currentAccount.value.customerProfile = null
    }
  }

  showDetailModal.value = true
}

// Kích hoạt / Khóa tài khoản
const toggleActive = async (id: number, currentActive: boolean) => {
  const newStatus = !currentActive
  if (!confirm(`Đổi trạng thái thành ${newStatus ? 'Hoạt động' : 'Khóa'}?`)) return

  try {
    await Account.updateActive(id, newStatus)
    notify.success(`Đã ${newStatus ? 'kích hoạt' : 'khóa'} tài khoản`)
    loadAccounts()
  } catch (e) {
    notify.error('Cập nhật thất bại')
  }
}

// Xóa nhiều tài khoản
const deleteSelected = async () => {
  if (selectedAccountIds.value.length === 0) return
  if (!confirm(`Xóa ${selectedAccountIds.value.length} tài khoản?`)) return

  try {
    await Account.deleteAccountList(selectedAccountIds.value)
    notify.success('Xóa tài khoản thành công')
    selectedAccountIds.value = []
    loadAccounts()
  } catch (e) {
    notify.error('Xóa thất bại')
  }
}

onMounted(loadAccounts)
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 bg-transparent min-h-screen">
    <div
      class="flex justify-between items-center mb-8 sticky top-0 z-40 bg-white/60 backdrop-blur-lg py-6 -mx-6 px-6 border-b border-white/20 shadow-sm"
    >
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Quản lý Tài khoản</h1>
        <p class="text-slate-500">Bấm vào dòng để tích chọn nhiều tài khoản</p>
      </div>
      <button
        v-if="selectedAccountIds.length > 0"
        @click="deleteSelected"
        class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-colors"
      >
        Xóa {{ selectedAccountIds.length }} tài khoản
      </button>
    </div>

    <div
      class="bg-white rounded-3xl p-5 mb-8 shadow-sm border border-slate-100 flex flex-wrap items-center gap-4"
    >
      <div class="relative flex-1 min-w-[300px]">
        <span
          class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          >search</span
        >
        <input
          v-model="searchQuery"
          @input="currentPage = 1"
          type="text"
          placeholder="Tìm kiếm tài khoản bằng Email hoặc ID..."
          class="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#658a22] rounded-2xl pl-12 pr-5 py-3.5 outline-none transition-all text-slate-700 font-medium"
        />
      </div>

      <select
        v-model="filterStatus"
        @change="currentPage = 1"
        class="bg-slate-50 border-2 border-slate-100 text-slate-600 rounded-2xl px-5 py-3.5 outline-none transition-all font-bold cursor-pointer focus:border-[#658a22] min-w-[200px]"
      >
        <option value="ALL">Tất cả trạng thái</option>
        <option value="ACTIVE">Hoạt động</option>
        <option value="LOCKED">Đã khóa</option>
      </select>
      <select
        v-model="sortBy"
        class="bg-slate-50 border-2 border-slate-100 text-slate-600 rounded-2xl px-5 py-3.5 outline-none transition-all font-bold cursor-pointer focus:border-[#658a22] min-w-[200px]"
      >
        <option value="SPENT_DESC">Khách hàng có điều kiện</option>
        <option value="SPENT_ASC">Khách hàng ít điều kiện</option>
        <option value="ORDERS_DESC">Khách hàng năng động</option>
        <option value="ORDERS_ASC">Khách hàng ít sôi nổi</option>
      </select>

      <div class="text-sm font-bold text-slate-500 px-2 hidden sm:block">
        Tổng số: {{ filteredList.length }}
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 text-slate-400 font-bold">
      Đang tải danh sách tài khoản...
    </div>

    <div
      v-else-if="pagedAccounts.length > 0"
      class="bg-white/80 backdrop-blur-md rounded-[32px] shadow-sm overflow-hidden border border-slate-100"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th class="w-14 px-6 py-4 text-center"></th>
              <th class="px-6 py-4 text-left font-bold text-slate-600 text-sm">ID</th>
              <th class="px-6 py-4 text-left font-bold text-slate-600 text-sm">Khách hàng</th>
              <th class="px-6 py-4 text-center font-bold text-slate-600 text-sm">Đơn hàng</th>
              <th class="px-6 py-4 text-right font-bold text-slate-600 text-sm">Tổng chi tiêu</th>
              <th class="px-6 py-4 text-left font-bold text-slate-600 text-sm">Trạng thái</th>
              <th class="px-6 py-4 text-center font-bold text-slate-600 text-sm">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="account in pagedAccounts"
              :key="account.id"
              @click="toggleSelect(account.id)"
              class="hover:bg-slate-50/50 cursor-pointer transition-all group"
              :class="
                selectedAccountIds.includes(account.id)
                  ? 'bg-[#f8fdf0] border-l-4 border-[#658a22]'
                  : 'border-l-4 border-transparent'
              "
            >
              <td class="px-6 py-5 text-center">
                <div
                  v-if="selectedAccountIds.includes(account.id)"
                  class="w-6 h-6 mx-auto bg-[#658a22] text-white rounded-full flex items-center justify-center text-xs font-bold"
                >
                  ✓
                </div>
                <div
                  v-else
                  class="w-6 h-6 mx-auto border-2 border-slate-200 rounded-full flex items-center justify-center text-xs font-bold bg-white group-hover:border-slate-300"
                ></div>
              </td>

              <td class="px-6 py-5 font-bold text-slate-700">{{ account.id }}</td>

              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="text-slate-700 font-bold">{{
                    account.fullName || 'Chưa cập nhật'
                  }}</span>
                  <span class="text-slate-400 text-xs">{{ account.email }}</span>
                </div>
              </td>

              <td class="px-6 py-5 text-center">
                <span
                  class="inline-flex items-center justify-center bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-xs"
                >
                  {{ account.totalOrders || 0 }} đơn
                </span>
              </td>

              <td class="px-6 py-5 text-right font-black text-[#658a22]">
                {{
                  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    account.totalSpent || 0,
                  )
                }}
              </td>

              <td class="px-6 py-5">
                <span
                  :class="{
                    'inline-block px-4 py-1 text-xs font-bold rounded-full': true,
                    'bg-emerald-50 text-emerald-600': account.isActive,
                    'bg-red-50 text-red-600': !account.isActive,
                  }"
                >
                  {{ account.isActive ? 'Hoạt động' : 'Đã khóa' }}
                </span>
              </td>

              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-4">
                  <button
                    @click.stop="viewDetail(account)"
                    class="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                  >
                    <span class="material-symbols-outlined text-lg">visibility</span>
                    Chi tiết
                  </button>
                  <button
                    @click.stop="toggleActive(account.id, account.isActive)"
                    class="font-semibold text-sm flex items-center gap-1"
                    :class="
                      account.isActive
                        ? 'text-red-500 hover:text-red-700'
                        : 'text-emerald-500 hover:text-emerald-700'
                    "
                  >
                    <span class="material-symbols-outlined text-lg">
                      {{ account.isActive ? 'lock' : 'lock_open' }}
                    </span>
                    {{ account.isActive ? 'Khóa' : 'Mở khóa' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-else
      class="text-center py-20 text-slate-400 font-bold bg-white rounded-3xl shadow-sm border border-slate-100"
    >
      Không tìm thấy tài khoản nào khớp với từ khóa/bộ lọc.
    </div>

    <div v-if="totalPages > 1" class="flex justify-center items-center gap-6 mt-10 pb-10">
      <button
        @click="currentPage = Math.max(1, currentPage - 1)"
        :disabled="currentPage === 1"
        class="w-12 h-12 flex items-center justify-center bg-white border-2 border-slate-100 rounded-2xl shadow-sm text-slate-600 hover:border-[#658a22] hover:text-[#658a22] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <span class="text-2xl font-bold">&lt;</span>
      </button>

      <div class="flex flex-col items-center">
        <span class="text-slate-400 text-xs font-bold uppercase tracking-widest">Trang</span>
        <span class="text-slate-900 font-black text-lg">
          {{ currentPage }} <span class="text-slate-300 mx-1">/</span> {{ totalPages }}
        </span>
      </div>

      <button
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="w-12 h-12 flex items-center justify-center bg-white border-2 border-slate-100 rounded-2xl shadow-sm text-slate-600 hover:border-[#658a22] hover:text-[#658a22] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <span class="text-2xl font-bold">&gt;</span>
      </button>
    </div>

    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
      @click.self="showDetailModal = false"
    >
      <div
        class="bg-white rounded-[32px] w-full max-w-lg p-10 shadow-2xl border border-slate-100 animate-fade-in"
        @click.stop
      >
        <h2 class="text-2xl font-black mb-6 text-slate-900 flex items-center gap-3">
          <span class="material-symbols-outlined text-3xl text-[#658a22]">account_circle</span>
          Thông tin tài khoản
        </h2>

        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-slate-400 text-sm font-bold">ID</p>
              <p class="font-bold text-slate-700">{{ currentAccount?.id }}</p>
            </div>
            <div>
              <p class="text-slate-400 text-sm font-bold">Vai trò</p>
              <span
                class="inline-block px-3 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-600 uppercase"
              >
                {{ currentAccount?.role }}
              </span>
            </div>
          </div>

          <div>
            <p class="text-slate-400 text-sm font-bold">Email</p>
            <p class="font-bold text-slate-700">{{ currentAccount?.email }}</p>
          </div>

          <div>
            <p class="text-slate-400 text-sm font-bold mb-1">Trạng thái</p>
            <span
              :class="{
                'inline-block px-4 py-1 text-xs font-bold rounded-full': true,
                'bg-emerald-50 text-emerald-600': currentAccount?.isActive,
                'bg-red-50 text-red-600': !currentAccount?.isActive,
              }"
            >
              {{ currentAccount?.isActive ? 'Hoạt động' : 'Khóa' }}
            </span>
          </div>

          <div v-if="currentAccount?.customerProfile" class="border-t pt-6 mt-4 border-slate-100">
            <h3 class="font-bold text-lg mb-4 text-slate-900 flex items-center gap-2">
              <span class="material-symbols-outlined text-slate-400">badge</span>
              Hồ sơ khách hàng
            </h3>
            <div class="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p class="text-slate-400 font-bold">Họ tên</p>
                <p class="font-bold text-slate-700">
                  {{ currentAccount.customerProfile.fullName || 'Chưa có' }}
                </p>
              </div>
              <div>
                <p class="text-slate-400 font-bold">Số điện thoại</p>
                <p class="font-bold text-slate-700">
                  {{ currentAccount.customerProfile.phone || 'Chưa có' }}
                </p>
              </div>
              <div class="col-span-2">
                <p class="text-slate-400 font-bold">Địa chỉ</p>
                <p class="font-bold text-slate-700">
                  {{ currentAccount.customerProfile.address || 'Chưa có' }}
                </p>
              </div>
              <div>
                <p class="text-slate-400 font-bold">Giới tính</p>
                <p class="font-bold text-slate-700">
                  {{ currentAccount.customerProfile.gender || 'Chưa có' }}
                </p>
              </div>
              <div>
                <p class="text-slate-400 font-bold">Ngày sinh</p>
                <p class="font-bold text-slate-700">
                  {{
                    currentAccount.customerProfile.dob
                      ? new Date(currentAccount.customerProfile.dob).toLocaleDateString('vi-VN')
                      : 'Chưa có'
                  }}
                </p>
              </div>
            </div>
          </div>

          <div
            v-else
            class="mt-8 p-6 bg-slate-50 rounded-2xl text-center text-slate-400 font-bold border border-slate-100"
          >
            Tài khoản này chưa có thông tin hồ sơ chi tiết.
          </div>
        </div>

        <div class="flex justify-end mt-10">
          <button
            @click="showDetailModal = false"
            class="px-8 py-3 border-2 border-slate-100 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hiệu ứng smooth khi mở Modal */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>
