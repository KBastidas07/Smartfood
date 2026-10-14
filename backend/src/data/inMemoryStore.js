const { initialStores, initialCategories, initialProducts, initialUsers, initialReviews, initialFavorites } = require('./initialData');

// Estado en memoria (persiste mientras el servidor esté activo)
function createInMemoryStore() {
  return {
    stores: [...initialStores],
    categories: [...initialCategories],
    products: [...initialProducts],
    users: [...initialUsers],
    reviews: [...initialReviews],
    favorites: [...initialFavorites]
  };
}

module.exports = { createInMemoryStore };
