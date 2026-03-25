<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductService from '@/service/product.ts'
import ProductVariantService from '@/service/productVariant.ts'
import { notify } from '@/utils/notifier.ts'

const products = ref<any[]>([])
const variants = ref<any[]>([])
const loading = ref(false)

const selectedProductIds = ref<number[]>([])
const selectedVariantIds = ref<number[]>([])

const showProductModal = ref(false)
const showImageModal = ref(false)
const showVariantModal = ref(false)
const currentProductId = ref<number | null>(null)
const currentProductIdForImage = ref<number | null>(null)

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

// Load dữ liệu
const loadData = async () => {
  loading.value = true
  try {
    const [prodRes, varRes] = await Promise.all([
      ProductService.getAllProducts(),
      ProductVariantService.getAll(),
    ])
    products.value = prodRes
    variants.value = varRes
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

// Tạo sản phẩm (JSON)
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

// Upload ảnh riêng
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
              >Danh mục *</label
            >
            <select
              v-model="newProduct.categoryId"
              class="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#658a22] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all text-slate-800 font-bold"
            >
              <option value="1">Danh mục 1</option>
              <option value="2">Danh mục 2</option>
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
              class="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#658a22] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all resize-y"
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
  </div>
</template>

<style scoped>
.select-none {
  user-select: none;
}
</style>
