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
const ReviewService = require('./services/ReviewService');
const FavoriteService = require('./services/FavoriteService');
const { AuthService } = require('./services/AuthService');

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

  return {
    productService: new ProductService({ productRepository, catalogRepository, reviewRepository, favoriteRepository }),
    reviewService: new ReviewService({ reviewRepository }),
    favoriteService: new FavoriteService({ favoriteRepository, productRepository }),
    authService: new AuthService({ userRepository, jwtSecret: env.JWT_SECRET })
  };
}

module.exports = { buildContainer };
