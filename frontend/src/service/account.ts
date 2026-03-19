import api from './api.ts';

export const Account = {
  async getAccount(id: number) {
    const response = await api.get(`/account/${id}`);
    return response.data;
  },

  changePassword: async (id: number, payload: { old_password: string, new_password: string, confirm_password: string }) => {
    const response = await api.put(`/account/${id}/password`, payload);
    return response.data;
  }
}

export default Account;
