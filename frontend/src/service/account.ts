import api from './api.ts';

export const Account = {
  async getAccount(id: number) {
    const response = await api.get(`/account/${id}`);
    return response.data;
  },
}
