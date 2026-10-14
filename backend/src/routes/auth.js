const express = require('express');

module.exports = (controller, { authenticateToken }) => {
  const router = express.Router();
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.get('/me', authenticateToken, controller.me);
  return router;
};
