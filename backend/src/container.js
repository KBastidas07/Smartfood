const { createInMemoryStore } = require('./data/inMemoryStore');
const { loadScrapedProducts } = require('./data/scrapedProductsLoader');
const { connectPostgres } = require('./data/postgres');
const env = require('./config/env');

const ProductRepository = require('./repositories/ProductRepository');
const CatalogRepository = require('./repositories/CatalogRepository');
const UserRepository = require('./repositories/UserRepository');
const ReviewRepository = require('./repositories/ReviewRepository');
const FavoriteRepository = require('./repositories/FavoriteRepository');

const ProductService = require('./services/ProductService');
const ProductDetailService = require('./services/ProductDetailService');
const ProductAdminService = require('./services/ProductAdminService');
const ProductComparisonService = require('./services/ProductComparisonService');
const TokenService = require('./services/TokenService');
const { BcryptPasswordHasher, PlainPasswordVerifier } = require('./services/PasswordHasher');
const ReviewService = require('./services/ReviewService');
const FavoriteService = require('./services/FavoriteService');
const { AuthService } = require('./services/AuthService');

/*
 * SOLID – DIP (inversión de dependencias)
 * Qué: composition root. Es el único sitio que conoce las clases concretas y las conecta.
 * Cómo: crea repositorios, hasher y TokenService, y los inyecta por constructor en cada servicio.
 *   Un único TokenService se comparte entre AuthService (firma) y el middleware (verificación).
 * Por qué: los servicios dependen de contratos (métodos), no de implementaciones, así que se pueden
 *   sustituir por objetos falsos en pruebas o cambiar de almacenamiento sin tocar la lógica (RF01–RF09).
 * También aplica SRP/ISP: cada servicio recibe solo los repositorios que necesita.
 */
// Composition root: único lugar donde se ensamblan las dependencias
function buildContainer() {
  const store = createInMemoryStore();

  const productRepository = new ProductRepository(store);
  const catalogRepository = new CatalogRepository(store);
  const userRepository = new UserRepository(store);
  const reviewRepository = new ReviewRepository(store);
  const favoriteRepository = new FavoriteRepository(store);

  loadScrapedProducts(productRepository, env.SCRAPED_PRODUCTS_PATH);
  connectPostgres();

  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new TokenService({ secret: env.JWT_SECRET });

  return {
    tokenService,
    productService: new ProductService({ productRepository, catalogRepository }),
    productDetailService: new ProductDetailService({ productRepository, catalogRepository, reviewRepository }),
    productAdminService: new ProductAdminService({ productRepository, reviewRepository, favoriteRepository }),
    productComparisonService: new ProductComparisonService({ productRepository, catalogRepository }),
    reviewService: new ReviewService({ reviewRepository }),
    favoriteService: new FavoriteService({ favoriteRepository, productRepository }),
    authService: new AuthService({
      userRepository,
      passwordHasher,
      passwordVerifiers: [passwordHasher, new PlainPasswordVerifier()],
      tokenService
    })
  };
}

module.exports = { buildContainer };
