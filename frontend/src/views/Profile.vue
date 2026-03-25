<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Account } from '@/service/account.ts'
import { Profile } from '@/service/profile.ts'
import { notify } from '@/utils/notifier.ts'

const router = useRouter()
const isEditing = ref(false)
const loading = ref(false)

const accountInfo = reactive({
  id: null as number | null,
  email: '',
  role: '',
  isActive: true,
})

const profile = reactive({
  id: null as number | null,
  fullName: '',
  phone: '',
  address: '',
  gender: 'Nam',
  dob: '',
  accountId: null as number | null,
})

// --- TẢI DỮ LIỆU ---
const fetchProfile = async () => {
  const userStorage = localStorage.getItem('user')
  if (!userStorage) {
    router.push('/login')
    return
  }

  try {
    const userData = JSON.parse(userStorage)
    const accountRes = await Account.getAccount(userData.id)

    if (accountRes) {
      accountInfo.id = accountRes.id
      accountInfo.email = accountRes.email
      accountInfo.role = accountRes.role
      accountInfo.isActive = accountRes.isActive

      let p = await Profile.getCustomerProfile(accountRes.id)

      if (!p || !p.id) {
        const defaultPayload = {
          fullName: userData.fullName || 'Người dùng mới',
          phone: null,
          address: null,
          gender: 'Nam',
          dob: null,
        }
        p = await Profile.updateProfile(accountRes.id, 0, defaultPayload)
      }

      if (p) {
        profile.id = p.id
        profile.fullName = p.fullName || ''
        profile.phone = p.phone || ''
        profile.address = p.address || ''
        profile.gender = p.gender || 'Nam'
        profile.accountId = p.accountId || accountRes.id

        if (p.dob) {
          profile.dob = new Date(p.dob).toISOString().split('T')[0]
        }
      }
    }
  } catch (error: any) {
    console.error('Lỗi lấy thông tin profile:', error)
    notify.error('Không thể tải thông tin hồ sơ')
  }
}

// --- CẬP NHẬT HỒ SƠ ---
const handleUpdate = async () => {
  if (!profile.accountId || !profile.id) {
    notify.error('Không tìm thấy profile!')
    return
  }

  loading.value = true
  try {
    const payload = {
      fullName: profile.fullName,
      phone: profile.phone || null,
      address: profile.address || null,
      gender: profile.gender,
      dob: profile.dob || null,
    }

    await Profile.updateProfile(profile.accountId, profile.id, payload)
    isEditing.value = false
    notify.success('Cập nhật thông tin thành công!')
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Cập nhật thất bại'
    notify.error(msg)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div class="min-h-screen bg-[#f1f5f9] py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Cài đặt tài khoản</h1>
          <p class="text-slate-600 text-sm mt-1 font-medium">
            Quản lý thông tin định danh và bảo mật của bạn.
          </p>
        </div>

        <button
          @click="isEditing = !isEditing"
          class="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-md active:scale-95"
          :class="
            isEditing
              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              : 'bg-[#658a22] text-white hover:bg-[#58791d]'
          "
        >
          <span class="material-symbols-outlined text-[20px]">{{
            isEditing ? 'close' : 'edit'
          }}</span>
          {{ isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa hồ sơ' }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="space-y-6">
          <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <div class="flex flex-col items-center text-center">
              <div
                class="size-24 bg-slate-100 rounded-full flex items-center justify-center mb-5 border-4 border-slate-50 shadow-inner"
              >
                <span class="material-symbols-outlined text-5xl text-slate-400">person</span>
              </div>
              <h2 class="font-bold text-xl text-slate-900">
                {{ profile.fullName || 'Chưa có tên' }}
              </h2>
              <p class="text-slate-500 font-medium text-sm mt-1">{{ accountInfo.email }}</p>
              <div class="mt-5 flex flex-wrap justify-center gap-2">
                <span
                  class="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200"
                >
                  ID: #{{ accountInfo.id }}
                </span>
                <span
                  class="px-3 py-1 bg-[#658a22]/10 text-[#658a22] rounded-lg text-xs font-bold border border-[#658a22]/20"
                >
                  {{ accountInfo.role }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2">
          <form
            @submit.prevent="handleUpdate"
            class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div class="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 class="font-bold text-lg text-slate-800">Thông tin cá nhân</h3>
            </div>

            <div class="p-8 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1.5">
                  <label
                    class="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1"
                    >Họ và tên</label
                  >
                  <input
                    v-model="profile.fullName"
                    :disabled="!isEditing"
                    class="w-full px-4 py-3 text-slate-900 font-medium bg-white border border-slate-300 rounded-xl focus:border-[#658a22] focus:ring-4 focus:ring-[#658a22]/10 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 placeholder:text-slate-400"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div class="space-y-1.5">
                  <label
                    class="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1"
                    >Giới tính</label
                  >
                  <select
                    v-model="profile.gender"
                    :disabled="!isEditing"
                    class="w-full px-4 py-3 text-slate-900 font-medium bg-white border border-slate-300 rounded-xl focus:border-[#658a22] focus:ring-4 focus:ring-[#658a22]/10 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label
                    class="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1"
                    >Số điện thoại</label
                  >
                  <input
                    v-model="profile.phone"
                    :disabled="!isEditing"
                    class="w-full px-4 py-3 text-slate-900 font-medium bg-white border border-slate-300 rounded-xl focus:border-[#658a22] focus:ring-4 focus:ring-[#658a22]/10 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 placeholder:text-slate-400"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div class="space-y-1.5">
                  <label
                    class="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1"
                    >Ngày sinh</label
                  >
                  <input
                    v-model="profile.dob"
                    type="date"
                    :disabled="!isEditing"
                    class="w-full px-4 py-3 text-slate-900 font-medium bg-white border border-slate-300 rounded-xl focus:border-[#658a22] focus:ring-4 focus:ring-[#658a22]/10 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200"
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1"
                  >Địa chỉ</label
                >
                <textarea
                  v-model="profile.address"
                  :disabled="!isEditing"
                  rows="3"
                  class="w-full px-4 py-3 text-slate-900 font-medium bg-white border border-slate-300 rounded-xl focus:border-[#658a22] focus:ring-4 focus:ring-[#658a22]/10 outline-none transition-all resize-none disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 placeholder:text-slate-400"
                  placeholder="Nhập địa chỉ thường trú"
                ></textarea>
              </div>

              <div v-if="isEditing" class="pt-4 flex justify-end">
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-8 py-3.5 bg-[#658a22] hover:bg-[#58791d] text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-[#658a22]/20"
                >
                  <span
                    v-if="loading"
                    class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"
                  ></span>
                  {{ loading ? 'Đang lưu...' : 'Lưu thay đổi' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
