const { AuthError } = require('../services/AuthService');

module.exports = (authService) => ({
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const session = await authService.register({ name, email, password });
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof AuthError) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: 'Error interno en el servidor al registrar' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const session = await authService.login({ email, password });
      res.json(session);
    } catch (error) {
      if (error instanceof AuthError) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  },

  me(req, res) {
    res.json({ user: req.user });
  }
});
