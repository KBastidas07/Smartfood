const express = require('express');

module.exports = (controller) => {
  const router = express.Router();
  router.get('/', controller.list);
  router.get('/offers', controller.offers);
  router.get('/:id', controller.detail);
  return router;
};
