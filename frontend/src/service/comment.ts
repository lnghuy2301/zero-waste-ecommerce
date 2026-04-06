import api from './api.ts';

export const Comment = {
  async getComments(filterParams?: any) {
    const response = await api.get('comments', { params: filterParams })
    return response.data
  },

  async createComment(productId: number, commentData: any) {
    // commentData tương ứng với CreateCommentDto bên backend (gồm content, rating)
    const response = await api.post(`comments/product/${productId}`, commentData)
    return response.data
  },

  async hideComment(commentId: number) {
    const response = await api.patch(`comments/${commentId}/visibility`, {
      isHidden: true,
    })
    return response.data
  },
}

export default Comment;
