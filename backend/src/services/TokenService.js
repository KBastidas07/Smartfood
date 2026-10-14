const jwt = require('jsonwebtoken');

/*
 * RF02 (inicio de sesión)
 * SRP: única responsabilidad: firmar y verificar tokens JWT.
 * DIP: recibe el secreto por constructor (no lo lee de la configuración). AuthService lo usa para firmar
 *      y authMiddleware para verificar; ambos dependen de este servicio y no de jsonwebtoken.
 * Por qué: si cambia el formato o el secreto del token, solo se modifica este archivo.
 */
class TokenService {
  constructor({ secret, expiresIn = '7d' }) {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  sign(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token) {
    return jwt.verify(token, this.secret);
  }
}

module.exports = TokenService;
