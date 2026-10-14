const { defaultProductFilters, applyFilters, buildEmptyMessage } = require('./productFilters');

/*
 * RF03 (consulta), RF04 (búsqueda) y RF09 (filtros)
 * SRP: solo consulta el catálogo. El detalle pasó a ProductDetailService y la administración
 *      a ProductAdminService, porque cambian por razones distintas.
 * OCP: aplica una lista de filtros inyectable; un criterio nuevo se añade a la lista sin modificar list().
 *      list() pasa la consulta completa a los filtros para que los nuevos reciban sus parámetros.
 * LSP/DIP: funciona con cualquier repositorio que ofrezca findAll/getStores/getCategories.
 * ISP: solo depende de productRepository y catalogRepository (no de reseñas ni favoritos).
 */
// Consulta pública del catálogo: listado filtrado y ofertas
class ProductService {
  constructor({ productRepository, catalogRepository, filters = defaultProductFilters }) {
    this.filters = filters;
    this.productRepository = productRepository;
    this.catalogRepository = catalogRepository;
  }

  list(query = {}) {
    const list = applyFilters(this.filters, [...this.productRepository.findAll()], query, this.catalogRepository);

    const result = {
      total: list.length,
      products: list,
      stores: this.catalogRepository.getStores(),
      categories: this.catalogRepository.getCategories()
    };
    if (list.length === 0) result.message = buildEmptyMessage(query, this.filters);
    return result;
  }

  listOffers() {
    const list = this.productRepository.findAll().filter(p => p.prices.some(pr => pr.is_offer));
    return { total: list.length, offers: list };
  }
}

module.exports = ProductService;
