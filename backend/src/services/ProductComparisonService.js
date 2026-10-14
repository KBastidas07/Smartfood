const { searchFilter, categoryFilter, applyFilters, buildEmptyMessage } = require('./productFilters');

/*
 * RF07 (comparación de productos)
 * SRP: solo compara precios entre tiendas (mínimo, máximo, ahorro potencial).
 * OCP: acepta su propia lista de filtros (búsqueda y categoría por defecto); /compare no admite `store`.
 * ISP: depende solo de productRepository y catalogRepository, no de reseñas ni favoritos.
 * DIP: reutiliza applyFilters y buildEmptyMessage pasándoles su lista, sin copiar la lógica de búsqueda.
 */
// RF07: depende solo de lo que necesita para comparar (no de reseñas ni favoritos)
class ProductComparisonService {
  constructor({ productRepository, catalogRepository, filters = [searchFilter, categoryFilter] }) {
    this.productRepository = productRepository;
    this.catalogRepository = catalogRepository;
    this.filters = filters;
  }

  compare(query = {}) {
    const stores = this.catalogRepository.getStores();
    const matches = applyFilters(this.filters, [...this.productRepository.findAll()], query, this.catalogRepository);

    const comparisons = matches
      .filter(p => p.prices.length > 0)
      .map(p => this.buildComparison(p, stores));

    const result = { total: comparisons.length, comparisons };
    if (comparisons.length === 0) result.message = buildEmptyMessage(query, this.filters);
    return result;
  }

  buildComparison(product, stores) {
    const prices = product.prices
      .map(pr => {
        const store = stores.find(s => s.id === pr.store_id);
        return {
          ...pr,
          store_name: store ? store.name : 'Tienda',
          store_logo: store ? store.logo : '🏬',
          store_code: store ? store.code : 'store'
        };
      })
      .sort((a, b) => a.price - b.price);

    const cheapest = prices[0];
    const mostExpensive = prices[prices.length - 1];

    return {
      product_id: product.id,
      name: product.name,
      unit: product.unit,
      image_url: product.image_url,
      category_id: product.category_id,
      stores_count: prices.length,
      cheapest_store: { store_id: cheapest.store_id, store_name: cheapest.store_name, price: cheapest.price },
      min_price: cheapest.price,
      max_price: mostExpensive.price,
      potential_savings: mostExpensive.price - cheapest.price,
      prices
    };
  }
}

module.exports = ProductComparisonService;
