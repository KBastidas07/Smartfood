const { QueryValidationError, parsePositiveInt, normalizeText } = require('../domain/queryHelpers');

/*
 * RF03, RF04 (búsqueda), RF07 y RF09 (filtros por tienda y categoría)
 * SRP: cada filtro valida y aplica un solo criterio (searchFilter, categoryFilter, storeFilter, offerFilter).
 *      Un filtro inválido lanza QueryValidationError (400) en vez de devolver el catálogo completo.
 * OCP: los filtros son una lista. Para un criterio nuevo se añade una función a la lista; applyFilters
 *      y buildEmptyMessage no cambian. Cada filtro declara su propio mensaje de vacío con describeEmpty.
 * LSP: todos comparten la firma (lista, query, catálogo) => lista, así que son intercambiables.
 * ISP: cada filtro lee solo su campo de la consulta.
 * DIP: applyFilters y buildEmptyMessage reciben la lista como parámetro; ProductService y
 *      ProductComparisonService deciden qué filtros usar.
 */
// Devuelve el valor recortado, '' si no se envió, o lanza 400 si no es texto simple
function readTextParam(value, label) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') {
    throw new QueryValidationError(`El parámetro '${label}' debe ser un único texto`);
  }
  return value.trim();
}

function normalizeSearchTerm(search) {
  return readTextParam(search, 'search');
}

// Cada filtro: (productos, query, catalogRepository) => productos. Para un filtro nuevo basta añadirlo a la lista.
const searchFilter = (list, { search }) => {
  const term = normalizeSearchTerm(search);
  if (!term) return list;
  const q = normalizeText(term);
  return list.filter(p => normalizeText(p.name).includes(q) || normalizeText(p.description).includes(q));
};

const categoryFilter = (list, { category }, catalog) => {
  const value = readTextParam(category, 'category');
  if (!value) return list;
  const id = parsePositiveInt(value);
  const categoryObj = catalog.getCategories().find(c => c.slug === value || (id !== null && c.id === id));
  if (!categoryObj) throw new QueryValidationError(`La categoría '${value}' no existe`);
  return list.filter(p => p.category_id === categoryObj.id);
};

const storeFilter = (list, { store }, catalog) => {
  const value = readTextParam(store, 'store');
  if (!value) return list;
  const id = parsePositiveInt(value);
  const storeObj = catalog.getStores().find(s => s.code === value || (id !== null && s.id === id));
  if (!storeObj) throw new QueryValidationError(`La tienda '${value}' no existe`);
  return list.filter(p => p.prices.some(pr => pr.store_id === storeObj.id));
};

const offerFilter = (list, { is_offer }) =>
  is_offer === 'true' ? list.filter(p => p.prices.some(pr => pr.is_offer)) : list;

const defaultProductFilters = [searchFilter, categoryFilter, storeFilter, offerFilter];

function applyFilters(filters, products, query, catalog) {
  return filters.reduce((list, filter) => filter(list, query, catalog), products);
}

const FILTERED_EMPTY_MESSAGE = 'No se encontraron productos con los filtros seleccionados';

// Cada filtro puede declarar describeEmpty(query): texto si ese filtro está activo en la consulta, o null
searchFilter.describeEmpty = ({ search }) => {
  const term = normalizeSearchTerm(search);
  return term ? `No se encontraron productos para «${term}»` : null;
};
categoryFilter.describeEmpty = ({ category }) => (category ? FILTERED_EMPTY_MESSAGE : null);
storeFilter.describeEmpty = ({ store }) => (store ? FILTERED_EMPTY_MESSAGE : null);
offerFilter.describeEmpty = ({ is_offer }) => (is_offer === 'true' ? FILTERED_EMPTY_MESSAGE : null);

// Mensaje informativo cuando una consulta válida no tiene coincidencias: gana el primer filtro activo de la lista
function buildEmptyMessage(query = {}, filters = defaultProductFilters) {
  for (const filter of filters) {
    const message = filter.describeEmpty ? filter.describeEmpty(query) : null;
    if (message) return message;
  }
  return 'No hay productos disponibles';
}

module.exports = {
  normalizeSearchTerm,
  searchFilter,
  categoryFilter,
  storeFilter,
  offerFilter,
  defaultProductFilters,
  applyFilters,
  buildEmptyMessage
};
