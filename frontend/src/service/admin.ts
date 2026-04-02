import api from './api.ts'

export const AdminService = {
  async getStats() {
    try {
      const [usersRes, orderCountRes, productCountRes, revenueRes] = await Promise.all([
        api.get('/account/stats/count'),
        api.get('/order/stats/count'),
        api.get('/product/stats/count'),
        api.get('/order/stats/revenue-by-month'),
      ])

      // Tính tổng doanh thu từ mảng 12 tháng
      const monthlyRevenue = revenueRes.data || Array(12).fill(0)
      const totalRevenue = monthlyRevenue.reduce((sum: number, val: number) => sum + val, 0)

      return {
        totalUsers: usersRes.data || 0,
        totalOrders: orderCountRes.data || 0,
        totalProducts: productCountRes.data || 0,
        totalRevenue: totalRevenue, // ← sửa chỗ này
        monthlyRevenue: monthlyRevenue, // giữ nguyên mảng 12 tháng
      }
    } catch (error: any) {
      console.error('Admin stats error:', error.response?.data || error)
      return {
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        monthlyRevenue: Array(12).fill(0),
      }
    }
  },
}

export default AdminService

// import api from './api.ts'

// export const AdminService = {
//   async getStats() {
//     try {
//       const [usersRes, orderCountRes, productCountRes, revenueRes] = await Promise.all([
//         api.get('/account/stats/count'),
//         api.get('/order/stats/count'),
//         api.get('/product/stats/count'),
//         api.get('/order/stats/revenue-by-month'),
//       ])

//       const totalRevenue = revenueRes.data.reduce((sum: number, val: number) => sum + val, 0)

//       return {
//         totalUsers: usersRes.data || 0,
//         totalOrders: orderCountRes.data || 0,
//         totalProducts: productCountRes.data || 0,
//         totalRevenue,
//         monthlyRevenue: revenueRes.data || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // mảng 12 tháng
//       }
//     } catch (error: any) {
//       console.error('Admin stats error:', error.response?.data || error)
//       return {
//         totalUsers: 0,
//         totalOrders: 0,
//         totalProducts: 0,
//         totalRevenue: 0,
//         monthlyRevenue: Array(12).fill(0),
//       }
//     }
//   },
// }

// export default AdminService
