import api from './api.ts';

export const profile = {
  async updateProfile(accountId: number, id: number, data: {
    fullName: string;
    phone: string;
    address: string;
    gender: string;
    dob: string;
  }) {
    const response = await api.put(`/customer_profile/${id}/profile/${accountId}`, data);
    return response;
  },

  async getCustomerProfile(profileId: number, accountId: number) {
    const response = await api.get(`/customer_profile/${accountId}/profile`);
    return response.data;
  },

  async getAllCustomerProfiles() {
    const response = await api.get(`/customer_profiles`);
    return response;
  }
}
