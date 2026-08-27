import api from './api'

const reviewService = {
  createReview: (data) => api.post('/reviews', data),
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
}

export default reviewService