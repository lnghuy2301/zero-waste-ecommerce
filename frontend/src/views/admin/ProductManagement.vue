<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductService from '@/service/product.ts'
import ProductVariantService from '@/service/productVariant.ts'
import { notify } from '@/utils/notifier.ts'
import { Category } from '@/service/category.ts' // ← sửa thành destructuring
import Promotion from '@/service/promotion.ts'

// Các state của khuyến mãi
const promotions = ref<any[]>([])
const selectedVariantIdsForPromotion = ref<number[]>([]) // ← thêm dòng này
const showPromotionModal = ref(false)
const currentPromotion = ref<any>(null)
const isEditPromotion = ref(false) // phân biệt tạo hay sửa
const newPromotion = ref({
  name: '',
  code: '',
  discountType: 'PERCENT', // PERCENT hoặc FIXED_AMOUNT
  discountValue: 0,
  startDate: '',
  endDate: '',
  isActive: true,
})

const openCreatePromotion = () => {
  currentPromotion.value = null
  isEditPromotion.value = false
  newPromotion.value = {
    name: '',
    code: '',
    discountType: 'PERCENT',
    discountValue: 0,
    startDate: '',
    endDate: '',
    isActive: true,
  }
  showPromotionModal.value = true
}

const editPromotion = (promo: any) => {
  currentPromotion.value = promo
  isEditPromotion.value = true
  newPromotion.value = { ...promo }
  showPromotionModal.value = true
}

const savePromotion = async () => {
  if (!newPromotion.value.name?.trim()) return notify.error('Tên khuyến mãi không được bỏ trống')
  if (!newPromotion.value.code?.trim()) return notify.error('Mã khuyến mãi không được bỏ trống')
  if (!newPromotion.value.discountValue || newPromotion.value.discountValue <= 0) {
    return notify.error('Giá trị giảm phải lớn hơn 0')
  }

  try {
    if (isEditPromotion.value && currentPromotion.value) {
      await Promotion.updatePromotion(currentPromotion.value.id, newPromotion.value)
      notify.success('Cập nhật khuyến mãi thành công')
    } else {
      await Promotion.createPromotion(newPromotion.value)
      notify.success('Tạo khuyến mãi thành công')
    }
    showPromotionModal.value = false
    loadData()
  } catch (e: any) {
    const msg = e.response?.data?.message || 'Lưu khuyến mãi thất bại'
    notify.error(Array.isArray(msg) ? msg.join(' • ') : msg)
  }
}

const deletePromotion = async (id: number) => {
  if (!confirm('Xóa khuyến mãi này?')) return
  try {
    await Promotion.deletePromotion(id)
    notify.success('Xóa khuyến mãi thành công')
    loadData()
  } catch (e) {
    notify.error('Xóa khuyến mãi thất bại')
  }
}

// Áp dụng khuyến mãi cho biến thể
const applyPromotionToVariant = async (variantId: number) => {
  // Bạn có thể mở một modal chọn khuyến mãi, hoặc chọn từ danh sách có sẵn
  const promoId = prompt('Nhập ID khuyến mãi muốn áp dụng cho biến thể này:')
  if (!promoId) return

  try {
    await Promotion.applyPromotionToVariant(variantId, Number(promoId)) // cần thêm hàm này vào service
    notify.success('Áp dụng khuyến mãi thành công cho biến thể')
    loadData()
  } catch (e) {
    notify.error('Áp dụng khuyến mãi thất bại')
  }
}

// Áp dụng khuyến mãi cho tất cả biến thể của các sản phẩm đã chọn
// Mở modal chọn khuyến mãi cho các sản phẩm đã chọn
const openApplyPromotionModal = () => {
  if (selectedProductIds.value.length === 0) {
    return notify.error('Vui lòng chọn ít nhất 1 sản phẩm')
  }

  const variantIds = variants.value
    .filter((v) => selectedProductIds.value.includes(v.productId))
    .map((v) => v.id)

  if (variantIds.length === 0) {
    return notify.error('Không có biến thể nào để áp dụng')
  }

  selectedVariantIdsForPromotion.value = variantIds
  showApplyPromotionModal.value = true
}

// Áp dụng khuyến mãi từ modal
const confirmApplyPromotion = async (promotionId: number) => {
  try {
    await ProductVariantService.applyPromotion({
      variantIds: selectedVariantIdsForPromotion.value,
      promotionId: promotionId,
    })
    notify.success(
      `Đã áp dụng khuyến mãi cho ${selectedVariantIdsForPromotion.value.length} biến thể`,
    )
    showApplyPromotionModal.value = false
    loadData()
  } catch (e: any) {
    notify.error('Áp dụng khuyến mãi thất bại')
  }
}
const products = ref<any[]>([])
const variants = ref<any[]>([])
const loading = ref(false)
const categories = ref<any[]>([]) // ← thêm

const selectedProductIds = ref<number[]>([])
const showApplyPromotionModal = ref(false)
const selectedPromotionForApply = ref<number | null>(null)
const selectedVariantIds = ref<number[]>([])

const showProductModal = ref(false)
const showImageModal = ref(false)
const showVariantModal = ref(false)
const showCategoryImageModal = ref(false)
const showCategoryModal = ref(false) // ← modal tạo danh mục

const currentProductId = ref<number | null>(null)
const currentProductIdForImage = ref<number | null>(null)

const newCategory = ref({
  // ← form tạo danh mục
  name: '',
  description: '',
})

const newProduct = ref({
  name: '',
  slug: '',
  categoryId: 1,
  description: '',
  material: '',
})

const newVariant = ref({
  name: '',
  price: 0,
  stock: 100,
  sku: '',
  color: '',
  size: '',
})

// Load tất cả dữ liệu
const loadData = async () => {
  loading.value = true
  try {
    const [prodRes, varRes, catRes, promoRes] = await Promise.all([
      ProductService.getAllProducts(),
      ProductVariantService.getAll(),
      Category.getAllCategories(),
      Promotion.getAllPromotions(),
    ])
    products.value = prodRes
    variants.value = varRes
    categories.value = catRes || []
    promotions.value = promoRes || []
  } catch (e) {
    notify.error('Không tải được dữ liệu')
  } finally {
    loading.value = false
  }
}

const toggleProductSelect = (id: number) => {
  const index = selectedProductIds.value.indexOf(id)
  if (index > -1) selectedProductIds.value.splice(index, 1)
  else selectedProductIds.value.push(id)
}

const toggleVariantSelect = (id: number) => {
  const index = selectedVariantIds.value.indexOf(id)
  if (index > -1) selectedVariantIds.value.splice(index, 1)
  else selectedVariantIds.value.push(id)
}

// Tạo sản phẩm
const createProduct = async () => {
  if (!newProduct.value.name?.trim()) return notify.error('Tên sản phẩm không được bỏ trống')
  if (!newProduct.value.slug?.trim()) return notify.error('Slug không được bỏ trống')
  if (!newProduct.value.categoryId || newProduct.value.categoryId < 1) {
    return notify.error('Vui lòng chọn danh mục')
  }

  try {
    const created = await ProductService.createProduct({
      name: newProduct.value.name.trim(),
      slug: newProduct.value.slug.trim().toLowerCase(),
      categoryId: Number(newProduct.value.categoryId),
      description: newProduct.value.description?.trim() || undefined,
      material: newProduct.value.material?.trim() || undefined,
    })

    notify.success('Tạo sản phẩm thành công!')
    showProductModal.value = false
    resetProductForm()

    currentProductIdForImage.value = created.id
    showImageModal.value = true
    loadData()
  } catch (e: any) {
    const msg = e.response?.data?.message || 'Tạo sản phẩm thất bại'
    notify.error(Array.isArray(msg) ? msg.join(' • ') : msg)
  }
}

// Upload ảnh
const uploadProductImage = async () => {
  if (!currentProductIdForImage.value) return
  const fileInput = document.getElementById('imageUpload') as HTMLInputElement
  const file = fileInput?.files?.[0]
  if (!file) return notify.error('Vui lòng chọn file ảnh')

  try {
    await ProductService.uploadMainImage(currentProductIdForImage.value, file)
    notify.success('Upload hình ảnh thành công!')
    showImageModal.value = false
    loadData()
  } catch (e) {
    notify.error('Upload hình ảnh thất bại')
  }
}

// Tạo biến thể
const createVariant = async () => {
  if (!currentProductId.value || !newVariant.value.name || newVariant.value.price <= 0) {
    return notify.error('Vui lòng nhập đầy đủ thông tin biến thể')
  }
  try {
    await ProductVariantService.createVariant({
      productId: currentProductId.value,
      name: newVariant.value.name,
      price: newVariant.value.price,
      stock: newVariant.value.stock,
      sku: newVariant.value.sku || `SKU-${Date.now()}`,
      color: newVariant.value.color,
      size: newVariant.value.size,
    })
    notify.success('Tạo biến thể thành công!')
    showVariantModal.value = false
    resetVariantForm()
    loadData()
  } catch (e) {
    notify.error('Tạo biến thể thất bại')
  }
}

const currentCategoryIdForImage = ref<number | null>(null) // ← thêm dòng này

// Tạo danh mục (chỉ name + description)
const createCategory = async () => {
  if (!newCategory.value.name?.trim()) {
    return notify.error('Tên danh mục không được bỏ trống')
  }

  try {
    const created = await Category.createCategory({
      name: newCategory.value.name.trim(),
      description: newCategory.value.description?.trim() || null,
    })

    notify.success('Tạo danh mục thành công!')
    showCategoryModal.value = false
    newCategory.value = { name: '', description: '' }

    // Mở modal upload ảnh ngay sau khi tạo
    currentCategoryIdForImage.value = created.id
    showCategoryImageModal.value = true // ← modal upload ảnh danh mục

    loadData()
  } catch (e: any) {
    const msg = e.response?.data?.message || 'Tạo danh mục thất bại'
    notify.error(Array.isArray(msg) ? msg.join(' • ') : msg)
  }
}

// Upload ảnh cho danh mục
const uploadCategoryImage = async () => {
  if (!currentCategoryIdForImage.value) return

  const fileInput = document.getElementById('categoryImageUpload') as HTMLInputElement
  const file = fileInput?.files?.[0]
  if (!file) return notify.error('Vui lòng chọn file ảnh')

  try {
    await Category.uploadImage(currentCategoryIdForImage.value, file) // cần thêm hàm này vào service
    notify.success('Upload ảnh danh mục thành công!')
    showCategoryImageModal.value = false
    loadData()
  } catch (e) {
    notify.error('Upload ảnh danh mục thất bại')
  }
}

const deleteSelectedProducts = async () => {
  if (selectedProductIds.value.length === 0) return
  if (!confirm(`Xóa ${selectedProductIds.value.length} sản phẩm?`)) return
  try {
    await ProductService.deleteListProducts({ Ids: selectedProductIds.value })
    notify.success('Xóa thành công')
    selectedProductIds.value = []
    loadData()
  } catch (e) {
    notify.error('Xóa thất bại')
  }
}

// HÀM MỚI: Xóa biến thể
const deleteSelectedVariants = async () => {
  if (selectedVariantIds.value.length === 0) return
  if (!confirm(`Xóa ${selectedVariantIds.value.length} biến thể đã chọn?`)) return
  try {
    await ProductVariantService.deleteListVariants({ Ids: selectedVariantIds.value })
    notify.success('Xóa biến thể thành công')
    selectedVariantIds.value = []
    loadData()
  } catch (e) {
    notify.error('Xóa thất bại')
  }
}

const resetProductForm = () => {
  newProduct.value = { name: '', slug: '', categoryId: 1, description: '', material: '' }
}

const resetVariantForm = () => {
  newVariant.value = { name: '', price: 0, stock: 100, sku: '', color: '', size: '' }
}

const openVariantModal = (productId: number) => {
  currentProductId.value = productId
  showVariantModal.value = true
}

onMounted(loadData)
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Quản lý Sản phẩm</h1>
        <p class="text-slate-500 font-medium">Nhấn vào thẻ để chọn sản phẩm cần thao tác.</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="openCreatePromotion"
          class="bg-[#658a22] hover:bg-[#58791d] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all"
        >
          <span class="material-symbols-outlined">percent</span> Quản lý khuyến mãi
        </button>
        <button
          v-if="selectedProductIds.length > 0"
          @click="openApplyPromotionModal"
          class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-amber-100 transition-all"
        >
          Áp dụng KM cho {{ selectedProductIds.length }} sản phẩm
        </button>
        <button
          v-if="selectedProductIds.length > 0"
          @click="deleteSelectedProducts"
          class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-red-100 transition-all"
        >
          Xóa {{ selectedProductIds.length }} sản phẩm
        </button>

        <button
          v-if="selectedVariantIds.length > 0"
          @click="deleteSelectedVariants"
          class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 transition-all flex items-center gap-2"
        >
          <span class="material-symbols-outlined">delete_sweep</span>
          Xóa {{ selectedVariantIds.length }} biến thể
        </button>

        <button
          @click="showProductModal = true"
          class="bg-[#658a22] hover:bg-[#58791d] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all"
        >
          <span class="material-symbols-outlined">add_circle</span> Tạo sản phẩm mới
        </button>

        <!-- Nút Tạo danh mục - style giống hệt -->
        <button
          @click="showCategoryModal = true"
          class="bg-[#658a22] hover:bg-[#58791d] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all"
        >
          <span class="material-symbols-outlined">add_circle</span> Tạo danh mục
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center py-20 font-bold text-slate-400 uppercase tracking-widest animate-pulse"
    >
      Đang tải dữ liệu...
    </div>

    <div v-else class="space-y-8">
      <div
        v-for="product in products"
        :key="product.id"
        @click="toggleProductSelect(product.id)"
        class="bg-white rounded-[32px] p-8 border-2 transition-all cursor-pointer relative active:scale-[0.995] select-none"
        :class="
          selectedProductIds.includes(product.id)
            ? 'border-[#658a22] shadow-xl bg-[#fcfdf9]'
            : 'border-slate-100 shadow-sm hover:border-slate-200'
        "
      >
        <div
          v-if="selectedProductIds.includes(product.id)"
          class="absolute -top-3 -right-3 bg-[#658a22] text-white rounded-full p-1 shadow-lg border-4 border-white"
        >
          <span class="material-symbols-outlined text-xl">check</span>
        </div>

        <div class="flex items-center gap-6">
          <img
            v-if="product.mainImage"
            :src="`http://localhost:3000${product.mainImage}`"
            class="w-24 h-24 object-cover rounded-3xl border-2 border-slate-50 shadow-sm"
          />
          <div
            v-else
            class="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200 text-slate-300"
          >
            <span class="material-symbols-outlined text-4xl">inventory</span>
          </div>

          <div class="flex-1">
            <h3
              class="font-black text-2xl"
              :class="selectedProductIds.includes(product.id) ? 'text-[#658a22]' : 'text-slate-800'"
            >
              {{ product.name }}
            </h3>
            <p class="text-slate-400 font-bold text-sm mt-1 uppercase tracking-tighter">
              Mã: {{ product.slug }}
            </p>
          </div>

          <button
            @click.stop="openVariantModal(product.id)"
            class="px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-lg text-emerald-400">add</span> Biến thể
          </button>
        </div>

        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pl-4">
          <div
            v-for="variant in variants.filter((v) => v.productId === product.id)"
            :key="variant.id"
            @click.stop="toggleVariantSelect(variant.id)"
            class="group relative border-2 rounded-2xl p-5 transition-all active:scale-95 shadow-sm"
            :class="
              selectedVariantIds.includes(variant.id)
                ? 'border-red-400 bg-red-50'
                : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
            "
          >
            <div class="font-black text-slate-800">{{ variant.name }}</div>
            <div class="text-[#658a22] font-black text-lg mt-1">
              {{ Number(variant.price).toLocaleString('vi-VN') }}đ
            </div>
            <div class="text-[10px] font-bold text-slate-400 mt-3 uppercase">
              Kho: {{ variant.stock }} | SKU: {{ variant.sku }}
            </div>
            <button
              @click.stop="applyPromotionToVariant(variant.id)"
              class="mt-2 text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1 rounded-xl font-medium"
            >
              Áp dụng KM
            </button>

            <div
              v-if="selectedVariantIds.includes(variant.id)"
              class="absolute top-2 right-2 text-red-500"
            >
              <span class="material-symbols-outlined text-sm">remove_circle</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showProductModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="showProductModal = false"
    >
      <div class="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl" @click.stop>
        <h2 class="text-2xl font-black mb-8 text-slate-900 flex items-center gap-2">
          <span class="w-2 h-8 bg-[#658a22] rounded-full"></span> Tạo sản phẩm mới
        </h2>
        <div class="space-y-6">
          <div>
            <label
              class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1"
              >Tên sản phẩm *</label
            >
            <input
              v-model="newProduct.name"
              class="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#658a22] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all text-slate-800 font-bold"
              placeholder="Nhập tên sản phẩm..."
            />
          </div>
          <div>
            <label
              class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1"
              >Slug *</label
            >
            <input
              v-model="newProduct.slug"
              class="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#658a22] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all text-slate-800 font-bold"
              placeholder="slug-san-pham"
            />
          </div>
          <div>
            <label
              class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1"
            >
              Danh mục *
            </label>
            <select
              v-model="newProduct.categoryId"
              class="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#658a22] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all text-slate-800 font-bold"
            >
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div>
            <label
              class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1"
              >Mô tả</label
            >
            <textarea
              v-model="newProduct.description"
              rows="3"
              class="w-full text-slate-800 bg-slate-50 border-2 border-slate-100 focus:border-[#658a22] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all resize-y"
            ></textarea>
          </div>
          <div>
            <label
              class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1"
              >Chất liệu</label
            >
            <input
              v-model="newProduct.material"
              class="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#658a22] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all text-slate-800 font-bold"
            />
          </div>
        </div>
        <div class="flex gap-4 mt-10">
          <button
            @click="showProductModal = false"
            class="flex-1 py-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-all"
          >
            Đóng
          </button>
          <button
            @click="createProduct"
            class="flex-1 py-4 bg-[#658a22] text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-all"
          >
            Tạo sản phẩm
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showImageModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="showImageModal = false"
    >
      <div class="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl" @click.stop>
        <h2 class="text-2xl font-black mb-8 text-slate-900">Thêm hình ảnh cho sản phẩm</h2>
        <div class="space-y-6">
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            class="block w-full text-sm text-slate-500"
          />
        </div>
        <div class="flex gap-4 mt-10">
          <button
            @click="showImageModal = false"
            class="flex-1 py-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-all"
          >
            Hủy
          </button>
          <button
            @click="uploadProductImage"
            class="flex-1 py-4 bg-[#658a22] text-white rounded-2xl font-black"
          >
            Upload hình ảnh
          </button>
        </div>
      </div>
    </div>
    <!-- Tạo biến thể -->
    <div
      v-if="showVariantModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="showVariantModal = false"
    >
      <div class="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl" @click.stop>
        <h2 class="text-2xl font-black mb-8 text-slate-900 flex items-center gap-2">
          <span class="w-2 h-8 bg-blue-500 rounded-full"></span> Thêm biến thể
        </h2>
        <div class="space-y-6">
          <div>
            <label
              class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1"
              >Tên biến thể *</label
            >
            <input
              v-model="newVariant.name"
              class="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all text-slate-800 font-bold"
              placeholder="Màu Đỏ - Size L"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1"
                >Giá bán (VNĐ) *</label
              >
              <input
                v-model="newVariant.price"
                type="number"
                class="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all text-slate-800 font-bold"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1"
                >Tồn kho</label
              >
              <input
                v-model="newVariant.stock"
                type="number"
                class="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all text-slate-800 font-bold"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1"
                >Màu sắc</label
              >
              <input
                v-model="newVariant.color"
                class="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all text-slate-800 font-bold"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1"
                >Kích thước</label
              >
              <input
                v-model="newVariant.size"
                class="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all text-slate-800 font-bold"
              />
            </div>
          </div>
        </div>
        <div class="flex gap-4 mt-10">
          <button
            @click="showVariantModal = false"
            class="flex-1 py-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-all"
          >
            Hủy
          </button>
          <button
            @click="createVariant"
            class="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            Lưu biến thể
          </button>
        </div>
      </div>
    </div>
    <!-- Tạo danh mục -->
    <!-- Modal Tạo Danh Mục Mới -->
    <div
      v-if="showCategoryModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="showCategoryModal = false"
    >
      <div class="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl" @click.stop>
        <h2 class="text-2xl font-black mb-8 text-slate-900 flex items-center gap-2">
          <span class="w-2 h-8 bg-[#658a22] rounded-full"></span> Tạo danh mục mới
        </h2>
        <div class="space-y-6">
          <div>
            <label
              class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1"
              >Tên danh mục *</label
            >
            <input
              v-model="newCategory.name"
              class="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#658a22] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all text-slate-800 font-bold"
              placeholder="Ví dụ: Ống hút tre"
            />
          </div>
          <div>
            <label
              class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1"
              >Mô tả (tùy chọn)</label
            >
            <textarea
              v-model="newCategory.description"
              rows="3"
              class="w-full text-slate-800 bg-slate-50 border-2 border-slate-100 focus:border-[#658a22] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all resize-y"
              placeholder="Mô tả ngắn về danh mục..."
            ></textarea>
          </div>
        </div>
        <div class="flex gap-4 mt-10">
          <button
            @click="showCategoryModal = false"
            class="flex-1 py-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-all"
          >
            Đóng
          </button>
          <button
            @click="createCategory"
            class="flex-1 py-4 bg-[#658a22] text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-all"
          >
            Tạo danh mục
          </button>
        </div>
      </div>
    </div>
    <!-- Modal Upload Ảnh Cho Danh Mục -->
    <!-- Modal Upload Ảnh cho Danh Mục -->
    <div
      v-if="showCategoryImageModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="showCategoryImageModal = false"
    >
      <div class="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl" @click.stop>
        <h2 class="text-2xl font-black mb-8 text-slate-900">Thêm hình ảnh cho danh mục</h2>
        <div class="space-y-6">
          <input
            id="categoryImageUpload"
            type="file"
            accept="image/*"
            class="block w-full text-sm text-slate-500"
          />
        </div>
        <div class="flex gap-4 mt-10">
          <button
            @click="showCategoryImageModal = false"
            class="flex-1 py-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-all"
          >
            Hủy
          </button>
          <button
            @click="uploadCategoryImage"
            class="flex-1 py-4 bg-[#658a22] text-white rounded-2xl font-black"
          >
            Upload hình ảnh
          </button>
        </div>
      </div>
    </div>
    <!-- Modal Quản lý Khuyến mãi -->
    <div
      v-if="showPromotionModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="showPromotionModal = false"
    >
      <div
        class="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl max-h-[90vh] overflow-auto"
        @click.stop
      >
        <h2 class="text-2xl font-black mb-8 text-slate-900 flex items-center gap-2">
          <span class="w-2 h-8 bg-[#658a22] rounded-full"></span> Quản lý Khuyến mãi
        </h2>

        <!-- Danh sách khuyến mãi -->
        <div class="mb-8">
          <h3 class="font-bold mb-4 text-slate-800">Danh sách khuyến mãi hiện có</h3>
          <div class="space-y-3">
            <div
              v-for="promo in promotions"
              :key="promo.id"
              class="flex justify-between items-center bg-slate-50 p-4 rounded-2xl mb-2 border-2 border-slate-100"
            >
              <div>
                <div class="font-bold text-slate-600 mb-2">{{ promo.name }}</div>
                <div class="text-sm text-slate-500">
                  {{ promo.code }} •
                  {{
                    promo.discountType === 'PERCENT'
                      ? promo.discountValue + '%'
                      : promo.discountValue + 'đ'
                  }}
                </div>
              </div>
              <button @click="editPromotion(promo)" class="text-blue-600 hover:text-blue-700">
                Sửa
              </button>
            </div>
          </div>
        </div>

        <!-- Form tạo/sửa khuyến mãi -->
        <div class="text-slate-800">
          <h3 class="font-bold mb-4">Tạo / Sửa khuyến mãi</h3>
          <div class="grid grid-cols-2 gap-4">
            <input
              v-model="newPromotion.name"
              placeholder="Tên khuyến mãi"
              class="border-2 border-slate-100 rounded-2xl px-5 py-4"
            />
            <input
              v-model="newPromotion.code"
              placeholder="Mã khuyến mãi"
              class="border-2 border-slate-100 rounded-2xl px-5 py-4"
            />
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <select
              v-model="newPromotion.discountType"
              class="border-2 border-slate-100 rounded-2xl px-5 py-4"
            >
              <option value="PERCENT">Giảm theo %</option>
              <option value="FIXED_AMOUNT">Giảm số tiền cố định</option>
            </select>
            <input
              v-model="newPromotion.discountValue"
              type="number"
              placeholder="Giá trị giảm"
              class="border-2 border-slate-100 rounded-2xl px-5 py-4"
            />
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <input
              v-model="newPromotion.startDate"
              type="date"
              class="border-2 border-slate-100 rounded-2xl px-5 py-4"
            />
            <input
              v-model="newPromotion.endDate"
              type="date"
              class="border-2 border-slate-100 rounded-2xl px-5 py-4"
            />
          </div>
          <button
            @click="savePromotion"
            class="mt-6 w-full py-4 bg-[#658a22] text-white rounded-2xl font-bold"
          >
            Lưu khuyến mãi
          </button>
        </div>
      </div>
    </div>
    <!-- Modal Chọn Khuyến mãi để áp dụng -->
    <div
      v-if="showApplyPromotionModal"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4"
      @click.self="showApplyPromotionModal = false"
    >
      <div class="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl" @click.stop>
        <h2 class="text-xl font-bold mb-6 text-slate-900">Chọn khuyến mãi để áp dụng</h2>

        <div class="max-h-[400px] overflow-y-auto space-y-2">
          <button
            v-for="promo in promotions"
            :key="promo.id"
            @click="confirmApplyPromotion(promo.id)"
            class="w-full text-left p-4 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all"
          >
            <div class="font-medium">{{ promo.name }}</div>
            <div class="text-sm text-slate-500">
              {{ promo.code }} —
              {{
                promo.discountType === 'PERCENT'
                  ? promo.discountValue + '%'
                  : promo.discountValue.toLocaleString('vi-VN') + 'đ'
              }}
            </div>
          </button>
        </div>

        <div class="flex justify-end mt-6">
          <button
            @click="showApplyPromotionModal = false"
            class="px-8 py-3 text-slate-600 border border-slate-300 rounded-2xl"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-none {
  user-select: none;
}
</style>
