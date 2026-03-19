import api from './api.ts'

export const ProductService = {
  getAll: () => api.get('/product'),
  getById: (id: number) => api.get(`/product/${id}`),
}
