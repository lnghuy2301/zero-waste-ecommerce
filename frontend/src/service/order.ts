import api from './api.ts';

export const Order = {
  // 1. Tạo đơn hàng mới
  async createOrder(orderData: any) {
    // orderData tương ứng với OrderRequestDto bên backend
    const response = await api.post('order', orderData);
    return response.data;
  },

  // 2. Cập nhật trạng thái đơn hàng (Dành cho Admin)
  async updateOrderStatus(id: number, status: string) {
    const response = await api.put(`order/${id}/status`, { status });
    return response.data;
  },

  // 3. Lấy danh sách đơn hàng của một người dùng (Lịch sử mua hàng)
  async getOrdersByUser(accountId: number) {
    const response = await api.get(`order/user/${accountId}`);
    return response.data;
  },

  // 4. Lấy chi tiết một đơn hàng (Theo dõi đơn hàng)
  async getOrderById(id: number) {
    const response = await api.get(`order/${id}`);
    return response.data;
  },

  // 5. Hủy một đơn hàng
  async cancelOrder(id: number) {
    const response = await api.delete(`order/${id}`);
    return response.data;
  },

  // 6. Xóa nhiều đơn hàng cùng lúc (Dành cho Admin)
  async deleteListOrders(orderIds: number[]) {
    const response = await api.delete('order', {
      data: { ids: orderIds }
    });
    return response.data;
  }
};

export default Order;
