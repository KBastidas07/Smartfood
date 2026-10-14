const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');

module.exports = (controller) => {
  const router = express.Router();
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.get('/me', authenticateToken, controller.me);
  return router;
};
