const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

class ProductService {
  constructor({ productRepository, catalogRepository, reviewRepository, favoriteRepository }) {
    this.productRepository = productRepository;
    this.catalogRepository = catalogRepository;
    this.reviewRepository = reviewRepository;
    this.favoriteRepository = favoriteRepository;
  }

  list({ search, category, store, is_offer } = {}) {
    let list = [...this.productRepository.findAll()];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (category) {
      const categoryObj = this.catalogRepository.getCategories().find(c => c.slug === category || c.id === parseInt(category));
      if (categoryObj) {
        list = list.filter(p => p.category_id === categoryObj.id);
      }
    }

    if (store) {
      const storeObj = this.catalogRepository.getStores().find(s => s.code === store || s.id === parseInt(store));
      if (storeObj) {
        list = list.filter(p => p.prices.some(pr => pr.store_id === storeObj.id));
      }
    }

    if (is_offer === 'true') {
      list = list.filter(p => p.prices.some(pr => pr.is_offer));
    }

    return {
      total: list.length,
      products: list,
      stores: this.catalogRepository.getStores(),
      categories: this.catalogRepository.getCategories()
    };
  }

  listOffers() {
    const list = this.productRepository.findAll().filter(p => p.prices.some(pr => pr.is_offer));
    return { total: list.length, offers: list };
  }

  getDetail(productId) {
    const product = this.productRepository.findById(productId);
    if (!product) return null;

    // Attach store details to prices for easy comparison
    const stores = this.catalogRepository.getStores();
    const pricesWithStoreInfo = product.prices.map(pr => {
      const storeObj = stores.find(s => s.id === pr.store_id);
      return {
        ...pr,
        store_name: storeObj ? storeObj.name : 'Tienda',
        store_logo: storeObj ? storeObj.logo : '🏬',
        store_code: storeObj ? storeObj.code : 'store'
      };
    }).sort((a, b) => a.price - b.price); // Lowest price first for comparison!

    return {
      product: { ...product, prices: pricesWithStoreInfo },
      reviews: this.reviewRepository.findByProductId(productId)
    };
  }

  create(productData) {
    return this.productRepository.create({
      name: productData.name,
      description: productData.description || '',
      category_id: parseInt(productData.category_id) || 1,
      unit: productData.unit || '1 Unidad',
      image_url: productData.image_url || DEFAULT_IMAGE,
      prices: productData.prices || []
    });
  }

  update(id, updateData) {
    return this.productRepository.update(id, updateData);
  }

  delete(id) {
    const numericId = parseInt(id);
    const deleted = this.productRepository.remove(numericId);
    this.reviewRepository.removeByProductId(numericId);
    this.favoriteRepository.removeByProductId(numericId);
    return deleted;
  }
}

module.exports = ProductService;
