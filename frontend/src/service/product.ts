import api from './api.ts'

export const ProductService = {
  async getAllProducts() {
    const res = await api.get('/product')
    return res.data
  },

  async createProduct(data: any) {
    // gửi JSON
    const res = await api.post('/product', data)
    return res.data
  },

  async uploadMainImage(id: number, file: File) {
    const formData = new FormData()
    formData.append('image', file)
    const res = await api.post(`/product/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async deleteListProducts(data: { Ids: number[] }) {
    const res = await api.delete('/product', { data })
    return res.data
  },
}

export default ProductService
