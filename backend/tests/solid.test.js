const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');
const { buildContainer } = require('../src/container');
const { AuthService } = require('../src/services/AuthService');
const ProductService = require('../src/services/ProductService');
const ProductComparisonService = require('../src/services/ProductComparisonService');
const ProductDetailService = require('../src/services/ProductDetailService');
const { applyFilters, buildEmptyMessage, defaultProductFilters } = require('../src/services/productFilters');

const fakeCatalog = {
  getStores: () => [{ id: 1, code: 'a', name: 'A', logo: 'x' }, { id: 2, code: 'b', name: 'B', logo: 'y' }],
  getCategories: () => [{ id: 1, slug: 'granos', name: 'Granos' }]
};
const fakeProducts = {
  findAll: () => [
    { id: 1, name: 'Arroz', description: 'Grano', category_id: 1, unit: '1kg', image_url: '', prices: [{ store_id: 1, price: 10 }, { store_id: 2, price: 8, is_offer: true }] },
    { id: 2, name: 'Sal', description: '', category_id: 1, unit: '1kg', image_url: '', prices: [{ store_id: 1, price: 3 }] }
  ],
  findById: (id) => fakeProducts.findAll().find(p => p.id === id) || null
};

test('DIP/LSP: los servicios funcionan con repositorios y colaboradores falsos', async () => {
  const list = new ProductService({ productRepository: fakeProducts, catalogRepository: fakeCatalog }).list({ search: 'ARROZ' });
  assert.equal(list.total, 1);

  const cmp = new ProductComparisonService({ productRepository: fakeProducts, catalogRepository: fakeCatalog }).compare({});
  assert.equal(cmp.comparisons[0].cheapest_store.store_id, 2);

  const detail = new ProductDetailService({
    productRepository: fakeProducts, catalogRepository: fakeCatalog, reviewRepository: { findByProductId: () => [] }
  }).getDetail(1);
  assert.deepEqual(detail.reviews_summary, { count: 0, average: 0 });

  const users = [];
  const auth = new AuthService({
    userRepository: { findByEmail: (e) => users.find(u => u.email === e), add: (u) => { const n = { id: 1, ...u }; users.push(n); return n; } },
    passwordHasher: { hash: async (p) => 'h:' + p },
    passwordVerifiers: [{ supports: () => true, verify: async (p, u) => u.password_hash === 'h:' + p }],
    tokenService: { sign: (payload) => 'tok-' + payload.email }
  });
  const reg = await auth.register({ name: 'Ana', email: 'ANA@x.co', password: 'secreto1' });
  assert.equal(reg.token, 'tok-ana@x.co');
  assert.equal((await auth.login({ email: 'ana@x.co', password: 'secreto1' })).user.email, 'ana@x.co');
  await assert.rejects(() => auth.login({ email: 'ana@x.co', password: 'otra' }), { status: 401 });
});

test('OCP: un filtro nuevo se añade a la lista sin modificar applyFilters ni buildEmptyMessage', () => {
  const maxPriceFilter = (list, { max_price }) => (max_price ? list.filter(p => p.prices.some(pr => pr.price <= Number(max_price))) : list);
  maxPriceFilter.describeEmpty = ({ max_price }) => (max_price ? 'Nada tan barato' : null);
  const filters = [...defaultProductFilters, maxPriceFilter];

  const query = { max_price: '5' };
  const result = applyFilters(filters, fakeProducts.findAll(), query, fakeCatalog);
  assert.deepEqual(result.map(p => p.id), [2]);
  assert.equal(buildEmptyMessage({ max_price: '1' }, filters), 'Nada tan barato');
  assert.equal(new ProductService({ productRepository: fakeProducts, catalogRepository: fakeCatalog, filters }).list(query).total, 1);
});

test('integracion entre RF: registro -> login -> sesion -> consulta -> busqueda -> filtros -> detalle -> comparacion', async () => {
  const server = createApp(buildContainer()).listen(0);
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const call = async (path, { method = 'GET', body, token } = {}) => {
    const res = await fetch(base + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: body ? JSON.stringify(body) : undefined
    });
    return { status: res.status, body: await res.json() };
  };
  try {
    const email = `cruzado${Date.now()}@test.co`;
    const reg = await call('/auth/register', { method: 'POST', body: { name: 'Cruzado', email, password: 'clave123' } });
    assert.equal(reg.status, 201);
    const login = await call('/auth/login', { method: 'POST', body: { email, password: 'clave123' } });
    assert.equal(login.status, 200);
    const me = await call('/auth/me', { token: login.body.token });
    assert.equal(me.status, 200);

    const all = await call('/products');
    assert.ok(all.body.total > 0);
    const first = all.body.products[0];
    const found = await call('/products?search=' + encodeURIComponent(first.name.toUpperCase()));
    assert.ok(found.body.products.some(p => p.id === first.id));

    const store = all.body.stores[0];
    const category = all.body.categories.find(c => c.id === first.category_id);
    const combined = await call(`/products?store=${store.code}&category=${category.slug}&search=${encodeURIComponent(first.name)}`);
    assert.equal(combined.status, 200);
    assert.ok(combined.body.products.every(p => p.category_id === category.id));

    const detail = await call('/products/' + first.id);
    assert.equal(detail.status, 200);
    assert.equal(detail.body.product.id, first.id);
    assert.equal(typeof detail.body.reviews_summary.average, 'number');

    const cmp = await call('/products/compare?search=' + encodeURIComponent(first.name));
    const entry = cmp.body.comparisons.find(c => c.product_id === first.id);
    assert.ok(entry);
    assert.equal(entry.min_price, Math.min(...detail.body.product.prices.map(p => p.price)));

    assert.equal((await call('/products/compare')).status, 200);
    assert.equal((await call('/products/offers')).status, 200);
    assert.equal((await call('/products?store=zzz')).status, 400);
    assert.equal((await call('/products/abc')).status, 400);
    assert.equal((await call('/products/999999')).status, 404);
  } finally {
    server.close();
  }
});
