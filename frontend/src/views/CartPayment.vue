<script setup lang="ts">
// Các logic xử lý Form và Giỏ hàng sẽ được thêm vào sau bằng Vue 3 Reactivity
</script>

<template>
  <main class="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 bg-background-light">
    <div class="mb-8">
      <h2 class="text-3xl font-black tracking-tight text-slate-900">Thanh Toán</h2>
      <p class="mt-2 text-slate-600">Hoàn tất đơn hàng thân thiện với môi trường của bạn dưới đây.</p>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">

      <!-- Cột Trái: Giỏ Hàng (Sticky trên màn hình lớn) -->
      <div class="lg:col-span-4 order-2 lg:order-1 lg:sticky lg:top-24">
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-slate-900">Giỏ Hàng Của Bạn</h3>
          </div>

          <!-- Action Bar -->
          <div class="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary accent-[#658a22]" />
              <span class="text-sm font-semibold text-slate-800">Chọn Tất Cả (2)</span>
            </label>
            <button class="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">Xóa Đã Chọn</button>
          </div>

          <div class="space-y-6">
            <!-- Item 1 -->
            <div class="flex items-start gap-3">
              <input type="checkbox" checked class="mt-2 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary accent-[#658a22]" />
              <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
                <img class="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7dGd9Stbq8N0SoOz5bbaT6PZjkP8XzaP-Kb2U_581QfY04_oaOmdQcvl-X1nTgVBbRQlGrsVB4mqU79H-qiy55upLPcrTVECC_AVeAl5O4vdBXP_kelDwqemPVyxyO9KSnDA0QvRHU2WWjpzRJIHybieTzlIpiIvZyyDl_N-3B0ZQ8DJPwufp1GfG5JS8jYrN7mUOHBy1LluCYZJW8zYEmC7vrjmeoB1MlXR7QPZ9S4yHqWs7UYbDvAJxJa-HuCotE4AOn-_yV2w" alt="Bàn chải tre"/>
              </div>
              <div class="flex flex-1 flex-col justify-between">
                <div class="flex justify-between">
                  <div>
                    <h4 class="font-bold text-sm text-slate-900 line-clamp-2 leading-tight">Set Bàn Chải Tre</h4>
                    <p class="text-xs text-slate-500 mt-0.5">Hộp 4 cái</p>
                  </div>
                  <span class="font-bold text-[#658a22]">$12.00</span>
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden h-7">
                    <button class="px-2 text-slate-500 hover:bg-slate-50 transition-colors">-</button>
                    <input type="text" value="1" class="w-8 border-none p-0 text-center text-xs font-semibold focus:ring-0 bg-transparent" readonly/>
                    <button class="px-2 text-slate-500 hover:bg-slate-50 transition-colors">+</button>
                  </div>
                  <button class="text-slate-400 hover:text-red-500 transition-colors text-xs font-medium">Xóa</button>
                </div>
              </div>
            </div>

            <!-- Item 2 -->
            <div class="flex items-start gap-3">
              <input type="checkbox" checked class="mt-2 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary accent-[#658a22]" />
              <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
                <img class="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcWNB-6jFvd_iXk9Fv23VHCB2EdJYlZ5aR9oATCrqpt3g1Cv-JA5Ts87vaOQLBOeYNfq4X7k8Zi79fAYgPsZ6NALFq3ohJagHInVnR-Lf2hB8jaSYI5QgjryWQWz6Zy6qdTBNxFB3Wu5X7-t2JiXl8ovKTmZ1okin5g8pwZiKiU8fIgeIKNG0OcaM30iKO6xEUhezZlRxpNITEIy-1q-9S2aJpvyuf9mDY7r27Po7E8__0xZbfNl9ZBZ8SSAujhXL4dGhYmzvD4hI" alt="Bình thép"/>
              </div>
              <div class="flex flex-1 flex-col justify-between">
                <div class="flex justify-between">
                  <div>
                    <h4 class="font-bold text-sm text-slate-900 line-clamp-2 leading-tight">Bình Nước Thép Không Gỉ</h4>
                    <p class="text-xs text-slate-500 mt-0.5">Xanh Olive • 750ml</p>
                  </div>
                  <span class="font-bold text-[#658a22]">$28.00</span>
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden h-7">
                    <button class="px-2 text-slate-500 hover:bg-slate-50 transition-colors">-</button>
                    <input type="text" value="1" class="w-8 border-none p-0 text-center text-xs font-semibold focus:ring-0 bg-transparent" readonly/>
                    <button class="px-2 text-slate-500 hover:bg-slate-50 transition-colors">+</button>
                  </div>
                  <button class="text-slate-400 hover:text-red-500 transition-colors text-xs font-medium">Xóa</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Totals -->
          <div class="mt-6 border-t border-slate-100 pt-5 space-y-3">
            <div class="flex justify-between text-slate-600 text-sm">
              <span>Tạm tính</span>
              <span class="font-medium text-slate-900">$40.00</span>
            </div>
            <div class="flex justify-between text-slate-600 text-sm">
              <span>Phí vận chuyển</span>
              <span class="italic text-slate-500">Tính ở bước sau</span>
            </div>
            <div class="flex justify-between pt-3 border-t border-slate-100 mt-3">
              <span class="text-base font-bold text-slate-900">Tổng Cộng</span>
              <span class="text-lg font-bold text-[#658a22]">$40.00</span>
            </div>
          </div>

          <div class="mt-5 flex items-center gap-2 rounded-xl bg-[#f4f7ee] p-3 text-xs text-[#58791d] border border-[#e5ebd8]">
            <span class="material-symbols-outlined text-[16px]">info</span>
            <p class="font-medium">Miễn phí vận chuyển trung hòa carbon cho đơn trên $50!</p>
          </div>
        </div>
      </div>

      <!-- Cột Phải: Checkout Details -->
      <div class="lg:col-span-8 order-1 lg:order-2">
        <form class="space-y-10" @submit.prevent>
          <!-- Step 1: Shipping Information -->
          <section>
            <div class="flex items-center gap-3 mb-6">
              <span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#658a22] text-white font-bold text-sm">1</span>
              <h3 class="text-xl font-bold text-slate-900">Thông Tin Giao Hàng</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div class="md:col-span-1">
                <label class="block text-sm font-semibold mb-2 text-slate-800">Họ và Tên</label>
                <input type="text" class="w-full rounded-xl border-slate-200 bg-[#f8f9fa] py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm outline-none" placeholder="Nguyễn Văn A" />
              </div>
              <div class="md:col-span-1">
                <label class="block text-sm font-semibold mb-2 text-slate-800">Số Điện Thoại</label>
                <input type="tel" class="w-full rounded-xl border-slate-200 bg-[#f8f9fa] py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm outline-none" placeholder="0901 234 567" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold mb-2 text-slate-800">Địa Chỉ Nhà / Số Nhà</label>
                <input type="text" class="w-full rounded-xl border-slate-200 bg-[#f8f9fa] py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm outline-none" placeholder="123 Đường Số 1" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2 text-slate-800">Tỉnh / Thành Phố</label>
                <select class="w-full rounded-xl border-slate-200 bg-[#f8f9fa] py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm outline-none cursor-pointer appearance-none">
                  <option value="">Chọn Tỉnh/Thành</option>
                  <option>Hồ Chí Minh</option>
                  <option>Hà Nội</option>
                  <option>Đà Nẵng</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2 text-slate-800">Quận / Huyện</label>
                <select class="w-full rounded-xl border-slate-200 bg-[#f8f9fa] py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm outline-none cursor-pointer appearance-none">
                  <option value="">Chọn Quận/Huyện</option>
                  <option>Quận 1</option>
                  <option>Quận 7</option>
                  <option>Bình Thạnh</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold mb-2 text-slate-800">Phường / Xã</label>
                <select class="w-full rounded-xl border-slate-200 bg-[#f8f9fa] py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm outline-none cursor-pointer appearance-none">
                  <option value="">Chọn Phường/Xã</option>
                  <option>Phường 5</option>
                  <option>Bến Nghé</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold mb-2 text-slate-800">Ghi Chú Đơn Hàng (Tùy chọn)</label>
                <textarea rows="3" class="w-full rounded-xl border-slate-200 bg-[#f8f9fa] py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm outline-none resize-none" placeholder="Hướng dẫn giao hàng đặc biệt..."></textarea>
              </div>
            </div>
          </section>

          <!-- Step 2: Select Payment Method -->
          <section>
            <div class="flex items-center gap-3 mb-6">
              <span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#658a22] text-white font-bold text-sm">2</span>
              <h3 class="text-xl font-bold text-slate-900">Phương Thức Thanh Toán</h3>
            </div>

            <div class="space-y-4">
              <!-- COD Option -->
              <label class="flex items-center p-5 border border-slate-200 rounded-2xl bg-white cursor-pointer hover:border-primary/50 transition-all shadow-sm">
                <input type="radio" name="payment_method" class="h-4 w-4 border-slate-300 text-primary focus:ring-primary accent-[#658a22]" />
                <div class="ml-4 flex items-center gap-3">
                  <span class="material-symbols-outlined text-[#658a22]">local_shipping</span>
                  <span class="font-bold text-slate-800 text-[15px]">Thanh Toán Khi Nhận Hàng (COD)</span>
                </div>
              </label>

              <!-- Bank Transfer Option (Selected Style) -->
              <label class="flex items-center p-5 border-2 border-[#658a22] rounded-2xl bg-white cursor-pointer transition-all shadow-sm">
                <input type="radio" name="payment_method" checked class="h-4 w-4 border-slate-300 text-primary focus:ring-primary accent-[#658a22]" />
                <div class="ml-4 flex items-center gap-3">
                  <span class="material-symbols-outlined text-[#658a22]">account_balance</span>
                  <span class="font-bold text-slate-800 text-[15px]">Chuyển Khoản Ngân Hàng / Ví Điện Tử</span>
                </div>
              </label>

              <!-- Bank Transfer Info Box -->
              <div class="rounded-2xl border border-[#e5ebd8] bg-[#f8f9f5] p-6 md:p-8 space-y-8 mt-2">
                <div class="flex flex-wrap items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <img alt="Momo" class="h-6 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZzjCYuPP1T9XHsRrfjGsrU7tbV7BXHN8P3OJh0RfGFzJbbcJiqFoq-JMox2NYh6w0XNzzK-3seg9j_bmFiP_DFU6gLC-npBq225JYStVXVZzbBXl7b-xX2JpsXyVxqFIfYPOAO7wDr8ax5FvL5XaTYUNaHmxyXghr5BBl-2311ItY4wt7R0VeQUkVPft_NNXEW-esG3pYsbOb4BaLYlxCFX4xISNrTGVR-e-MUb71tS6gifx938CaUi2WZHkYkNpe6c6-hIlNMYg"/>
                  <img alt="ZaloPay" class="h-5 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5C_zD5-CjIWyZBB3VHfC1grVaxEmLfo7vaAUFxK5gmi2C1VNy-xGI9lweL9ivvA39yOSzy_qYGK0wEJGzAXwwrQ1qB_z8zlALJEqxfJ_aeXNEzL8Ad3IXKmX4azW2oYaEqMVvdufmf9fsCWPcHbISSgx2dvHbyVXmD2m0VzJrmfDtTx8MjJil3II1ejRf0mNlfWAc6AlFJgIdWmyfCJuyMzmDmlznxKigJYQbRG_2Qq_4bcKZHoFF1cu79bSvf9J7T-3aYBWOVDU"/>
                  <img alt="Vietcombank" class="h-6 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL1UmrmeV1sT6PHvqgMX3gpdbjGv_uMaHyq9GR3goK_3wyquNnTrRMRtlss9lc-UZmptpohttjXITubtJnI9fhqVbtfM14U3SqjOJigGer70S-KhvWPVFsfDuEWoQkKy3jviGME9ZP-lu654fJV7Ey79pSxhyhHIfZpCr2KI2X2Y71ALu_4TwT6hiMELtK5e5zJmUGZhgHt8FVWwbnwjXLQNI04uJ1_9xxr6Jhty3BkWVQkr94esKHf5nLg2QxDSB7tvvZQBXuu1k"/>
                  <img alt="Techcombank" class="h-4 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIyiUBr4V-tWT9qolvgd5t3ZE_QnHrYwfUp6fiGPA36BFoEnxW7WGGakO2-cAKq640X9s1_lybeozDOuLch62jo2un5DtOkNOgLcCNUZyRLpvnPpVLTLSgAlbGDq4XeTFVIfdqppj_XrkWa1tVoe2e1n8aM8wjohFZN7Q45ai9UBavzwdnLNA3zzZM-dBh1FZwhDbE6qQAr7prQOmpbasg4C9Ma1lcqlgkUWCgwcrO7KIbb8eZq03M-KJepfkNxv65UHdpIF9tLhk"/>
                </div>

                <div class="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div class="w-40 h-40 flex-shrink-0 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                    <!-- Mock VietQR Code -->
                    <div class="w-full h-full bg-slate-50 flex items-center justify-center relative overflow-hidden rounded-lg">
                      <div class="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 p-2 opacity-80">
                        <div class="bg-slate-800"></div><div class="bg-slate-800"></div><div class="bg-white"></div><div class="bg-slate-800"></div>
                        <div class="bg-white"></div><div class="bg-slate-800"></div><div class="bg-slate-800"></div><div class="bg-white"></div>
                        <div class="bg-slate-800"></div><div class="bg-white"></div><div class="bg-slate-800"></div><div class="bg-slate-800"></div>
                        <div class="bg-slate-800"></div><div class="bg-slate-800"></div><div class="bg-white"></div><div class="bg-slate-800"></div>
                      </div>
                      <div class="z-10 bg-white p-1.5 rounded shadow-sm">
                        <span class="material-symbols-outlined text-[#658a22] text-3xl">qr_code_2</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Ngân Hàng</p>
                      <p class="font-bold text-slate-900">Vietcombank - CN Hồ Chí Minh</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Số Tài Khoản</p>
                        <p class="font-bold text-[#658a22] text-lg tracking-wider">01234567890</p>
                      </div>
                      <div>
                        <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Nội Dung CK</p>
                        <p class="font-bold text-slate-900 bg-slate-100 inline-block px-2 py-0.5 rounded">#ZW9842</p>
                      </div>
                    </div>
                    <div>
                      <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Chủ Tài Khoản</p>
                      <p class="font-bold text-slate-900">ZERO WASTE STORE CO., LTD</p>
                    </div>
                  </div>
                </div>
                <p class="text-center text-[13px] text-slate-500 font-medium">
                  "Quét mã QR qua ứng dụng ngân hàng để thanh toán nhanh và chính xác nhất."
                </p>
              </div>
            </div>
          </section>

          <div class="pt-6 border-t border-slate-200">
            <label class="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" class="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary accent-[#658a22]" />
              <span class="text-sm text-slate-600 font-medium">
                Tôi đồng ý với <a href="#" class="text-[#658a22] hover:underline">Điều Khoản Dịch Vụ</a> và <a href="#" class="text-[#658a22] hover:underline">Chính Sách Đổi Trả</a>.
              </span>
            </label>
          </div>

          <!-- Action Button -->
          <button type="submit" class="w-full rounded-2xl bg-[#658a22] hover:bg-[#58791d] py-4 text-center font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.99] text-lg">
            Xác Nhận Đặt Hàng
          </button>

          <p class="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 mt-4">
            <span class="material-symbols-outlined text-[14px]">lock</span>
            Giao dịch được bảo mật bằng mã hóa SSL 256-bit
          </p>
        </form>
      </div>
    </div>
  </main>
</template>
