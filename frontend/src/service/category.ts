import api from './api.ts'

// Sửa tên export thành Category (đúng chính tả)
export const Category = {
  async getAllCategories() {
    const response = await api.get('/category')
    return response.data
  },

  async createCategory(data: any) {
    // sửa tên hàm cho nhất quán
    const response = await api.post('/category', data)
    return response.data
  },

  async updateCategory(id: number, data: any) {
    const response = await api.put(`/category/${id}/category`, data)
    return response.data
  },

  async deleteCategory(id: number) {
    const response = await api.delete(`/category/${id}/category`)
    return response.data
  },

  async deleteListCategory(listCategory: { Ids: number[] }) {
    const response = await api.delete('/category', { data: listCategory })
    return response.data
  },
}
