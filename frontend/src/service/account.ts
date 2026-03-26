import api from './api.ts'

export const Account = {
  // Hàm tạo tài khoản mới (thường dùng cho Register)
  async createAccount(payload: any) {
    const response = await api.post('/account/register', payload)
    return response.data
  },

  async getAccount(id: number) {
    const response = await api.get(`/account/${id}`)
    return response.data
  },

  // Giữ nguyên tên hàm getAllAccount như bạn muốn
  async getAllAccount() {
    const response = await api.get(`/account/`)
    return response.data
  },

  async changePassword(
    id: number,
    payload: { old_password: string; new_password: string; confirm_password: string },
  ) {
    const response = await api.put(`/account/${id}/password`, payload)
    return response.data
  },

  // Truyền Object { isActive } cho đúng DTO
  async updateActive(id: number, isActive: boolean) {
    const response = await api.put(`/account/${id}/active`, { isActive })
    return response.data
  },

  // Truyền Object { role } cho đúng DTO
  async updateRole(id: number, role: string) {
    const response = await api.put(`/account/${id}/role`, { role })
    return response.data
  },

  async deleteAccount(id: number) {
    const response = await api.delete(`/account/${id}`)
    return response.data
  },

  // Gửi đúng định dạng { Ids: [1, 2, 3] }
  async deleteAccountList(ids: number[]) {
    const response = await api.post(`/account/list`, { Ids: ids })
    return response.data
  },

  async getStats() {
    const response = await api.get('/account/stats')
    return response.data
  },
}

export default Account
