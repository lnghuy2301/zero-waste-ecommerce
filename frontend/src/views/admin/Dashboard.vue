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
  monthlyRevenue: Array(12).fill(0),
  statusCount: {} as Record<string, number>, // ← thêm dòng này
})

let revenueChart: Chart | null = null
let statusChart: Chart | null = null

const revenueCanvas = ref<HTMLCanvasElement | null>(null)
const statusCanvas = ref<HTMLCanvasElement | null>(null)

onMounted(async () => {
  try {
    const data = await AdminService.getStats()

    stats.value.totalUsers = data.totalUsers
    stats.value.totalOrders = data.totalOrders
    stats.value.totalProducts = data.totalProducts
    stats.value.totalRevenue = data.totalRevenue
    stats.value.monthlyRevenue = data.monthlyRevenue
    stats.value.statusCount = data.statusCount || {} // ← thêm dòng này
  } catch (e) {
    notify.error('Không tải được dữ liệu thống kê')
  }

  // Biểu đồ doanh thu theo tháng (dữ liệu thật từ DB)
  if (revenueCanvas.value) {
    revenueChart = new Chart(revenueCanvas.value, {
      type: 'bar',
      data: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
          {
            label: 'Doanh thu (triệu)',
            data: stats.value.monthlyRevenue.map((v) => Math.round(v / 1000000)), // chuyển về triệu
            backgroundColor: '#658a22',
            borderColor: '#58791d',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { ticks: { color: '#475569', font: { weight: 'bold' } } },
          x: { ticks: { color: '#475569', font: { weight: 'bold' } } },
        },
      },
    })
  }

  // Biểu đồ trạng thái (giữ nguyên dữ liệu giả hoặc bạn có thể thêm endpoint sau)
  if (statusCanvas.value) {
    statusChart = new Chart(statusCanvas.value, {
      type: 'doughnut',
      data: {
        labels: ['Hoàn thành', 'Đang giao', 'Đã thanh toán', 'Chờ xử lý', 'Hủy'],
        datasets: [
          {
            data: [48, 15, 18, 12, 7],
            backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    })
  }
})

onBeforeUnmount(() => {
  revenueChart?.destroy()
  statusChart?.destroy()
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-4">
    <!-- 4 thẻ thống kê -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="bg-white rounded-3xl p-6 shadow-md border border-slate-200">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-slate-600 font-bold text-sm uppercase tracking-wide">Tổng khách hàng</p>
            <p class="text-4xl font-black mt-3 text-slate-800">{{ stats.totalUsers }}</p>
          </div>
          <div class="p-3 bg-emerald-50 rounded-2xl">
            <span class="material-symbols-outlined text-4xl text-emerald-600">group</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-6 shadow-md border border-slate-200">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-slate-600 font-bold text-sm uppercase tracking-wide">Tổng đơn hàng</p>
            <p class="text-4xl font-black mt-3 text-slate-800">{{ stats.totalOrders }}</p>
          </div>
          <div class="p-3 bg-blue-50 rounded-2xl">
            <span class="material-symbols-outlined text-4xl text-blue-600">shopping_cart</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-6 shadow-md border border-slate-200">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-slate-600 font-bold text-sm uppercase tracking-wide">Sản phẩm</p>
            <p class="text-4xl font-black mt-3 text-slate-800">{{ stats.totalProducts }}</p>
          </div>
          <div class="p-3 bg-amber-50 rounded-2xl">
            <span class="material-symbols-outlined text-4xl text-amber-600">inventory_2</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-6 shadow-md border border-slate-200">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-slate-600 font-bold text-sm uppercase tracking-wide">Doanh thu</p>
            <p class="text-4xl font-black text-emerald-700 mt-3">
              {{ stats.totalRevenue.toLocaleString('vi-VN') }}đ
            </p>
          </div>
          <div class="p-3 bg-emerald-50 rounded-2xl">
            <span class="material-symbols-outlined text-4xl text-emerald-600">payments</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Biểu đồ -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-3xl p-8 shadow-md border border-slate-100 h-[450px]">
        <h3 class="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
          <span class="w-2 h-6 bg-[#658a22] rounded-full"></span>
          Doanh thu theo tháng (triệu)
        </h3>
        <div class="h-[320px]">
          <canvas ref="revenueCanvas"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-8 shadow-md border border-slate-100 h-[450px]">
        <h3 class="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
          <span class="w-2 h-6 bg-blue-500 rounded-full"></span>
          Trạng thái đơn hàng
        </h3>
        <div class="h-[320px]">
          <canvas ref="statusCanvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
