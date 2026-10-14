import { request } from './httpClient';

export const reviewApi = {
  getReviews: (productId) => request(`/reviews/product/${productId}`),
  addReview: (productId, rating, comment) => request('/reviews', { method: 'POST', body: JSON.stringify({ product_id: productId, rating, comment }) })
};
