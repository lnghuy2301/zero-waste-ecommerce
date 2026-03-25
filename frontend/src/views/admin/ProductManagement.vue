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

// Modal
const showProductModal = ref(false)
const showVariantModal = ref(false)
const currentProductId = ref<number | null>(null)

const newProduct = ref({
  name: '',
  slug: '',
  categoryId: 1,
  description: '',
  material: '',
  mainImage: null as File | null,
})

const newVariant = ref({
  name: '',
  price: 0,
  stock: 100,
  sku: '',
  color: '',
  size: '',
})

// Logic chọn sản phẩm (Toggle)
const toggleProductSelect = (id: number) => {
  const index = selectedProductIds.value.indexOf(id)
  if (index > -1) {
    selectedProductIds.value.splice(index, 1)
  } else {
    selectedProductIds.value.push(id)
  }
}

// Logic chọn biến thể (Toggle)
const toggleVariantSelect = (id: number) => {
  const index = selectedVariantIds.value.indexOf(id)
  if (index > -1) {
    selectedVariantIds.value.splice(index, 1)
  } else {
    selectedVariantIds.value.push(id)
  }
}

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

// Tạo sản phẩm
const createProduct = async () => {
  if (!newProduct.value.name) return notify.error('Vui lòng nhập tên sản phẩm')
  const formData = new FormData()
  formData.append('name', newProduct.value.name)
  formData.append(
    'slug',
    newProduct.value.slug || newProduct.value.name.toLowerCase().replace(/\s+/g, '-'),
  )
  formData.append('categoryId', String(newProduct.value.categoryId))
  if (newProduct.value.description) formData.append('description', newProduct.value.description)
  if (newProduct.value.material) formData.append('material', newProduct.value.material)
  if (newProduct.value.mainImage) formData.append('image', newProduct.value.mainImage)

  try {
    await ProductService.createProduct(formData)
    notify.success('Tạo sản phẩm thành công!')
    showProductModal.value = false
    resetProductForm()
    loadData()
  } catch (e) {
    notify.error('Tạo thất bại')
  }
}

const createVariant = async () => {
  if (!currentProductId.value || !newVariant.value.name || newVariant.value.price <= 0) {
    return notify.error('Vui lòng nhập đầy đủ thông tin')
  }
  try {
    await ProductVariantService.createVariant({
      productId: currentProductId.value,
      ...newVariant.value,
      sku: newVariant.value.sku || `SKU-${Date.now()}`,
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
  if (!confirm(`Xóa ${selectedProductIds.value.length} sản phẩm đã chọn?`)) return
  try {
    await ProductService.deleteListProducts({ Ids: selectedProductIds.value })
    notify.success('Xóa sản phẩm thành công')
    selectedProductIds.value = []
    loadData()
  } catch (e) {
    notify.error('Xóa thất bại')
  }
}

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
  newProduct.value = {
    name: '',
    slug: '',
    categoryId: 1,
    description: '',
    material: '',
    mainImage: null,
  }
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
  <div class="max-w-7xl mx-auto p-6 bg-[#f8fafc] min-h-screen">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Quản lý Kho hàng</h1>
        <p class="text-slate-500 font-medium mt-1">
          Chọn vào thẻ sản phẩm để quản lý danh sách xóa.
        </p>
      </div>
      <div class="flex gap-3">
        <button
          v-if="selectedProductIds.length > 0"
          @click="deleteSelectedProducts"
          class="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-red-200 transition-all hover:bg-red-700"
        >
          Xóa {{ selectedProductIds.length }} sản phẩm
        </button>
        <button
          v-if="selectedVariantIds.length > 0"
          @click="deleteSelectedVariants"
          class="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-200 transition-all hover:bg-orange-700"
        >
          Xóa {{ selectedVariantIds.length }} biến thể
        </button>
        <button
          @click="showProductModal = true"
          class="bg-[#658a22] hover:bg-[#58791d] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#658a22]/20 transition-all"
        >
          <span class="material-symbols-outlined">add_box</span> Tạo sản phẩm
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-20 uppercase tracking-widest text-slate-400 font-black"
    >
      <div
        class="animate-spin rounded-full h-10 w-10 border-4 border-[#658a22] border-t-transparent mb-4"
      ></div>
      Đang đồng bộ dữ liệu...
    </div>

    <div v-else class="space-y-8">
      <div
        v-for="product in products"
        :key="product.id"
        @click="toggleProductSelect(product.id)"
        class="group relative bg-white rounded-[32px] p-8 border-2 transition-all cursor-pointer select-none active:scale-[0.99]"
        :class="
          selectedProductIds.includes(product.id)
            ? 'border-[#658a22] bg-[#fdfef9] shadow-xl shadow-[#658a22]/10'
            : 'border-slate-100 shadow-sm hover:border-slate-300'
        "
      >
        <div
          v-if="selectedProductIds.includes(product.id)"
          class="absolute -top-3 -right-3 bg-[#658a22] text-white rounded-full p-1 shadow-lg"
        >
          <span class="material-symbols-outlined text-xl">check_circle</span>
        </div>

        <div class="flex items-center gap-8 mb-8">
          <div class="relative">
            <img
              v-if="product.mainImage"
              :src="`http://localhost:3000${product.mainImage}`"
              class="w-24 h-24 object-cover rounded-[24px] border-2 border-slate-50 shadow-inner"
            />
            <div
              v-else
              class="w-24 h-24 bg-slate-50 rounded-[24px] flex items-center justify-center border-2 border-dashed border-slate-200 text-slate-300"
            >
              <span class="material-symbols-outlined text-4xl">inventory</span>
            </div>
          </div>

          <div class="flex-1">
            <h3
              class="font-black text-2xl"
              :class="selectedProductIds.includes(product.id) ? 'text-[#658a22]' : 'text-slate-800'"
            >
              {{ product.name }}
            </h3>
            <div class="flex items-center gap-3 mt-2">
              <span
                class="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-1 rounded"
                >Slug</span
              >
              <span class="text-sm text-slate-600 font-bold italic">{{ product.slug }}</span>
            </div>
          </div>

          <button
            @click.stop="openVariantModal(product.id)"
            class="px-6 py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-lg text-emerald-400">add</span> Biến thể
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="variant in variants.filter((v) => v.productId === product.id)"
            :key="variant.id"
            @click.stop="toggleVariantSelect(variant.id)"
            class="relative border-2 rounded-[20px] p-5 transition-all cursor-pointer active:scale-95"
            :class="[
              selectedVariantIds.includes(variant.id)
                ? 'border-red-500 bg-red-50 shadow-inner'
                : 'border-slate-100 bg-white hover:border-slate-300',
            ]"
          >
            <div class="font-bold text-slate-800">{{ variant.name }}</div>
            <div class="text-emerald-700 font-black text-lg mt-1">
              {{ Number(variant.price).toLocaleString('vi-VN') }}đ
            </div>

            <div class="mt-4 flex items-center justify-between">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Kho: {{ variant.stock }}
              </div>
              <div class="text-[10px] font-mono font-bold text-slate-500">{{ variant.sku }}</div>
            </div>

            <div
              v-if="selectedVariantIds.includes(variant.id)"
              class="absolute top-2 right-2 text-red-500 animate-pulse"
            >
              <span class="material-symbols-outlined text-sm">remove_circle</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showProductModal"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6"
    >
      <div class="bg-white rounded-[40px] w-full max-w-xl p-10 shadow-2xl border border-slate-100">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Tạo sản phẩm</h2>
          <button
            @click="showProductModal = false"
            class="text-slate-400 hover:text-red-500 transition-colors"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="space-y-6">
          <div class="group">
            <label
              class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-[#658a22] transition-colors"
              >Tên sản phẩm</label
            >
            <input
              v-model="newProduct.name"
              class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-[#658a22] focus:bg-white transition-all text-slate-800 font-bold"
              placeholder="VD: Ống hút tre cao cấp..."
            />
          </div>
        </div>
        <div class="flex gap-4 mt-10">
          <button
            @click="showProductModal = false"
            class="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
          >
            Đóng
          </button>
          <button
            @click="createProduct"
            class="flex-1 py-4 bg-[#658a22] text-white font-bold rounded-2xl shadow-lg shadow-[#658a22]/30 hover:bg-[#58791d] transition-all"
          >
            Xác nhận tạo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ngăn việc bôi đen chữ khi click liên tục vào button sản phẩm */
.select-none {
  user-select: none;
}
</style>
