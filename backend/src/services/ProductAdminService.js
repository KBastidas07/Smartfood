const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

/*
 * Separación aplicada al dividir ProductService (RF03)
 * SRP / ISP: las operaciones de escritura (crear, editar, borrar) salen del servicio de consulta, así
 *   el controlador público de productos ya no depende de métodos de administración que no usa.
 * DIP: repositorios inyectados. Su funcionalidad completa (administración) queda fuera del alcance actual.
 */
// Administración del catálogo: alta, edición y baja (la baja limpia reseñas y favoritos asociados)
class ProductAdminService {
  constructor({ productRepository, reviewRepository, favoriteRepository }) {
    this.productRepository = productRepository;
    this.reviewRepository = reviewRepository;
    this.favoriteRepository = favoriteRepository;
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

module.exports = ProductAdminService;
