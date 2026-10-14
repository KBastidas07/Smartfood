class FavoriteRepository {
  constructor(store) {
    this.store = store;
  }

  findByUserId(userId) {
    return this.store.favorites.filter(f => f.user_id === userId);
  }

  toggle(userId, productId) {
    const favorites = this.store.favorites;
    const numericProdId = parseInt(productId);
    const numericUserId = parseInt(userId);
    const existingIdx = favorites.findIndex(f => f.user_id === numericUserId && f.product_id === numericProdId);
    if (existingIdx !== -1) {
      favorites.splice(existingIdx, 1);
      return { isFavorite: false };
    }
    const newFav = { id: favorites.length ? Math.max(...favorites.map(f => f.id)) + 1 : 1, user_id: numericUserId, product_id: numericProdId };
    favorites.push(newFav);
    return { isFavorite: true };
  }

  removeByProductId(productId) {
    this.store.favorites = this.store.favorites.filter(f => f.product_id !== productId);
  }
}

module.exports = FavoriteRepository;
