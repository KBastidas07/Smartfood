const bcrypt = require('bcryptjs');

/*
 * RF01 / RF02
 * SRP: este módulo solo sabe de contraseñas (cifrar y comparar); AuthService no conoce bcrypt.
 * OCP: cambiar de algoritmo implica una clase nueva con el mismo contrato, sin tocar AuthService.
 * LSP: BcryptPasswordHasher y PlainPasswordVerifier cumplen el mismo contrato (supports/verify), por lo
 *      que AuthService los trata igual. PlainPasswordVerifier existe solo por los usuarios semilla.
 */
// Contrato común de verificadores: supports(user) y verify(plain, user)
class BcryptPasswordHasher {
  async hash(plain) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
  }

  supports(user) {
    return Boolean(user.password_hash);
  }

  verify(plain, user) {
    return bcrypt.compare(plain, user.password_hash);
  }
}

// Usuarios semilla de desarrollo guardados con contraseña en claro
class PlainPasswordVerifier {
  supports(user) {
    return Boolean(user.password);
  }

  async verify(plain, user) {
    return user.password === plain;
  }
}

module.exports = { BcryptPasswordHasher, PlainPasswordVerifier };
