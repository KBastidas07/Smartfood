const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

class AuthService {
  constructor({ userRepository, jwtSecret }) {
    this.userRepository = userRepository;
    this.jwtSecret = jwtSecret;
  }

  normalizeEmail(email) {
    return typeof email === 'string' ? email.trim().toLowerCase() : '';
  }

  buildSession(user, message) {
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
    return {
      message,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
  }

  async register({ name, email, password }) {
    const normalizedEmail = this.normalizeEmail(email);

    if (!name || !normalizedEmail || !password) {
      throw new AuthError(400, 'Todos los campos son obligatorios');
    }

    if (this.userRepository.findByEmail(normalizedEmail)) {
      throw new AuthError(400, 'El correo electrónico ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.add({
      name,
      email: normalizedEmail,
      password_hash,
      role: 'consumer'
    });

    return this.buildSession(newUser, 'Registro exitoso');
  }

  async login({ email, password }) {
    const normalizedEmail = this.normalizeEmail(email);

    if (!normalizedEmail || !password) {
      throw new AuthError(400, 'Ingrese correo y contraseña');
    }

    const user = this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new AuthError(401, 'Credenciales incorrectas');
    }

    // Direct password match for initial dev seed or bcrypt compare
    let isMatch = false;
    if (user.password) {
      isMatch = (user.password === password);
    } else if (user.password_hash) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    }

    if (!isMatch) {
      throw new AuthError(401, 'Credenciales incorrectas');
    }

    return this.buildSession(user, 'Inicio de sesión exitoso');
  }
}

module.exports = { AuthService, AuthError };
