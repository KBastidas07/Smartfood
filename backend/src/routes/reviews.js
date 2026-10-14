const express = require('express');

module.exports = (controller, { authenticateToken }) => {
  const router = express.Router();
  router.get('/product/:productId', controller.listByProduct);
  router.post('/', authenticateToken, controller.create);
  return router;
};
