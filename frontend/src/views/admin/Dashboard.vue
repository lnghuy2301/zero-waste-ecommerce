<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AdminService from '@/service/admin.ts'
import { notify } from '@/utils/notifier.ts'
import Chart from 'chart.js/auto'

const stats = ref({
  totalUsers: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalRevenue: 0,
  totalInventory: 0, // Mới
  totalSold: 0, // Mới
  monthlyRevenue: Array(12).fill(0),
  statusCount: { 'Hoàn thành': 48, 'Đang xử lý': 11 }, // Giả lập nếu BE chưa trả về
})

let revenueChart: Chart | null = null
let statusChart: Chart | null = null

const revenueCanvas = ref<HTMLCanvasElement | null>(null)
const statusCanvas = ref<HTMLCanvasElement | null>(null)

const formatCompactNumber = (number: number) => {
  return Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)
}

onMounted(async () => {
  try {
    const data = await AdminService.getStats()
    stats.value = {
      ...stats.value,
      ...data,
      // Nếu Backend có trả về statusCount thì gán vào, không thì dùng mẫu
      statusCount: data.statusCount || { 'Hoàn thành': 48, 'Đang xử lý': 11 },
    }

    initCharts()
  } catch (e) {
    notify.error('Không tải được dữ liệu thống kê')
  }
})

const initCharts = () => {
  // Biểu đồ Doanh thu
  if (revenueCanvas.value) {
    const ctx = revenueCanvas.value.getContext('2d')
    const gradient = ctx?.createLinearGradient(0, 0, 0, 400)
    gradient?.addColorStop(0, 'rgba(101, 138, 34, 0.4)')
    gradient?.addColorStop(1, 'rgba(101, 138, 34, 0)')

    revenueChart = new Chart(revenueCanvas.value, {
      type: 'line',
      data: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
          {
            label: 'Doanh thu',
            data: stats.value.monthlyRevenue,
            borderColor: '#658a22',
            backgroundColor: gradient || '#658a22',
            fill: true,
            tension: 0.4,
            borderWidth: 4,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (value: any) => formatCompactNumber(value) },
          },
        },
      },
    })
  }

  // Biểu đồ Trạng thái (Sửa lỗi gạch tên khi click)
  if (statusCanvas.value) {
    statusChart = new Chart(statusCanvas.value, {
      type: 'doughnut',
      data: {
        labels: Object.keys(stats.value.statusCount),
        datasets: [
          {
            data: Object.values(stats.value.statusCount),
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            onClick: () => null, // Vô hiệu hóa việc click ẩn dataset (hết bị gạch tên)
            labels: {
              usePointStyle: true,
              padding: 20,
              font: { weight: 'bold' },
            },
          },
        },
      },
    })
  }
}

onBeforeUnmount(() => {
  revenueChart?.destroy()
  statusChart?.destroy()
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <div
        class="xl:col-span-2 bg-[#658a22] rounded-[32px] p-6 shadow-xl text-white relative overflow-hidden group"
      >
        <div class="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"></div>
        <div class="relative z-10 flex flex-col justify-between h-full">
          <div class="p-2 bg-white/20 w-fit rounded-xl mb-3">
            <span class="material-symbols-outlined">monetization_on</span>
          </div>
          <div>
            <p class="text-white/70 text-xs font-bold uppercase tracking-widest">Tổng doanh thu</p>
            <p class="text-2xl font-black">{{ stats.totalRevenue.toLocaleString('vi-VN') }}đ</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-[32px] p-5 shadow-sm border border-slate-100 group">
        <div class="p-2 bg-emerald-50 text-emerald-600 w-fit rounded-xl mb-3">
          <span class="material-symbols-outlined">group</span>
        </div>
        <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Khách hàng</p>
        <p class="text-2xl font-black text-slate-800">{{ stats.totalUsers }}</p>
      </div>

      <div class="bg-white rounded-[32px] p-5 shadow-sm border border-slate-100 group">
        <div class="p-2 bg-blue-50 text-blue-600 w-fit rounded-xl mb-3">
          <span class="material-symbols-outlined">shopping_bag</span>
        </div>
        <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Đơn hàng</p>
        <p class="text-2xl font-black text-slate-800">{{ stats.totalOrders }}</p>
      </div>

      <div
        class="bg-white rounded-[32px] p-5 shadow-sm border border-slate-100 group border-b-4 border-b-blue-500"
      >
        <div class="p-2 bg-blue-50 text-blue-500 w-fit rounded-xl mb-3">
          <span class="material-symbols-outlined">sell</span>
        </div>
        <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Đã bán</p>
        <p class="text-2xl font-black text-blue-600">{{ stats.totalSold }}</p>
      </div>

      <div
        class="bg-white rounded-[32px] p-5 shadow-sm border border-slate-100 group border-b-4 border-b-amber-500"
      >
        <div class="p-2 bg-amber-50 text-amber-500 w-fit rounded-xl mb-3">
          <span class="material-symbols-outlined">inventory</span>
        </div>
        <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Tồn kho</p>
        <p class="text-2xl font-black text-amber-600">{{ stats.totalInventory }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div
        class="lg:col-span-2 bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 h-[450px]"
      >
        <h3 class="font-black text-slate-800 text-xl mb-8 flex items-center gap-3">
          <span class="w-2.5 h-8 bg-[#658a22] rounded-full"></span>
          Phân tích doanh thu
        </h3>
        <div class="h-[320px]"><canvas ref="revenueCanvas"></canvas></div>
      </div>

      <div class="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 h-[450px]">
        <h3 class="font-black text-slate-800 text-xl mb-8 flex items-center gap-3">
          <span class="w-2.5 h-8 bg-blue-500 rounded-full"></span>
          Trạng thái
        </h3>
        <div class="h-[300px] relative">
          <canvas ref="statusCanvas"></canvas>
          <div
            class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-[-20px]"
          >
            <span class="text-slate-400 text-xs font-bold uppercase">Tổng đơn</span>
            <span class="text-2xl font-black text-slate-800">{{ stats.totalOrders }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hiệu ứng trồi lên cho Card khi hover */
.grid > div {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.grid > div:hover {
  transform: translateY(-5px);
  box-shadow:
    0 20px 25px -5px rgb(0 0 0 / 0.05),
    0 8px 10px -6px rgb(0 0 0 / 0.05);
}
</style>
