const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

class AuthError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/*
 * RF01 (registro) y RF02 (inicio de sesión)
 * SRP: solo orquesta el flujo de autenticación (validar, buscar/crear usuario, armar la sesión).
 *      El cifrado vive en PasswordHasher y la firma del token en TokenService.
 * OCP: `passwordVerifiers` es una lista; para soportar otro tipo de credencial se añade un verificador
 *      sin modificar login().
 * LSP: cualquier verificador con supports(user) y verify(plain, user) es intercambiable.
 * ISP: recibe solo userRepository, passwordHasher, passwordVerifiers y tokenService.
 * DIP: todas las dependencias se inyectan por constructor (ver container.js), por lo que se prueba con falsos.
 */
class AuthService {
  constructor({ userRepository, passwordHasher, passwordVerifiers, tokenService }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.passwordVerifiers = passwordVerifiers;
    this.tokenService = tokenService;
  }

  async verifyPassword(plain, user) {
    const verifier = this.passwordVerifiers.find(v => v.supports(user));
    return verifier ? verifier.verify(plain, user) : false;
  }

  normalizeEmail(email) {
    return typeof email === 'string' ? email.trim().toLowerCase() : '';
  }

  buildSession(user, message) {
    const token = this.tokenService.sign({ id: user.id, name: user.name, email: user.email, role: user.role });
    return {
      message,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
  }

  async register({ name, email, password }) {
    const normalizedEmail = this.normalizeEmail(email);

    const cleanName = typeof name === 'string' ? name.trim() : '';

    if (!cleanName || !normalizedEmail || !password) {
      throw new AuthError(400, 'Todos los campos son obligatorios');
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      throw new AuthError(400, 'El correo electronico no es valido');
    }

    if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
      throw new AuthError(400, `La contrasena debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
    }

    if (this.userRepository.findByEmail(normalizedEmail)) {
      throw new AuthError(400, 'El correo electrónico ya está registrado');
    }

    const password_hash = await this.passwordHasher.hash(password);

    const newUser = this.userRepository.add({
      name: cleanName,
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

    if (!(await this.verifyPassword(password, user))) {
      throw new AuthError(401, 'Credenciales incorrectas');
    }

    return this.buildSession(user, 'Inicio de sesión exitoso');
  }
}

module.exports = { AuthService, AuthError };
