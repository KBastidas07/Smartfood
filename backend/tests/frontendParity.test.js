const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { buildContainer } = require('../src/container');
const { createApp } = require('../src/app');

const FRONTEND_FILTER = pathToFileURL(path.join(__dirname, '../../frontend/src/utils/filterProducts.js')).href;

async function withServer(fn) {
  const server = createApp(buildContainer()).listen(0);
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const get = async (p) => {
    const res = await fetch(base + p);
    return { status: res.status, body: await res.json() };
  };
  try {
    await fn(get);
  } finally {
    server.close();
  }
}

test('integracion: el respaldo local del frontend coincide con la busqueda y filtros del backend', () => withServer(async (get) => {
  const { filterProducts } = await import(FRONTEND_FILTER);
  const catalog = (await get('/products')).body;

  // Término con tilde real tomado de los datos, escrito sin tilde y en mayúsculas
  const accented = catalog.products
    .flatMap(p => `${p.name} ${p.description}`.split(/[^\p{L}]+/u))
    .find(w => w.length > 3 && w !== w.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  assert.ok(accented, 'los datos deben contener al menos una palabra con tilde');
  const accentless = accented.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

  const cases = [
    { search: 'leche' },
    { search: '  LECHE  ' },
    { search: accentless },
    { search: accented },
    { search: 'zzzz' },
    { store: 'olimpica' },
    { category: 'granos-y-basicos' },
    { store: 'd1', category: '1' },
    { search: 'leche', store: 'exito' }
  ];

  for (const query of cases) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(query).map(([k, v]) => [k, k === 'search' ? v.trim() : v]))
    ).toString();
    const backend = await get('/products?' + qs);
    assert.equal(backend.status, 200, qs);

    const local = filterProducts({
      products: catalog.products,
      categories: catalog.categories,
      stores: catalog.stores,
      favorites: [],
      searchTerm: query.search || '',
      selectedCategory: query.category || 'all',
      selectedStore: query.store || 'all',
      activeTab: 'catalog'
    });

    assert.deepEqual(local.map(p => p.id).sort(), backend.body.products.map(p => p.id).sort(), JSON.stringify(query));
    if (backend.body.total === 0) assert.ok(backend.body.message, JSON.stringify(query));
  }
}));

test('integracion: los errores 400 del backend traen un mensaje y no un catalogo parcial', () => withServer(async (get) => {
  for (const q of ['store=xxx', 'category=999', 'search=a&search=b']) {
    const res = await get('/products?' + q);
    assert.equal(res.status, 400, q);
    assert.equal(typeof res.body.error, 'string', q);
    assert.ok(res.body.error.length > 0, q);
    assert.equal(res.body.products, undefined, q);
  }
}));
