/*
 * SOLID – SRP (responsabilidad única)
 * Qué: helpers compartidos de validación y normalización de parámetros de consulta.
 * Cómo: viven en un módulo propio; productFilters, productController y reviewController los importan.
 * Por qué: antes estaban duplicados o atados al módulo de filtros. Ahora cada consumidor depende de
 * una sola fuente y los mensajes de error (400) son idénticos en todos los endpoints (RF03, RF04, RF05, RF09).
 */
class QueryValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

// Entero positivo estricto (rechaza "1abc", "-1", "0", "1.5")
function parsePositiveInt(value) {
  return typeof value === 'string' && /^[1-9]\d{0,14}$/.test(value) ? Number(value) : null;
}

// Minúsculas y sin tildes, para búsquedas tolerantes
function normalizeText(text) {
  return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

module.exports = { QueryValidationError, parsePositiveInt, normalizeText };
