import api from './api.ts'

export const Cart = {

  async create(payload: { productId: number; quantity: number }) {
    const response = await api.post('/cart', payload)
    return response.data
  },

  async update(id: number, payload: { productId: number; quantity: number }) {
    const response = await api.put(`/cart/${id}`, payload)
    return response.data
  },

  async getByUser(accountId: number) {
    const response = await api.get(`/cart/user/${accountId}`)
    return response.data
  },

  async getById(id: number) {
    const response = await api.get(`/cart/${id}`)
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/cart/${id}`)
    return response.data
  },

  async deleteList(ids: number[]) {
    const response = await api.delete('/cart', {
      data: {
        Ids: ids
      }
    })
    return response.data
  }
}

export default Cart;
