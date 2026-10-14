const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

module.exports = (controller) => {
  const router = express.Router();
  router.post('/products', authenticateToken, requireAdmin, controller.create);
  router.put('/products/:id', authenticateToken, requireAdmin, controller.update);
  router.delete('/products/:id', authenticateToken, requireAdmin, controller.remove);
  return router;
};
