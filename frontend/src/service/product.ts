import api from './api.ts'

export const ProductService = {
  async getAllProducts() {
    const res = await api.get('/product')
    return res.data
  },

  async createProduct(data: any) {
    const res = await api.post('/product', data)
    return res.data
  },

  async updateProduct(id: number, data: any) {
    const res = await api.put(`/product/${id}`, data)
    return res.data
  },

  async deleteProduct(id: number) {
    const res = await api.delete(`/product/${id}`)
    return res.data
  },
}

export default ProductService
