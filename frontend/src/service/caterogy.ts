import api from "./api";

export const Caterogy = {
  async getAllCaterogy() {
    const response = await api.get(`category`);
    return response.data;
  },

  async createCaterogy(data: any) {
    const response = await api.post(`category`, data);
    return response.data;
  },

  async updateCaterogy(id: number, data: any) {
    const response = await api.put(`category/${id}/category`, data);
    return response.data;
  },

  async deleteCaterogy(id: number) {
    const response = await api.delete(`category/${id}/category`);
    return response.data;
  },

  async deleteListCaterogy(listCategory: { Ids: number[] }) {
    const response = await api.delete(`category`, { data: listCategory });
    return response.data;
  }
};
