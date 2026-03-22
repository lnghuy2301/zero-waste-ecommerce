import api from './api.ts'

export const BundleItem = {
  async getAll() {
    const res = await api.get('/bundle-item')
    return res.data
  },

  // Nếu sau này backend có query theo bundleProductId thì thêm
  // async getByBundleProductId(id: number) {
  //   const res = await api.get(`/bundle-item?bundleProductId=${id}`)
  //   return res.data
  // }
}

export default BundleItem

// import api from './api.ts'

// export const BundleService = {
//   // Lấy danh sách quà tặng dựa trên ID sản phẩm chính
//   async getGiftsByProductId(productId: number) {
//     try {
//       // Endpoint này cần khớp với Backend của bạn (ví dụ: /product-gifts/:id)
//       const response = await api.get(`/bundle-item/${productId}`)
//       return response.data
//     } catch (error) {
//       console.error('Lỗi khi lấy quà tặng:', error)
//       return [] // Trả về mảng rỗng nếu lỗi để giao diện không bị crash
//     }
//   },
// }

// export default BundleService
