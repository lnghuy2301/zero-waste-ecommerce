<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Account from '@/service/account.ts'
import { notify } from '@/utils/notifier.ts'
import Profile from '@/service/profile.ts'
const accounts = ref<any[]>([])
const loading = ref(false)
const selectedAccountIds = ref<number[]>([])

const showDetailModal = ref(false)
const currentAccount = ref<any>(null)

// Load tất cả tài khoản
const loadAccounts = async () => {
  loading.value = true
  try {
    const res = await Account.getAllAccount()
    accounts.value = Array.isArray(res) ? res : []
  } catch (e) {
    notify.error('Không tải được danh sách tài khoản')
    accounts.value = []
  } finally {
    loading.value = false
  }
}

// Click vào dòng để chọn
const toggleSelect = (id: number) => {
  const index = selectedAccountIds.value.indexOf(id)
  if (index > -1) selectedAccountIds.value.splice(index, 1)
  else selectedAccountIds.value.push(id)
}

// Xem chi tiết + load profile
const viewDetail = async (account: any) => {
  currentAccount.value = account

  // Load profile nếu chưa có
  if (!account.customerProfile) {
    try {
      const profile = await Profile.getCustomerProfile(account.id)
      currentAccount.value.customerProfile = profile
    } catch (e) {
      // Nếu chưa có profile thì để trống
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
  <div class="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Quản lý Tài khoản</h1>
        <p class="text-slate-500">Click vào dòng để chọn tài khoản</p>
      </div>
      <button
        v-if="selectedAccountIds.length > 0"
        @click="deleteSelected"
        class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
      >
        Xóa {{ selectedAccountIds.length }} tài khoản
      </button>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-500">
      Đang tải danh sách tài khoản...
    </div>

    <div v-else class="bg-white rounded-3xl shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-slate-100 border-b">
          <tr>
            <th class="w-10 px-6 py-4"></th>
            <th class="px-6 py-4 text-left font-medium text-slate-700">ID</th>
            <th class="px-6 py-4 text-left font-medium text-slate-700">Email</th>
            <th class="px-6 py-4 text-left font-medium text-slate-700">Role</th>
            <th class="px-6 py-4 text-left font-medium text-slate-700">Trạng thái</th>
            <th class="px-6 py-4 text-center font-medium text-slate-700">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="account in accounts"
            :key="account.id"
            @click="toggleSelect(account.id)"
            class="hover:bg-slate-50 cursor-pointer transition-all"
            :class="
              selectedAccountIds.includes(account.id)
                ? 'bg-[#f8fdf0] border-l-4 border-[#658a22]'
                : ''
            "
          >
            <td class="px-6 py-5 text-center">
              <div
                v-if="selectedAccountIds.includes(account.id)"
                class="w-5 h-5 mx-auto bg-[#658a22] text-white rounded-full flex items-center justify-center text-xs font-bold"
              >
                ✓
              </div>
            </td>
            <td class="px-6 py-5 font-medium text-slate-800">{{ account.id }}</td>
            <td class="px-6 py-5 text-slate-800">{{ account.email }}</td>
            <td class="px-6 py-5">
              <span
                class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700"
              >
                {{ account.role }}
              </span>
            </td>
            <td class="px-6 py-5">
              <span
                :class="{
                  'inline-block px-4 py-1 text-xs font-bold rounded-full': true,
                  'bg-green-100 text-green-700': account.isActive,
                  'bg-red-100 text-red-700': !account.isActive,
                }"
              >
                {{ account.isActive ? 'Hoạt động' : 'Khóa' }}
              </span>
            </td>
            <td class="px-6 py-5 text-center">
              <button
                @click.stop="viewDetail(account)"
                class="text-blue-600 hover:text-blue-700 mr-4"
              >
                Chi tiết
              </button>
              <button
                @click.stop="toggleActive(account.id, account.isActive)"
                class="font-medium"
                :class="
                  account.isActive
                    ? 'text-red-600 hover:text-red-700'
                    : 'text-green-600 hover:text-green-700'
                "
              >
                {{ account.isActive ? 'Khóa' : 'Kích hoạt' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Chi tiết tài khoản + Customer Profile -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"
      @click.self="showDetailModal = false"
    >
      <div class="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl" @click.stop>
        <h2 class="text-2xl font-black mb-6 text-slate-900">Thông tin tài khoản</h2>

        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-slate-500 text-sm">ID</p>
              <p class="font-medium text-slate-800">{{ currentAccount?.id }}</p>
            </div>
            <div>
              <p class="text-slate-500 text-sm">Vai trò</p>
              <p class="font-medium text-slate-800">{{ currentAccount?.role }}</p>
            </div>
          </div>

          <div>
            <p class="text-slate-500 text-sm">Email</p>
            <p class="font-medium text-slate-800">{{ currentAccount?.email }}</p>
          </div>

          <div>
            <p class="text-slate-500 text-sm">Trạng thái</p>
            <span
              :class="{
                'inline-block px-4 py-1 text-xs font-bold rounded-full': true,
                'bg-green-100 text-green-700': currentAccount?.isActive,
                'bg-red-100 text-red-700': !currentAccount?.isActive,
              }"
            >
              {{ currentAccount?.isActive ? 'Hoạt động' : 'Khóa' }}
            </span>
          </div>

          <!-- Phần Profile -->
          <div v-if="currentAccount?.customerProfile" class="border-t pt-6 mt-4">
            <h3 class="font-bold text-lg mb-4 text-slate-900">Thông tin hồ sơ khách hàng</h3>
            <div class="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p class="text-slate-500">Họ tên</p>
                <p class="font-medium text-slate-800">
                  {{ currentAccount.customerProfile.fullName || 'Chưa có' }}
                </p>
              </div>
              <div>
                <p class="text-slate-500">Số điện thoại</p>
                <p class="font-medium text-slate-800">
                  {{ currentAccount.customerProfile.phone || 'Chưa có' }}
                </p>
              </div>
              <div class="col-span-2">
                <p class="text-slate-500">Địa chỉ</p>
                <p class="font-medium text-slate-800">
                  {{ currentAccount.customerProfile.address || 'Chưa có' }}
                </p>
              </div>
              <div>
                <p class="text-slate-500">Giới tính</p>
                <p class="font-medium text-slate-800">
                  {{ currentAccount.customerProfile.gender || 'Chưa có' }}
                </p>
              </div>
              <div>
                <p class="text-slate-500">Ngày sinh</p>
                <p class="font-medium text-slate-800">
                  {{
                    currentAccount.customerProfile.dob
                      ? new Date(currentAccount.customerProfile.dob).toLocaleDateString('vi-VN')
                      : 'Chưa có'
                  }}
                </p>
              </div>
            </div>
          </div>

          <div v-else class="mt-8 p-6 bg-slate-50 rounded-2xl text-center text-slate-400">
            Tài khoản này chưa có thông tin hồ sơ chi tiết.
          </div>
        </div>

        <div class="flex justify-end mt-10">
          <button
            @click="showDetailModal = false"
            class="text-slate-800 px-10 py-3.5 border border-slate-300 rounded-2xl font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
