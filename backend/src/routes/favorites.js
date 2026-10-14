const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');

module.exports = (controller) => {
  const router = express.Router();
  router.get('/', authenticateToken, controller.list);
  router.post('/toggle', authenticateToken, controller.toggle);
  return router;
};
