import api from './api.ts'

export const ProductVariantService = {
  async getAll() {
    const response = await api.get('/product-variant')
    return response.data
  },

  // Nếu sau này backend hỗ trợ query theo productId thì thêm hàm này
  // async getByProductId(productId: number) {
  //   const response = await api.get(`/product-variant?productId=${productId}`)
  //   return response.data
  // }
}

export default ProductVariantService
