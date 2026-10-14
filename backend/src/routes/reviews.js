const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');

module.exports = (controller) => {
  const router = express.Router();
  router.get('/product/:productId', controller.listByProduct);
  router.post('/', authenticateToken, controller.create);
  return router;
};
