class ReviewService {
  constructor({ reviewRepository }) {
    this.reviewRepository = reviewRepository;
  }

  listByProduct(productId) {
    return this.reviewRepository.findByProductId(productId);
  }

  add(reviewData) {
    return this.reviewRepository.add(reviewData);
  }
}

module.exports = ReviewService;
