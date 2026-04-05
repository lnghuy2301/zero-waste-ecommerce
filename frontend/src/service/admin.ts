import api from './api.ts'

export const AdminService = {
  async getStats() {
    try {
      const [usersRes, orderCountRes, productCountRes, revenueRes, inventoryRes, soldRes] =
        await Promise.all([
          api.get('/account/stats/count'),
          api.get('/order/stats/count'),
          api.get('/product/stats/count'),
          api.get('/order/stats/revenue-by-month'),
          api.get('/product/stats/inventory'), // tổng tồn kho
          api.get('/product/stats/sold'), // tổng đã bán
        ])

      const totalRevenue = revenueRes.data.reduce((sum: number, val: number) => sum + val, 0)

      return {
        totalUsers: usersRes.data || 0,
        totalOrders: orderCountRes.data || 0,
        totalProducts: productCountRes.data || 0,
        totalRevenue,
        monthlyRevenue: revenueRes.data || Array(12).fill(0),
        totalInventory: inventoryRes.data || 0, // ← thêm
        totalSold: soldRes.data || 0, // ← thêm
      }
    } catch (error: any) {
      console.error('Admin stats error:', error.response?.data || error)
      return {
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        monthlyRevenue: Array(12).fill(0),
        totalInventory: 0,
        totalSold: 0,
      }
    }
  },
}

export default AdminService
