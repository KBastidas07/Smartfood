class CatalogRepository {
  constructor(store) {
    this.store = store;
  }

  getStores() {
    return this.store.stores;
  }

  getCategories() {
    return this.store.categories;
  }
}

module.exports = CatalogRepository;
