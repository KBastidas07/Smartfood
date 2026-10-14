/*
 * RF02 (acceso a rutas protegidas)
 * DIP: el middleware recibe un tokenService y no importa jsonwebtoken ni lee JWT_SECRET.
 * ISP: solo usa el método verify(token) de ese servicio.
 * SRP: solo decide si la petición está autenticada y si es administrador; no emite tokens.
 * Por qué: firma y verificación comparten el mismo secreto y la misma fuente, y el middleware es
 *   fácil de probar con un tokenService falso.
 */
function createAuthMiddleware(tokenService) {
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
    }

    try {
      req.user = tokenService.verify(token);
    } catch (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    next();
  }

  function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Requiere permisos de administrador' });
    }
    next();
  }

  return { authenticateToken, requireAdmin };
}

module.exports = { createAuthMiddleware };
