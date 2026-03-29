import api from './api.ts'

export const Promotion = {
  async getAllPromotions() {
    const res = await api.get('/promotion')
    return res.data
  },

  async createPromotion(data: any) {
    // Chuyển đổi đúng kiểu backend yêu cầu
    const payload = {
      ...data,
      discountValue: String(data.discountValue), // ← chuyển thành string
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
    }

    const res = await api.post('/promotion', payload)
    return res.data
  },

  async updatePromotion(id: number, data: any) {
    const payload = {
      ...data,
      discountValue: String(data.discountValue),
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
    }

    const res = await api.put(`/promotion/${id}`, payload)
    return res.data
  },

  async deletePromotion(id: number) {
    const res = await api.delete(`/promotion/${id}`)
    return res.data
  },

  async deleteListPromotions(ids: number[]) {
    const res = await api.delete('/promotion', { data: { Ids: ids } })
    return res.data
  },
}

export default Promotion
