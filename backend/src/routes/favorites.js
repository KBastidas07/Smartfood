const express = require('express');

module.exports = (controller, { authenticateToken }) => {
  const router = express.Router();
  router.get('/', authenticateToken, controller.list);
  router.post('/toggle', authenticateToken, controller.toggle);
  return router;
};
