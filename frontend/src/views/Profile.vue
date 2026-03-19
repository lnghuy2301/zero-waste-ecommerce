<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { Account } from "@/service/account.ts";
import { profile as ProfileService } from "@/service/profile.ts";
import { notify } from "@/utils/notifier.ts";
import {useRouter} from "vue-router"; // Import notify để dùng thông báo đẹp

// --- STATE: PROFILE ---
const isEditing = ref(false);
const loading = ref(false);
const router = useRouter();
const accountInfo = reactive({
  id: null,
  email: '',
  role: '',
  isActive: true
});

const profile = reactive({
  id: null as number | null,
  fullName: '',
  phone: '',
  address: '',
  gender: 'Nam',
  dob: '',
  accountId: null as number | null
});

// --- STATE: ĐỔI MẬT KHẨU ---
const isChangingPassword = ref(false);
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// --- HÀM TẢI DỮ LIỆU ---
const fetchProfile = async () => {
  const userStorage = localStorage.getItem("user");
  if (!userStorage) return;

  try {
    const userData = JSON.parse(userStorage);
    const accountRes = await Account.getAccount(userData.id);

    if (accountRes) {
      accountInfo.id = accountRes.id;
      accountInfo.email = accountRes.email;
      accountInfo.role = accountRes.role;
      accountInfo.isActive = accountRes.isActive;

      try {
        const p = await ProfileService.getCustomerProfile(null, accountRes.id);
        if (p) {
          profile.id = p.id;
          profile.fullName = p.fullName || '';
          profile.phone = p.phone || '';
          profile.address = p.address || '';
          profile.gender = p.gender || 'Nam';
          profile.accountId = p.accountId || accountRes.id;

          if (p.dob) {
            profile.dob = new Date(p.dob).toISOString().split('T')[0];
          }
        }
      } catch (profileError) {
        console.warn("Tài khoản này chưa có hồ sơ (Profile) hoặc lỗi API:", profileError);
      }
    }
  } catch (error) {
    console.error("Lỗi lấy dữ liệu:", error);
  }
};

// --- HÀM CẬP NHẬT HỒ SƠ ---
const handleUpdate = async () => {
  if (!profile.accountId || !profile.id) {
    notify.error("Không tìm thấy thông tin profile!");
    return;
  }

  loading.value = true;
  try {
    const payload = {
      fullName: profile.fullName,
      phone: profile.phone,
      address: profile.address,
      gender: profile.gender,
      dob: profile.dob,
    };

    await ProfileService.updateProfile(profile.accountId, profile.id, payload);

    isEditing.value = false;
    notify.success("Cập nhật thông tin thành công!");
  } catch (error) {
    notify.error("Có lỗi xảy ra khi cập nhật hồ sơ.");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// --- HÀM ĐỔI MẬT KHẨU ---
const handleChangePassword = async () => {
  if (passwordForm.newPassword.length < 8) {
    notify.error("Mật khẩu mới phải có ít nhất 8 ký tự!");
    return;
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    notify.error("Mật khẩu xác nhận không trùng khớp!");
    return;
  }

  isChangingPassword.value = true;
  try {
    // Gọi API đổi mật khẩu thực tế của bạn ở đây:
    // await Account.changePassword(accountInfo.id, passwordForm.oldPassword, passwordForm.newPassword);

    // Tạm thời dùng timeout để giả lập API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    notify.success("Cập nhật mật khẩu thành công!");

    // Reset form sau khi thành công
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    showOldPassword.value = false;
    showNewPassword.value = false;
    showConfirmPassword.value = false;
  } catch (error: any) {
    let message = error.response?.data?.message || 'Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra.';
    notify.error(message);
  } finally {
    isChangingPassword.value = false;
  }
};

// --- HÀM CUỘN XUỐNG FORM MẬT KHẨU ---
const scrollToPassword = () => {
  const el = document.getElementById('password-section');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Focus vào ô input đầu tiên để tiện gõ luôn
    setTimeout(() => {
      document.getElementById('oldPasswordInput')?.focus();
    }, 500);
  }
};

const goToChangePassword = () => {
  router.push('/change_password');
};
onMounted(fetchProfile);
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fa] py-12 px-4 font-inter">
    <div class="max-w-5xl mx-auto">

      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Cài đặt tài khoản</h1>
          <p class="text-slate-500 text-sm mt-1">Quản lý thông tin định danh và bảo mật của bạn.</p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="goToChangePassword"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all bg-[#658a22] text-white shadow-lg shadow-[#658a22]/20 hover:bg-[#58791d] active:scale-[0.98]"
          >
            <span class="material-symbols-outlined text-[20px]">lock</span>
            Đổi mật khẩu
          </button>

          <button
            type="button"
            @click="isEditing = !isEditing"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98]"
            :class="isEditing
            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 shadow-slate-200/50'
            : 'bg-[#658a22] text-white shadow-[#658a22]/20 hover:bg-[#58791d]'"
          >
            <span class="material-symbols-outlined text-[20px]">{{ isEditing ? 'close' : 'edit' }}</span>
            {{ isEditing ? 'Hủy bỏ' : 'Chỉnh sửa hồ sơ' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="space-y-6">
          <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4">
              <span v-if="accountInfo.isActive" class="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">
                <span class="size-1.5 bg-green-500 rounded-full animate-pulse"></span> Hoạt động
              </span>
            </div>
            <div class="flex flex-col items-center">
              <div class="size-24 bg-slate-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                <span class="material-symbols-outlined text-slate-400 text-5xl">person</span>
              </div>
              <h2 class="font-bold text-slate-900">{{ profile.fullName || 'Chưa cập nhật tên' }}</h2>
              <p class="text-sm text-slate-500">{{ accountInfo.email }}</p>
              <div class="mt-4 flex gap-2">
                <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  ID: #{{ accountInfo.id }}
                </span>
                <span class="px-3 py-1 bg-[#658a22]/10 text-[#658a22] rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  {{ accountInfo.role }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">

          <form @submit.prevent="handleUpdate" class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="px-8 py-5 border-b border-slate-50 bg-slate-50/50">
              <h3 class="font-bold text-slate-800 flex items-center gap-2">
                <span class="material-symbols-outlined text-[#658a22]">badge</span>
                Thông tin cá nhân
              </h3>
            </div>
            <div class="p-8 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Họ và Tên</label>
                  <input v-model="profile.fullName" :disabled="!isEditing" placeholder="Nhập họ tên" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#f8f9fa] focus:bg-white focus:ring-2 focus:ring-[#658a22]/20 outline-none transition-all disabled:opacity-60" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Giới tính</label>
                  <select v-model="profile.gender" :disabled="!isEditing" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#f8f9fa] focus:bg-white focus:ring-2 focus:ring-[#658a22]/20 outline-none transition-all disabled:opacity-60">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Số điện thoại</label>
                  <input v-model="profile.phone" :disabled="!isEditing" placeholder="Nhập số điện thoại" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#f8f9fa] focus:bg-white focus:ring-2 focus:ring-[#658a22]/20 outline-none transition-all disabled:opacity-60" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Ngày sinh</label>
                  <input v-model="profile.dob" type="date" :disabled="!isEditing" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#f8f9fa] focus:bg-white focus:ring-2 focus:ring-[#658a22]/20 outline-none transition-all disabled:opacity-60" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Địa chỉ thường trú</label>
                <textarea v-model="profile.address" :disabled="!isEditing" rows="3" placeholder="Nhập địa chỉ" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#f8f9fa] focus:bg-white focus:ring-2 focus:ring-[#658a22]/20 outline-none transition-all disabled:opacity-60 resize-none"></textarea>
              </div>
              <div v-if="isEditing" class="pt-4 border-t border-slate-50 flex justify-end gap-3">
                <button type="submit" :disabled="loading" class="bg-[#658a22] text-white px-10 py-3 rounded-xl font-bold hover:bg-[#58791d] transition-all flex items-center gap-2 shadow-lg shadow-[#658a22]/20 disabled:opacity-70">
                  <span v-if="loading" class="animate-spin border-2 border-white border-t-transparent rounded-full size-4"></span>
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

<style scoped>
.font-inter { font-family: 'Inter', sans-serif; }

/* Ẩn icon con mắt mặc định trên Edge/IE để fix lỗi 2 con mắt đè nhau */
input::-ms-reveal,
input::-ms-clear {
  display: none;
}
</style>
