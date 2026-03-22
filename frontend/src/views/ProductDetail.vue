<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import api from '@/service/api.ts'
import CommentService from '@/service/comment.ts'

const route = useRoute()
const product = ref<any>(null)
const variants = ref<any[]>([])
const loading = ref(true)

// --- STATE CHO ĐÁNH GIÁ ---
const comments = ref<any[]>([])
const commentTotal = ref(0)
const isCommentsLoading = ref(false)

const getImageUrl = (path: string | null) => {
  if (!path) return 'https://via.placeholder.com/400x400?text=Không+có+ảnh'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`
}

const fetchComments = async (id: number) => {
  isCommentsLoading.value = true
  try {
    const response = await CommentService.getComments({ productId: id })
    const responseData = response.data || response;

    // Gán dữ liệu bình luận
    comments.value = responseData.data || responseData.items || responseData || [];
    commentTotal.value = responseData.meta?.total || comments.value.length;

  } catch (error) {
    console.error("Lỗi khi tải đánh giá:", error)
  } finally {
    isCommentsLoading.value = false
  }
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) return

  try {
    // Lấy chi tiết sản phẩm
    const prodRes = await api.get(`/product/${id}`)
    product.value = prodRes.data

    // Lấy biến thể của sản phẩm này
    const variantRes = await api.get('/product-variant')
    variants.value = variantRes.data.filter((v: any) => v.productId === id)

    // Gọi API Đánh giá
    fetchComments(id)

  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

// Giá thấp nhất từ biến thể (nếu có)
const lowestPrice = () => {
  if (variants.value.length === 0) return null
  const prices = variants.value.map((v: any) => Number(v.price))
  return Math.min(...prices)
}
</script>

<template>
  <main class="mx-auto max-w-[1200px] w-full px-4 py-8 sm:px-6 lg:px-8">
    <div v-if="loading" class="text-center py-20 text-slate-600">Đang tải...</div>
    <div v-else-if="!product" class="text-center py-20 text-slate-500">Không tìm thấy sản phẩm</div>
    <div v-else>
      <nav class="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
        <RouterLink to="/" class="hover:text-[#658a22] transition-colors">Trang Chủ</RouterLink>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <RouterLink
          :to="`/products?category=${product.categoryId}`"
          class="hover:text-[#658a22] transition-colors"
        >
          {{ product.category?.name || 'Danh mục' }}
        </RouterLink>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <span class="text-slate-900 font-semibold">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div class="flex flex-col gap-4">
          <div class="aspect-square w-full bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-8 border border-slate-100">
            <img
              :src="getImageUrl(product.mainImage)"
              :alt="product.name"
              class="w-full h-full object-contain rounded-full shadow-lg"
            />
          </div>

          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="i in 4"
              :key="i"
              class="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200 hover:border-[#658a22]/50 cursor-pointer p-2 flex items-center justify-center"
            >
              <img
                :src="getImageUrl(product.mainImage)"
                :alt="`thumb${i}`"
                class="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6 pt-2">
          <div>
            <h1 class="text-4xl font-black tracking-tight text-slate-900">{{ product.name }}</h1>
            <p class="text-3xl font-bold text-[#658a22] mt-3">
              <template v-if="lowestPrice()">
                {{ lowestPrice()?.toLocaleString('vi-VN') }}đ
              </template>
              <template v-else> Liên hệ </template>
            </p>
          </div>

          <div class="text-slate-600 leading-relaxed text-[15px]">
            <p>
              {{ product.description || 'Sản phẩm thân thiện với môi trường, chất liệu bền vững.' }}
            </p>
          </div>

          <div class="flex flex-col gap-5 py-6 border-y border-slate-100">
            <div class="flex items-center gap-4">
              <div class="flex items-center border border-slate-200 rounded-xl bg-background-light h-12">
                <button class="px-4 h-full text-slate-500 hover:text-[#658a22] transition-colors flex items-center justify-center">
                  <span class="material-symbols-outlined text-[20px]">remove</span>
                </button>
                <span class="px-2 w-8 text-center font-semibold text-slate-900">1</span>
                <button class="px-4 h-full text-slate-500 hover:text-[#658a22] transition-colors flex items-center justify-center">
                  <span class="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
              <RouterLink
                to="/cartpayment"
                class="flex-1 bg-[#658a22] hover:bg-[#58791d] text-white font-semibold h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
              >
                <span class="material-symbols-outlined text-[20px]">shopping_bag</span>
                Thêm Vào Giỏ
              </RouterLink>
            </div>

            <button class="flex items-center justify-center gap-2 text-[#658a22] font-semibold text-sm hover:underline transition-all">
              <span class="material-symbols-outlined text-lg">favorite</span>
              Thêm Vào Danh Sách Yêu Thích
            </button>
          </div>

          <div class="flex flex-col">
            <details class="group border-b border-slate-100" open>
              <summary class="flex justify-between items-center py-4 cursor-pointer list-none font-semibold text-slate-800 hover:text-[#658a22] transition-colors">
                Mô Tả Chi Tiết
                <span class="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div class="pb-5 text-sm text-slate-600 leading-relaxed">
                {{ product.description || 'Sản phẩm được làm từ chất liệu thân thiện môi trường, bền bỉ và có thể tái sử dụng lâu dài.' }}
              </div>
            </details>

            <details class="group border-b border-slate-100">
              <summary class="flex justify-between items-center py-4 cursor-pointer list-none font-semibold text-slate-800 hover:text-[#658a22] transition-colors">
                Thành Phần / Chất Liệu
                <span class="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div class="pb-5 text-sm text-slate-600">
                <ul class="list-disc pl-5 space-y-1.5">
                  <li>Chất liệu chính: {{ product.material || 'Chất liệu tái chế, thân thiện môi trường' }}</li>
                  <li>Mức độ thân thiện môi trường: {{ product.ecoFriendliness || 'Cao' }}</li>
                  <li>Khả năng tái sử dụng: {{ product.reusability || 'Dùng lâu dài, dễ vệ sinh' }}</li>
                </ul>
              </div>
            </details>

            <details class="group border-b border-slate-100">
              <summary class="flex justify-between items-center py-4 cursor-pointer list-none font-semibold text-slate-800 hover:text-[#658a22] transition-colors">
                Hướng Dẫn Sử Dụng
                <span class="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div class="pb-5 text-sm text-slate-600 leading-relaxed">
                Sử dụng theo hướng dẫn thông thường. Bảo quản nơi khô ráo, tránh tiếp xúc trực tiếp với nhiệt độ cao để duy trì độ bền.
              </div>
            </details>

            <details class="group border-b border-slate-100">
              <summary class="flex justify-between items-center py-4 cursor-pointer list-none font-semibold text-slate-800 hover:text-[#658a22] transition-colors">
                Hướng Dẫn Tái Chế
                <span class="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div class="pb-5 text-sm text-slate-600 leading-relaxed">
                Phân loại rác tái chế theo chất liệu. Có thể tái sử dụng nhiều lần trước khi đưa vào quy trình tái chế.
              </div>
            </details>
          </div>
        </div>
      </div>

      <section class="mt-12 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 class="text-2xl font-bold mb-6 text-slate-900">
          Đánh Giá Sản Phẩm ({{ commentTotal }})
        </h3>

        <div v-if="isCommentsLoading" class="text-center py-10 text-slate-500">
          Đang tải đánh giá...
        </div>

        <div v-else-if="comments.length === 0" class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p class="text-slate-500">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này sau khi mua hàng!</p>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="border-b border-slate-100 pb-6 last:border-0 last:pb-0"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 flex-shrink-0 overflow-hidden border border-slate-200">
                <img v-if="comment.account?.profile?.avatar" :src="getImageUrl(comment.account.profile.avatar)" alt="avatar" class="w-full h-full object-cover">
                <span v-else>{{ (comment.account?.profile?.fullName || comment.account?.email || 'K').charAt(0).toUpperCase() }}</span>
              </div>

              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <h4 class="font-bold text-slate-800">
                    {{ comment.account?.profile?.fullName || comment.account?.email || 'Khách hàng' }}
                  </h4>
                  <span class="text-xs text-slate-400">
                    {{ new Date(comment.createdAt).toLocaleDateString('vi-VN') }}
                  </span>
                </div>

                <div class="flex gap-1 text-[#658a22] text-sm mb-3">
                  <span v-for="star in 5" :key="star" :class="star <= comment.rating ? 'text-[#658a22]' : 'text-slate-200'">
                    ★
                  </span>
                </div>

                <p class="text-slate-600 text-[15px] leading-relaxed">
                  {{ comment.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-12 mb-10">
        <h3 class="text-2xl font-bold mb-8 text-slate-900">Sản Phẩm Mua Kèm</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <RouterLink
            to="/product/1"
            class="flex flex-col gap-3 group bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            <div class="aspect-square rounded-xl bg-slate-50 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCidcosnR_RDGDWN1p_hrPIqNb7XDEksuGQVK3BCtRI_jMGWQXfr2QOy6IEWjsFcwFVUYNuwMWRPDQrjkGJp97biwWGLV2TnN8QMZCGYYgKht9Lurrl9mQxZSWvwpFdUE1mhnOLRnZlQ0RRNxu-1R6r1TdSwjh7SC05UwYqGBXmy-jaBACF39ZgjD5tUadeghpvNkYhuQvBKC5wAvEl6OgZ9T-m82SKfTHDIwhOI6CjDZiGy_nC1em-Qsn5_f433iVRgVgj6Gjr5E"
                alt="Glass Jar"
              />
            </div>
            <div>
              <p class="font-bold text-slate-900 text-sm mb-1 group-hover:text-[#658a22] transition-colors">Hộp Thủy Tinh</p>
              <p class="text-[#658a22] font-semibold">120.000đ</p>
            </div>
          </RouterLink>

          <RouterLink
            to="/product/1"
            class="flex flex-col gap-3 group bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            <div class="aspect-square rounded-xl bg-slate-50 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG85AOn-1PqZg7IEI_blwnhp1nHWTq6gRu5Mke1-9OkmFCoSI8UMp8sEKWxDa2hiEu6jVmgj7mbGmZr2in44vWLalKOFe1Q7wIpyJ7q8rrx-yii4cp68BawQeQ1tOyOAMFV6NvAuVJXhwlASEcqW23xMuL5DfXB5BGrEvivTtggMXUqwIZMGHfvktNa9O2yedYm5d1iuv0MJGuRMEmegHHQgMuKvRiVQ9Q67Ly2KxQdYYGK9BjIRbmvwCEGvfQWtQLmw1w4it270"
                alt="Organic Soap"
              />
            </div>
            <div>
              <p class="font-bold text-slate-900 text-sm mb-1 group-hover:text-[#658a22] transition-colors">Xà Phòng Sả Chanh</p>
              <p class="text-[#658a22] font-semibold">85.000đ</p>
            </div>
          </RouterLink>

          <RouterLink
            to="/product/1"
            class="flex flex-col gap-3 group bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            <div class="aspect-square rounded-xl bg-slate-50 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAVtxacTcmeimxmWFOY7IQuRtWhXzxuiXbPDgft-Ca-_s60Scm9XQ_ARl9_zcPMbgsSV2e1q_JnHVMeFUy4IfxkFlDdJr5K9VIrM1fxZy9ldKZDQs6ndaR8dpfgE_t9YzPv41iYkBtsGuuGXbNJByk8FRl8MVhi8N4YWITGqaPUN-TqLfS4N-m0aJwCRJ8dqCU8_jldCaR9tHSPkXp4iHnadZBeVRP6Qa-jEm3uPPhVsZlXI030CtJU7MCNdMPIv9oUxA8ISNWXD0"
                alt="Face Cloth"
              />
            </div>
            <div>
              <p class="font-bold text-slate-900 text-sm mb-1 group-hover:text-[#658a22] transition-colors">Khăn Mặt Bông Hữu Cơ</p>
              <p class="text-[#658a22] font-semibold">50.000đ</p>
            </div>
          </RouterLink>

          <RouterLink
            to="/product/1"
            class="flex flex-col gap-3 group bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            <div class="aspect-square rounded-xl bg-slate-50 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnkVrKYHXN-karnyObUjEDlOFzmWLZDOkzDzLg08eyqSlaJtegD1lAZJp0f509FE338Lo0Z3-WR5eP8vqV-lJCS3rh0mlQBljsd8jZP58IZVgKmNOKuh0auATAf8Qv9lrwWU9IpiW_e9RJLCWMkzruPjURF5Oj3JdraIGg2F6TDccebC2-21ghs-D69EK4qsBJlMVGHpZQhqYfntvKvBOz8nOupURDgc5HYCOFLBvz9y90T5rqWOXWFm3auG6G9BUOme_9V8e_8hs"
                alt="Metal Straws"
              />
            </div>
            <div>
              <p class="font-bold text-slate-900 text-sm mb-1 group-hover:text-[#658a22] transition-colors">Ống Hút Thép Không Gỉ</p>
              <p class="text-[#658a22] font-semibold">140.000đ</p>
            </div>
          </RouterLink>
        </div>
      </section>
    </div>
  </main>
</template>
