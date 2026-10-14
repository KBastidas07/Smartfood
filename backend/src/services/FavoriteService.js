class FavoriteService {
  constructor({ favoriteRepository, productRepository }) {
    this.favoriteRepository = favoriteRepository;
    this.productRepository = productRepository;
  }

  listProductsForUser(userId) {
    const favProductIds = this.favoriteRepository.findByUserId(userId).map(f => f.product_id);
    return this.productRepository.findAll().filter(p => favProductIds.includes(p.id));
  }

  toggle(userId, productId) {
    return this.favoriteRepository.toggle(userId, productId);
  }
}

module.exports = FavoriteService;
