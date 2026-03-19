import api from './api.ts';

export const Account = {
  async getAccount(id: number) {
    const response = await api.get(`/account/${id}`);
    return response.data;
  },

  async getAllAccount(id: number) {
    const response = await api.get(`/account/`);
    return response.data;
  },

  async changePassword (id: number, payload: { old_password: string, new_password: string, confirm_password: string }) {
    const response = await api.put(`/account/${id}/password`, payload);
    return response.data;
  },

  async updateActive(id: number, isActive: boolean) {
    const response = await api.put(`/account/${id}/active`, isActive);
    return response.data;
    },

  async updateRole(id: number, role: string) {
    const response = await api.put(`/account/${id}/role`, role)
    return response.data;
  },

  async deleteAccount(id: number) {
    const response = await api.delete(`/account/${id}`);
    return response.data;
  },

  async deleteAccountList(ids: number[]) {
    const response = await api.post(`/account/list`, ids);
    return response.data;
  }
}

export default Account;
