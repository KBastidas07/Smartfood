function summarizeReviews(reviews) {
  const ratings = reviews.map(r => Number(r.rating)).filter(Number.isFinite);
  if (ratings.length === 0) return { count: 0, average: 0 };
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return { count: ratings.length, average: Math.round((sum / ratings.length) * 10) / 10 };
}

/*
 * RF05 (detalle del producto)
 * SRP: única responsabilidad: armar el detalle (precios por tienda, categoría, reseñas y su resumen).
 *      Se separó de ProductService para que los cambios del detalle no afecten al listado.
 * ISP: solo necesita productRepository, catalogRepository y reviewRepository.
 * DIP: los repositorios se inyectan, por lo que se puede probar sin el almacén real.
 * summarizeReviews devuelve {count: 0, average: 0} sin reseñas, para que el promedio siempre esté definido.
 */
// Detalle de un producto: precios por tienda, categoría y reseñas asociadas
class ProductDetailService {
  constructor({ productRepository, catalogRepository, reviewRepository }) {
    this.productRepository = productRepository;
    this.catalogRepository = catalogRepository;
    this.reviewRepository = reviewRepository;
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

    const category = this.catalogRepository.getCategories().find(c => c.id === product.category_id);
    const reviews = this.reviewRepository.findByProductId(productId);

    return {
      product: { ...product, category: category || null, prices: pricesWithStoreInfo },
      reviews,
      reviews_summary: summarizeReviews(reviews)
    };
  }
}

module.exports = ProductDetailService;
