const test = require('node:test');
const assert = require('node:assert/strict');
const { getCanonicalProductGroup } = require('../src/domain/productClassifier');

test('canonical product mapping keeps coherent image per product family', () => {
  const arroz = getCanonicalProductGroup('Arroz Diana Blanco Superior');
  const leche = getCanonicalProductGroup('Leche Entera Alquería 1100ml');
  const detergente = getCanonicalProductGroup('Detergente Ariel Multiusos 2kg');
  const lecheRealImage = getCanonicalProductGroup('Leche Entera Alquería 1100ml', 'https://cdn.example.com/leche-real.jpg');

  assert.equal(
    arroz.image_url,
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
  );
  assert.equal(
    leche.image_url,
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80'
  );
  assert.equal(
    detergente.image_url,
    'https://images.unsplash.com/photo-1585832770485-e68a5fc88280?auto=format&fit=crop&w=600&q=80'
  );
  assert.equal(lecheRealImage.image_url, 'https://cdn.example.com/leche-real.jpg');
});
