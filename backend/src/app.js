const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const reviewRoutes = require('./routes/reviews');
const favoriteRoutes = require('./routes/favorites');
const adminRoutes = require('./routes/admin');
const { createAuthMiddleware } = require('./middleware/authMiddleware');

const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const reviewController = require('./controllers/reviewController');
const favoriteController = require('./controllers/favoriteController');
const adminController = require('./controllers/adminController');

function createApp({ authService, tokenService, productService, productDetailService, productAdminService, productComparisonService, reviewService, favoriteService }) {
  const app = express();
  const auth = createAuthMiddleware(tokenService);

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Main Root Endpoint
  app.get('/api', (req, res) => {
    res.json({
      app: 'SmartFoodPop API',
      city: 'Popayán, Colombia',
      version: '1.0.0',
      status: 'Online',
      endpoints: [
        '/api/auth/register',
        '/api/auth/login',
        '/api/products',
        '/api/products/offers',
        '/api/products/compare',
        '/api/reviews',
        '/api/favorites',
        '/api/admin/products'
      ]
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes(authController(authService), auth));
  app.use('/api/products', productRoutes(productController(productService, productDetailService, productComparisonService)));
  app.use('/api/reviews', reviewRoutes(reviewController(reviewService), auth));
  app.use('/api/favorites', favoriteRoutes(favoriteController(favoriteService), auth));
  app.use('/api/admin', adminRoutes(adminController(productAdminService), auth));

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: 'Ocurrió un error inesperado en el servidor' });
  });

  return app;
}

module.exports = { createApp };
