class ProductRepository {
  constructor(store) {
    this.store = store;
  }

  findAll() {
    return this.store.products;
  }

  findById(id) {
    return this.store.products.find(p => p.id === id);
  }

  prepend(product) {
    this.store.products.unshift(product);
    return product;
  }

  create(productData) {
    const products = this.store.products;
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    return this.prepend({ id: newId, ...productData });
  }

  update(id, updateData) {
    const products = this.store.products;
    const idx = products.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...updateData };
    return products[idx];
  }

  remove(id) {
    const numericId = parseInt(id);
    const initialLen = this.store.products.length;
    this.store.products = this.store.products.filter(p => p.id !== numericId);
    return this.store.products.length < initialLen;
  }
}

module.exports = ProductRepository;
