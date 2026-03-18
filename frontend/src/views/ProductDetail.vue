<script setup lang="ts">
import { RouterLink } from 'vue-router'

</script>

<template>
  <div class="bg-background-light min-h-screen w-full pb-20">
    <main class="mx-auto max-w-[1200px] w-full px-4 py-8 sm:px-6 lg:px-8">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
        <RouterLink to="/" class="hover:text-primary transition-colors">Trang Chủ</RouterLink>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <RouterLink to="/" class="hover:text-primary transition-colors">Chăm Sóc Cá Nhân</RouterLink>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <span class="text-slate-900 font-semibold">Bàn Chải Tre Cao Cấp</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <!-- Cột Trái: Ảnh Sản Phẩm -->
        <div class="flex flex-col gap-4">
          <div class="aspect-square w-full bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-8 border border-slate-100">
            <img alt="Bàn chải tre" class="w-full h-full object-contain rounded-full shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl6iVk3zfyBhoyuaHS9qnxQpGoo5SfiiKR17B1uFqtJtdznNMhKs-BjvAVTLHC0CNtM2BpA5lLdibcVwwLAwD-GOXLLjynzGJF4TCbDsmrmscZjbvFLMMdLL7AdnbjiHY7GyzNHgwAPa9PU_NS1Zqf5oZgLlfuXLhsYbi1nW_YnP2EkUs-OC0HSicnRRvcXtEpBNSPJwNSR3Kvkrd0nVk1_Lv3Jgodzf1b1okArv143Frt_RADDIfaPgsdmvMhsvjQwnX0N_QYNl4"/>
          </div>
          <div class="grid grid-cols-4 gap-4">
            <div class="aspect-square bg-slate-50 rounded-xl overflow-hidden border-2 border-primary cursor-pointer p-2 flex items-center justify-center">
              <img alt="thumb1" class="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvrvWDxeTKKSlRTb3m08rIxacRgTrqPQydTFZxj8mRCBXHl_Ac23JErLxa0GiKlCEZcptmD_fXz1V_6gxBBfDjWrnWQO7XswOF_UfEdAAqhm7WdU9q98U3xdS_z2JO6Lgo3F3BvA0eSHcke1Qt6zDtq3R1eh_fMacGnV5E_QilmRnrJMoByyx197Hm_MB_YqJkXiQ3HlNiXNazIb9We6mlQxIcujLy6aSPVNjtU4ErVmMyTtkGF65wMz3kcrxphCAeUT8d9ZZQWPE"/>
            </div>
            <div class="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200 hover:border-primary/50 cursor-pointer p-2 flex items-center justify-center">
              <img alt="thumb2" class="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgSkHr1Pni17uBeLF1Inyy9ZKTN37Yp9YQ5vque8tFbEjIYGNpvhAr9b0uSP4_6Cfk4anAB5j7RQi1972x7lbqntKydUDH-C8KpmSRfGcSyRvrNiL7PG2XSawsgqUPm57e12EsrYIitYWYuuAryS44OWHcns9tKydUDH-C8KpmSRfGcSyRvrNiL7PG2XSawsgqUPm57e12EsrYIitYWYuuAryS44OWHcns9tKgs_xvgQCCk5-ZMLFi7wfzB-4_8kkuRmf0vGg8crBV5ws4SMPxORn7ZHolUV34p7O6udtGzjVY24jvVepZzswuHvIlEEqpv7z542q-oWKGX-cDQ"/>
            </div>
            <div class="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200 hover:border-primary/50 cursor-pointer p-2 flex items-center justify-center">
              <img alt="thumb3" class="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz0b5wqHi05-_adBViLTpl1TQuDfCrH-wSKpR6YUUWYPVebcy8oF5TPJM7wUPIiuxQ7sNeQ3SlHrEwxUfc2UzxQSLvL5bDY83Xk12rzdkr1kwjFHVChPj4lgQwgB0snV5h8XlcsjHJXxZxfzq8fJJGk1BU4Alj3PsoaRR5UqSPbyDCBhnr3z90SvahLOm6XlT2_dVY_sM1iZwWJ7iIZ7wXZ6TDYZHULB4FhBIQS5MwJYzpHjz8u4liggHKPakaL9gqbMwahzopjAo"/>
            </div>
            <div class="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200 hover:border-primary/50 cursor-pointer p-2 flex items-center justify-center">
              <img alt="thumb4" class="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCltml5bIbZ7-Wpdu8sRp_Gfp3ORj5j-szC6n_qu-GlrSawhmyHPYhAjDmgkaqe9r6mDsxjarr57wpfeIAhPVCSdgy_LyRegU28voR7Q1dliyh0iCOx4ib0cQx1o_eNaDnG5w_jczOupdqCw5NHBiO6Wjh-i4caOnMSTBmFNyL6YRxXNvjWDv_oo9fJ9xKbb78RiswwHKuPQoUmOKtpWaMY_TG49KT05UJAmqxI1pFT5c_Wx2iU6fBQYvwxbVRr-1ZxzvBPokPbapM"/>
            </div>
          </div>
        </div>

        <!-- Cột Phải: Thông tin Sản Phẩm -->
        <div class="flex flex-col gap-6 pt-2">
          <div>
            <h1 class="text-4xl font-black tracking-tight text-slate-900">Bàn Chải Tre Cao Cấp</h1>
            <p class="text-3xl font-bold text-primary mt-3">$6.50</p>
          </div>

          <div class="text-slate-600 leading-relaxed text-[15px]">
            <p>Bàn chải đánh răng tre phân hủy sinh học 100% của chúng tôi là giải pháp thân thiện với môi trường thay thế hoàn hảo cho đồ nhựa. Nổi bật với lông bàn chải than hoạt tính không chứa BPA và tay cầm kháng khuẩn tự nhiên.</p>
          </div>

          <div class="flex flex-col gap-5 py-6 border-y border-slate-100">
            <div class="flex items-center gap-4">
              <!-- Số lượng -->
              <div class="flex items-center border border-slate-200 rounded-xl bg-background-light h-12">
                <button class="px-4 h-full text-slate-500 hover:text-primary transition-colors flex items-center justify-center">
                  <span class="material-symbols-outlined text-[20px]">remove</span>
                </button>
                <span class="px-2 w-8 text-center font-semibold text-slate-900">1</span>
                <button class="px-4 h-full text-slate-500 hover:text-primary transition-colors flex items-center justify-center">
                  <span class="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
              <!-- Nút Thêm Giỏ Hàng -->
              <RouterLink to="/checkout" class="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]">
                <span class="material-symbols-outlined text-[20px]">shopping_bag</span>
                Thêm Vào Giỏ
              </RouterLink>
            </div>

            <button class="flex items-center justify-center gap-2 text-primary font-semibold text-sm hover:underline transition-all">
              <span class="material-symbols-outlined text-lg">favorite</span>
              Thêm Vào Danh Sách Yêu Thích
            </button>
          </div>

          <!-- Tabs Thông Tin -->
          <div class="flex flex-col">
            <details class="group border-b border-slate-100" open>
              <summary class="flex justify-between items-center py-4 cursor-pointer list-none font-semibold text-slate-800 hover:text-primary transition-colors">
                Mô Tả Chi Tiết
                <span class="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div class="pb-5 text-sm text-slate-600 leading-relaxed">
                Nâng tầm thói quen buổi sáng của bạn với chiếc bàn chải đánh răng không phải mất 500 năm để phân hủy ở bãi rác. Tay cầm tiện dụng của chúng tôi được chạm khắc từ tre Moso thu hoạch bền vững, loại tre mọc lại nhanh chóng mà không cần dùng thuốc trừ sâu. Lông bàn chải than mềm mại dịu nhẹ với nướu đồng thời mang lại hiệu quả làm sạch sâu.
              </div>
            </details>
            <details class="group border-b border-slate-100">
              <summary class="flex justify-between items-center py-4 cursor-pointer list-none font-semibold text-slate-800 hover:text-primary transition-colors">
                Thành Phần / Chất Liệu
                <span class="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div class="pb-5 text-sm text-slate-600">
                <ul class="list-disc pl-5 space-y-1.5">
                  <li>Tay cầm: 100% Tre Moso nguồn gốc bền vững</li>
                  <li>Lông bàn chải: Nylon-4 không chứa BPA tẩm than hoạt tính</li>
                  <li>Bề mặt: Phủ sáp tự nhiên từ thực vật</li>
                  <li>Đóng gói: Bìa carton tái chế, in bằng mực gốc đậu nành</li>
                </ul>
              </div>
            </details>
            <details class="group border-b border-slate-100">
              <summary class="flex justify-between items-center py-4 cursor-pointer list-none font-semibold text-slate-800 hover:text-primary transition-colors">
                Hướng Dẫn Sử Dụng
                <span class="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div class="pb-5 text-sm text-slate-600 leading-relaxed">
                Sử dụng giống như bàn chải đánh răng thông thường. Chúng tôi khuyên bạn nên chải răng hai lần mỗi ngày trong 2 phút. Sau khi sử dụng, rửa sạch và bảo quản nơi khô ráo. Không ngâm tay cầm tre trong nước để duy trì tuổi thọ. Thay bàn chải đánh răng mỗi 3 tháng.
              </div>
            </details>
            <details class="group border-b border-slate-100">
              <summary class="flex justify-between items-center py-4 cursor-pointer list-none font-semibold text-slate-800 hover:text-primary transition-colors">
                Hướng Dẫn Tái Chế
                <span class="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div class="pb-5 text-sm text-slate-600 leading-relaxed">
                Khi bàn chải của bạn bị mòn, hãy dùng kìm để nhổ lông nylon ra. Lông bàn chải có thể được tái chế nếu cơ sở địa phương của bạn chấp nhận nylon-4. Tay cầm bằng tre có thể được cho vào thùng ủ phân tại nhà hoặc dùng làm đồ đánh dấu cây trong vườn. Hộp hộp hoàn toàn có thể tái chế.
              </div>
            </details>
          </div>
        </div>
      </div>

      <!-- Sản phẩm liên quan -->
      <section class="mt-20 mb-10">
        <h3 class="text-2xl font-bold mb-8 text-slate-900">Sản Phẩm Mua Kèm</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <RouterLink to="/product/1" class="flex flex-col gap-3 group bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div class="aspect-square rounded-xl bg-slate-50 overflow-hidden">
              <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCidcosnR_RDGDWN1p_hrPIqNb7XDEksuGQVK3BCtRI_jMGWQXfr2QOy6IEWjsFcwFVUYNuwMWRPDQrjkGJp97biwWGLV2TnN8QMZCGYYgKht9Lurrl9mQxZSWvwpFdUE1mhnOLRnZlQ0RRNxu-1R6r1TdSwjh7SC05UwYqGBXmy-jaBACF39ZgjD5tUadeghpvNkYhuQvBKC5wAvEl6OgZ9T-m82SKfTHDIwhOI6CjDZiGy_nC1em-Qsn5_f433iVRgVgj6Gjr5E" alt="Glass Jar"/>
            </div>
            <div>
              <p class="font-bold text-slate-900 text-sm mb-1 group-hover:text-primary transition-colors">Hộp Thủy Tinh</p>
              <p class="text-primary font-semibold">$12.00</p>
            </div>
          </RouterLink>

          <RouterLink to="/product/1" class="flex flex-col gap-3 group bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div class="aspect-square rounded-xl bg-slate-50 overflow-hidden">
              <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG85AOn-1PqZg7IEI_blwnhp1nHWTq6gRu5Mke1-9OkmFCoSI8UMp8sEKWxDa2hiEu6jVmgj7mbGmZr2in44vWLalKOFe1Q7wIpyJ7q8rrx-yii4cp68BawQeQ1tOyOAMFV6NvAuVJXhwlASEcqW23xMuL5DfXB5BGrEvivTtggMXUqwIZMGHfvktNa9O2yedYm5d1iuv0MJGuRMEmegHHQgMuKvRiVQ9Q67Ly2KxQdYYGK9BjIRbmvwCEGvfQWtQLmw1w4it270" alt="Organic Soap"/>
            </div>
            <div>
              <p class="font-bold text-slate-900 text-sm mb-1 group-hover:text-primary transition-colors">Xà Phòng Sả Chanh</p>
              <p class="text-primary font-semibold">$8.50</p>
            </div>
          </RouterLink>

          <RouterLink to="/product/1" class="flex flex-col gap-3 group bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div class="aspect-square rounded-xl bg-slate-50 overflow-hidden">
              <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAVtxacTcmeimxmWFOY7IQuRtWhXzxuiXbPDgft-Ca-_s60Scm9XQ_ARl9_zcPMbgsSV2e1q_JnHVMeFUy4IfxkFlDdJr5K9VIrM1fxZy9ldKZDQs6ndaR8dpfgE_t9YzPv41iYkBtsGuuGXbNJByk8FRl8MVhi8N4YWITGqaPUN-TqLfS4N-m0aJwCRJ8dqCU8_jldCaR9tHSPkXp4iHnadZBeVRP6Qa-jEm3uPPhVsZlXI030CtJU7MCNdMPIv9oUxA8ISNWXD0" alt="Face Cloth"/>
            </div>
            <div>
              <p class="font-bold text-slate-900 text-sm mb-1 group-hover:text-primary transition-colors">Khăn Mặt Bông Hữu Cơ</p>
              <p class="text-primary font-semibold">$5.00</p>
            </div>
          </RouterLink>

          <RouterLink to="/product/1" class="flex flex-col gap-3 group bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div class="aspect-square rounded-xl bg-slate-50 overflow-hidden">
              <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnkVrKYHXN-karnyObUjEDlOFzmWLZDOkzDzLg08eyqSlaJtegD1lAZJp0f509FE338Lo0Z3-WR5eP8vqV-lJCS3rh0mlQBljsd8jZP58IZVgKmNOKuh0auATAf8Qv9lrwWU9IpiW_e9RJLCWMkzruPjURF5Oj3JdraIGg2F6TDccebC2-21ghs-D69EK4qsBJlMVGHpZQhqYfntvKvBOz8nOupURDgc5HYCOFLBvz9y90T5rqWOXWFm3auG6G9BUOme_9V8e_8hs" alt="Metal Straws"/>
            </div>
            <div>
              <p class="font-bold text-slate-900 text-sm mb-1 group-hover:text-primary transition-colors">Ống Hút Thép Không Gỉ</p>
              <p class="text-primary font-semibold">$14.00</p>
            </div>
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>
