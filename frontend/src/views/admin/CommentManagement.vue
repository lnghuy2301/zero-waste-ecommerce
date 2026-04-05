<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { notify } from '@/utils/notifier.ts'
import api from '@/service/api.ts'

const comments = ref<any[]>([])
const loading = ref(false)
const selectedCommentIds = ref<number[]>([])

// === Bộ lọc & Phân trang ===
const searchName = ref('') // Tìm theo tên hoặc email
const fromDate = ref('')
const toDate = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// 1. Load dữ liệu ban đầu
const loadComments = async () => {
  loading.value = true
  try {
    const res = await api.get('/comment/admin')
    comments.value = Array.isArray(res.data) ? res.data : []
    currentPage.value = 1
  } catch (e) {
    notify.error('Không tải được danh sách bình luận')
  } finally {
    loading.value = false
  }
}

// 2. Logic Lọc: Trả về danh sách đã lọc nhưng CHƯA phân trang
const filteredList = computed(() => {
  let list = [...comments.value]

  // Lọc theo tên hoặc email
  if (searchName.value.trim()) {
    const term = searchName.value.toLowerCase().trim()
    list = list.filter(
      (c) =>
        (c.account?.profile?.fullName || '').toLowerCase().includes(term) ||
        (c.account?.email || '').toLowerCase().includes(term),
    )
  }

  // Lọc theo thời gian
  if (fromDate.value) {
    const from = new Date(fromDate.value)
    list = list.filter((c) => new Date(c.createdAt) >= from)
  }
  if (toDate.value) {
    const to = new Date(toDate.value)
    to.setHours(23, 59, 59, 999)
    list = list.filter((c) => new Date(c.createdAt) <= to)
  }
  return list
})

// 3. Logic Hiển thị: Cắt từ filteredList ra 10 item theo trang hiện tại
const filteredAndPagedComments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredList.value.slice(start, start + itemsPerPage)
})

// 4. Tính tổng số trang dựa trên danh sách đã lọc
const totalPages = computed(() => {
  return Math.ceil(filteredList.value.length / itemsPerPage) || 1
})

// Chọn / bỏ chọn một bình luận
const toggleSelect = (id: number) => {
  const index = selectedCommentIds.value.indexOf(id)
  if (index > -1) {
    selectedCommentIds.value.splice(index, 1)
  } else {
    selectedCommentIds.value.push(id)
  }
}

// Xóa nhiều bình luận
const deleteSelected = async () => {
  if (selectedCommentIds.value.length === 0) return
  if (!confirm(`Xóa ${selectedCommentIds.value.length} bình luận đã chọn?`)) return

  try {
    await api.delete('/comment', { data: { Ids: selectedCommentIds.value } })
    notify.success('Đã xóa bình luận thành công')
    selectedCommentIds.value = []
    loadComments()
  } catch (e) {
    notify.error('Xóa bình luận thất bại')
  }
}

onMounted(loadComments)
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 bg-transparent min-h-screen">
    <div
      class="flex justify-between items-center mb-10 sticky top-0 z-40 bg-white/60 backdrop-blur-lg py-6 -mx-6 px-6 border-b border-white/20 shadow-sm"
    >
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Quản lý Bình luận</h1>
        <p class="text-slate-500">Click vào dòng để chọn bình luận</p>
      </div>

      <button
        v-if="selectedCommentIds.length > 0"
        @click="deleteSelected"
        class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all"
      >
        Xóa {{ selectedCommentIds.length }} bình luận
      </button>
    </div>

    <div
      class="text-slate-800 bg-white rounded-3xl p-6 mb-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <div>
        <label class="block text-sl font-bold text-slate-500 mb-1.5">Tìm theo tên / email</label>
        <input
          v-model="searchName"
          placeholder="Nhập tên hoặc email..."
          class="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#658a22] rounded-2xl px-5 py-3 outline-none"
        />
      </div>
      <div>
        <label class="block text-sl font-bold text-slate-500 mb-1.5">Từ ngày</label>
        <input
          v-model="fromDate"
          type="date"
          class="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#658a22] rounded-2xl px-5 py-3 outline-none"
        />
      </div>
      <div>
        <label class="block text-sl font-bold text-slate-500 mb-1.5">Đến ngày</label>
        <input
          v-model="toDate"
          type="date"
          class="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#658a22] rounded-2xl px-5 py-3 outline-none"
        />
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 text-slate-400 font-bold">
      Đang tải bình luận...
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="c in filteredAndPagedComments"
        :key="c.id"
        @click="toggleSelect(c.id)"
        class="bg-white/70 backdrop-blur-md rounded-[28px] p-6 border-2 transition-all cursor-pointer hover:shadow-md"
        :class="
          selectedCommentIds.includes(c.id)
            ? 'border-red-400 bg-red-50 shadow-md'
            : 'border-slate-100 hover:border-slate-200'
        "
      >
        <div class="flex justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <div class="font-bold text-slate-700">
                {{ c.account?.profile?.fullName || 'Người dùng ẩn danh' }}
                <span class="block text-xl font-normal text-slate-700">{{ c.account?.email }}</span>
              </div>
              <div class="text-amber-500 font-black">{{ c.rating }} ★</div>
            </div>

            <div class="mt-1 font-medium text-slate-800">{{ c.product?.name }}</div>

            <div class="mt-3 text-slate-600 leading-relaxed">
              {{ c.content }}
            </div>

            <div class="mt-4 text-sl text-slate-400">
              {{ new Date(c.createdAt).toLocaleString('vi-VN') }}
            </div>
          </div>

          <div
            v-if="selectedCommentIds.includes(c.id)"
            class="w-8 h-8 bg-red-500 text-white rounded-2xl flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-xl">check</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex justify-center items-center gap-6 mt-12 pb-10">
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
  </div>
</template>

<style scoped>
.select-none {
  user-select: none;
}
</style>
