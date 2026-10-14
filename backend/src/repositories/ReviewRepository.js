class ReviewRepository {
  constructor(store) {
    this.store = store;
  }

  findByProductId(productId) {
    return this.store.reviews.filter(r => r.product_id === productId);
  }

  add(reviewData) {
    const reviews = this.store.reviews;
    const newReview = {
      id: reviews.length ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
      user_id: reviewData.user_id,
      user_name: reviewData.user_name || 'Usuario',
      product_id: parseInt(reviewData.product_id),
      rating: parseInt(reviewData.rating),
      comment: reviewData.comment,
      created_at: new Date().toISOString()
    };
    reviews.unshift(newReview);
    return newReview;
  }

  removeByProductId(productId) {
    this.store.reviews = this.store.reviews.filter(r => r.product_id !== productId);
  }
}

module.exports = ReviewRepository;
