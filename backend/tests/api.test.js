const test = require('node:test');
const assert = require('node:assert/strict');
const { buildContainer } = require('../src/container');
const { createApp } = require('../src/app');

async function withServer(fn) {
  const server = createApp(buildContainer()).listen(0);
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const call = async (path, options = {}) => {
    const res = await fetch(base + path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    return { status: res.status, body: await res.json() };
  };
  try {
    await fn(call);
  } finally {
    server.close();
  }
}

test('RF01 registro: crea usuario, valida datos y rechaza duplicados', () => withServer(async (call) => {
  const ok = await call('/auth/register', { method: 'POST', body: { name: 'Ana', email: 'Ana@Test.com', password: 'secreto1' } });
  assert.equal(ok.status, 201);
  assert.equal(ok.body.user.email, 'ana@test.com');
  assert.equal(ok.body.user.role, 'consumer');
  assert.ok(ok.body.token);

  const dup = await call('/auth/register', { method: 'POST', body: { name: 'Ana', email: 'ana@test.com', password: 'secreto1' } });
  assert.equal(dup.status, 400);

  const badEmail = await call('/auth/register', { method: 'POST', body: { name: 'Ana', email: 'nope', password: 'secreto1' } });
  assert.equal(badEmail.status, 400);

  const shortPass = await call('/auth/register', { method: 'POST', body: { name: 'Ana', email: 'b@test.com', password: '123' } });
  assert.equal(shortPass.status, 400);
}));

test('RF02 login: usuario semilla, usuario nuevo (bcrypt) y credenciales invalidas', () => withServer(async (call) => {
  const seed = await call('/auth/login', { method: 'POST', body: { email: 'usuario@popayan.com', password: 'user123' } });
  assert.equal(seed.status, 200);

  await call('/auth/register', { method: 'POST', body: { name: 'Luis', email: 'luis@test.com', password: 'clave123' } });
  const hashed = await call('/auth/login', { method: 'POST', body: { email: 'luis@test.com', password: 'clave123' } });
  assert.equal(hashed.status, 200);

  const wrong = await call('/auth/login', { method: 'POST', body: { email: 'luis@test.com', password: 'mala' } });
  assert.equal(wrong.status, 401);
  const missing = await call('/auth/login', { method: 'POST', body: { email: '' } });
  assert.equal(missing.status, 400);
}));

test('RF03 consulta: lista y filtra productos; detalle sigue funcionando', () => withServer(async (call) => {
  const all = await call('/products');
  assert.equal(all.status, 200);
  assert.ok(all.body.total > 0);

  const first = all.body.products[0];
  const search = await call('/products?search=' + encodeURIComponent(first.name.split(' ')[0]));
  assert.ok(search.body.total >= 1);

  const detail = await call('/products/' + first.id);
  assert.equal(detail.status, 200);
  assert.equal((await call('/products/999999999')).status, 404);
}));

test('RF07 comparacion: precios por tienda ordenados con ahorro potencial', () => withServer(async (call) => {
  const res = await call('/products/compare');
  assert.equal(res.status, 200);
  assert.ok(res.body.total > 0);

  const multi = res.body.comparisons.find(c => c.stores_count > 1);
  assert.ok(multi, 'debe existir al menos un producto en varias tiendas');
  const prices = multi.prices.map(p => p.price);
  assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
  assert.equal(multi.min_price, prices[0]);
  assert.equal(multi.potential_savings, multi.max_price - multi.min_price);
  assert.equal(multi.cheapest_store.price, multi.min_price);

  const filtered = await call('/products/compare?search=zzzzzz');
  assert.equal(filtered.body.total, 0);
}));

test('RF04 busqueda: trim, tildes, parametro invalido y sin resultados con mensaje', () => withServer(async (call) => {
  const base = (await call('/products?search=leche')).body;
  assert.ok(base.total > 0);
  assert.equal(base.message, undefined);

  const padded = await call('/products?search=' + encodeURIComponent('  LECHE  '));
  assert.equal(padded.status, 200);
  assert.equal(padded.body.total, base.total);

  const accented = await call('/products?search=' + encodeURIComponent('LÉCHE'));
  assert.equal(accented.body.total, base.total);

  const onlySpaces = await call('/products?search=%20%20');
  assert.equal(onlySpaces.status, 200);
  assert.equal(onlySpaces.body.total, (await call('/products')).body.total);

  const repeated = await call('/products?search=a&search=b');
  assert.equal(repeated.status, 400);
  assert.ok(repeated.body.error);

  const none = await call('/products?search=zzzz');
  assert.equal(none.status, 200);
  assert.equal(none.body.total, 0);
  assert.deepEqual(none.body.products, []);
  assert.match(none.body.message, /zzzz/);
  assert.ok(Array.isArray(none.body.stores) && Array.isArray(none.body.categories));
}));

test('RF09 filtros: validos, combinados, invalidos (400) y combinacion vacia (200)', () => withServer(async (call) => {
  const all = (await call('/products')).body;

  const byStore = await call('/products?store=olimpica');
  assert.equal(byStore.status, 200);
  assert.ok(byStore.body.total > 0 && byStore.body.total <= all.total);
  assert.ok(byStore.body.products.every(p => p.prices.some(pr => pr.store_id === 2)));

  const byCatSlug = await call('/products?category=granos-y-basicos');
  assert.ok(byCatSlug.body.total > 0);
  assert.ok(byCatSlug.body.products.every(p => p.category_id === 1));

  const both = await call('/products?store=d1&category=1');
  assert.ok(both.body.total > 0);
  assert.ok(both.body.products.every(p => p.category_id === 1 && p.prices.some(pr => pr.store_id === 1)));

  for (const bad of ['store=xxx', 'category=999', 'store=1abc', 'category=-1', 'store=olimpica&category=nope', 'store=a&store=b']) {
    const res = await call('/products?' + bad);
    assert.equal(res.status, 400, bad);
    assert.ok(res.body.error, bad);
    assert.equal(res.body.products, undefined, bad);
  }

  // Combinacion valida sin coincidencias: se busca una pareja tienda/categoria sin productos
  const stores = all.stores, cats = all.categories;
  let empty = null;
  for (const s of stores) for (const c of cats) {
    if (!all.products.some(p => p.category_id === c.id && p.prices.some(pr => pr.store_id === s.id))) empty = { s, c };
  }
  if (empty) {
    const res = await call(`/products?store=${empty.s.code}&category=${empty.c.slug}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.total, 0);
    assert.ok(res.body.message);
  }

  const withSearch = await call('/products?store=d1&search=zzzz');
  assert.equal(withSearch.status, 200);
  assert.equal(withSearch.body.total, 0);

  const cmp = await call('/products/compare?category=xxx');
  assert.equal(cmp.status, 400);
}));

test('RF05 detalle: id validado, categoria, resenas y promedio definido', () => withServer(async (call) => {
  for (const bad of ['abc', '1abc', '-1', '0', '1.5']) {
    assert.equal((await call('/products/' + bad)).status, 400, bad);
  }
  assert.equal((await call('/products/999999')).status, 404);

  const withReviews = await call('/products/1');
  assert.equal(withReviews.status, 200);
  assert.ok(withReviews.body.product.category.name);
  assert.ok(withReviews.body.product.prices.every(p => p.store_name));
  assert.equal(withReviews.body.reviews.length, 1);
  assert.deepEqual(withReviews.body.reviews_summary, { count: 1, average: 5 });

  const noReviews = (await call('/products')).body.products.find(p => p.id !== 1 && p.id !== 3);
  const empty = await call('/products/' + noReviews.id);
  assert.deepEqual(empty.body.reviews, []);
  assert.deepEqual(empty.body.reviews_summary, { count: 0, average: 0 });

  const login = await call('/auth/login', { method: 'POST', body: { email: 'usuario@popayan.com', password: 'user123' } });
  const headers = { Authorization: 'Bearer ' + login.body.token };
  for (const rating of [2, 4]) {
    const r = await call('/reviews', { method: 'POST', headers, body: { product_id: 1, rating, comment: 'ok' } });
    assert.equal(r.status, 201);
  }
  const updated = await call('/products/1');
  assert.equal(updated.body.reviews.length, 3);
  assert.deepEqual(updated.body.reviews_summary, { count: 3, average: 3.7 });

  assert.equal((await call('/reviews/product/abc')).status, 400);
  assert.equal((await call('/reviews/product/1')).body.reviews.length, 3);
}));

test('admin: crear, actualizar y eliminar producto (limpia resenas) con permisos', () => withServer(async (call) => {
  const admin = await call('/auth/login', { method: 'POST', body: { email: 'admin@smartfood.com', password: 'admin123' } });
  const user = await call('/auth/login', { method: 'POST', body: { email: 'usuario@popayan.com', password: 'user123' } });
  const adminH = { Authorization: 'Bearer ' + admin.body.token };

  assert.equal((await call('/admin/products', { method: 'POST', body: { name: 'X', category_id: 1 } })).status, 401);
  assert.equal((await call('/admin/products', { method: 'POST', headers: { Authorization: 'Bearer ' + user.body.token }, body: { name: 'X', category_id: 1 } })).status, 403);
  assert.equal((await call('/admin/products', { method: 'POST', headers: adminH, body: { name: 'Solo nombre' } })).status, 400);

  const created = await call('/admin/products', { method: 'POST', headers: adminH, body: { name: 'Producto Prueba', category_id: '2' } });
  assert.equal(created.status, 201);
  const p = created.body.product;
  assert.equal(p.category_id, 2);
  assert.equal(p.unit, '1 Unidad');
  assert.equal(p.description, '');
  assert.ok(p.image_url);
  assert.deepEqual(p.prices.map(x => [x.store_id, x.price]), [[1, 5000]]);

  const found = await call('/products?search=' + encodeURIComponent('producto prueba'));
  assert.equal(found.body.total, 1);

  const updated = await call('/admin/products/' + p.id, { method: 'PUT', headers: adminH, body: { unit: '2 Unidades' } });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.product.unit, '2 Unidades');
  assert.equal((await call('/admin/products/999999', { method: 'PUT', headers: adminH, body: { unit: 'x' } })).status, 404);

  await call('/reviews', { method: 'POST', headers: { Authorization: 'Bearer ' + user.body.token }, body: { product_id: p.id, rating: 4, comment: 'bien' } });
  assert.equal((await call('/reviews/product/' + p.id)).body.reviews.length, 1);

  const removed = await call('/admin/products/' + p.id, { method: 'DELETE', headers: adminH });
  assert.equal(removed.status, 200);
  assert.equal((await call('/products/' + p.id)).status, 404);
  assert.equal((await call('/reviews/product/' + p.id)).body.reviews.length, 0);
  assert.equal((await call('/admin/products/' + p.id, { method: 'DELETE', headers: adminH })).status, 404);
}));

test('auth middleware: ruta protegida sin token (401), token invalido (403) y token valido (200)', () => withServer(async (call) => {
  assert.equal((await call('/auth/me')).status, 401);
  assert.equal((await call('/auth/me', { headers: { Authorization: 'Bearer token.invalido' } })).status, 403);
  assert.equal((await call('/favorites', { headers: { Authorization: 'Bearer token.invalido' } })).status, 403);

  const login = await call('/auth/login', { method: 'POST', body: { email: 'usuario@popayan.com', password: 'user123' } });
  const me = await call('/auth/me', { headers: { Authorization: 'Bearer ' + login.body.token } });
  assert.equal(me.status, 200);
  assert.equal(me.body.user.email, 'usuario@popayan.com');
}));
