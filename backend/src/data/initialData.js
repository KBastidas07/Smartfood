// Seed Data and In-Memory Data Store for SmartFoodPop (Popayán)

const initialStores = [
  { id: 1, name: 'Tiendas D1', code: 'd1', logo: '🏬', city: 'Popayán', address: 'Calle 5 # 7-23, Centro' },
  { id: 2, name: 'Supermercado Olímpica', code: 'olimpica', logo: '🛒', city: 'Popayán', address: 'Carrera 9 # 18N-12, Catay' },
  { id: 3, name: 'Almacenes Éxito', code: 'exito', logo: '💛', city: 'Popayán', address: 'Calle 13N # 8-65, Campanario' }
];

const initialCategories = [
  { id: 1, name: 'Granos y Básicos', slug: 'granos-y-basicos', icon: '🌾' },
  { id: 2, name: 'Lácteos y Huevos', slug: 'lacteos-y-huevos', icon: '🥛' },
  { id: 3, name: 'Aseo del Hogar', slug: 'aseo-del-hogar', icon: '🧹' },
  { id: 4, name: 'Aceites y Condimentos', slug: 'aceites-y-condimentos', icon: '🫒' },
  { id: 5, name: 'Bebidas y Pasabocas', slug: 'bebidas-y-pasabocas', icon: '🧃' }
];

let initialProducts = [
  {
    id: 1,
    name: 'Arroz Diana Blanco Superior',
    description: 'Arroz blanco de grano entero seleccionado, rico en nutrientes.',
    category_id: 1,
    unit: 'Bolsa 1000g (1 kg)',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    prices: [
      { store_id: 1, price: 3950, previous_price: 4200, is_offer: true, offer_description: 'Descuento del 6% semanal' },
      { store_id: 2, price: 4300, previous_price: 4300, is_offer: false, offer_description: '' },
      { store_id: 3, price: 4450, previous_price: 4700, is_offer: true, offer_description: 'Precio Miércoles de Mercado' }
    ]
  },
  {
    id: 2,
    name: 'Leche Entera Alquería',
    description: 'Leche ultra pasteurizada con todas sus vitaminas y cremosidad natural.',
    category_id: 2,
    unit: 'Bolsa 1100 ml',
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
    prices: [
      { store_id: 1, price: 3400, previous_price: 3400, is_offer: false, offer_description: '' },
      { store_id: 2, price: 3650, previous_price: 3900, is_offer: true, offer_description: 'Super oferta de la semana' },
      { store_id: 3, price: 3800, previous_price: 3800, is_offer: false, offer_description: '' }
    ]
  },
  {
    id: 3,
    name: 'Huevos A Frescos Rojos X30',
    description: 'Cubeta de 30 huevos clasificados tamaño A, producidos en el Valle del Cauca y Cauca.',
    category_id: 2,
    unit: 'Cubeta x30 unidades',
    image_url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
    prices: [
      { store_id: 1, price: 13900, previous_price: 15200, is_offer: true, offer_description: 'Ahorro especial D1' },
      { store_id: 2, price: 14800, previous_price: 14800, is_offer: false, offer_description: '' },
      { store_id: 3, price: 15500, previous_price: 16000, is_offer: true, offer_description: 'Puntos Olímpica acumulables' }
    ]
  },
  {
    id: 4,
    name: 'Aceite Vegetal Premier 900ml',
    description: 'Aceite 100% puro libre de colesterol, ideal para todas tus preparaciones cotidianas.',
    category_id: 4,
    unit: 'Botella 900 ml',
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    prices: [
      { store_id: 1, price: 8200, previous_price: 8900, is_offer: true, offer_description: 'Precios Bajos Siempre D1' },
      { store_id: 2, price: 8950, previous_price: 8950, is_offer: false, offer_description: '' },
      { store_id: 3, price: 9300, previous_price: 9800, is_offer: true, offer_description: 'Descuento Aliados' }
    ]
  },
  {
    id: 5,
    name: 'Detergente en Polvo Ariel Multiusos',
    description: 'Detergente concentrado con toque de suavizante, elimina manchas difíciles.',
    category_id: 3,
    unit: 'Bolsa 2 kg',
    image_url: 'https://images.unsplash.com/photo-1585832770485-e68a5fc88280?auto=format&fit=crop&w=600&q=80',
    prices: [
      { store_id: 1, price: 16500, previous_price: 16500, is_offer: false, offer_description: '' },
      { store_id: 2, price: 15900, previous_price: 18500, is_offer: true, offer_description: 'Promoción Aniversario Olímpica' },
      { store_id: 3, price: 17200, previous_price: 17200, is_offer: false, offer_description: '' }
    ]
  },
  {
    id: 6,
    name: 'Frijol Cargamanto Rojo D1',
    description: 'Frijol seleccionado de alta calidad para sancocho y bandeja paisa.',
    category_id: 1,
    unit: 'Bolsa 500g',
    image_url: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80',
    prices: [
      { store_id: 1, price: 4200, previous_price: 4600, is_offer: true, offer_description: 'Oferta Granos D1' },
      { store_id: 2, price: 4800, previous_price: 4800, is_offer: false, offer_description: '' }
    ]
  }
];

let initialUsers = [
  { id: 1, name: 'Usuario Demo Popayán', email: 'usuario@popayan.com', password: 'user123', role: 'consumer' },
  { id: 2, name: 'Administrador SmartFood', email: 'admin@smartfood.com', password: 'admin123', role: 'admin' }
];

let initialReviews = [
  { id: 1, user_id: 1, user_name: 'Carlos Muñoz', product_id: 1, rating: 5, comment: 'Excelente calidad de arroz y en D1 es donde mejor precio tiene en Popayán.', created_at: '2026-09-01T10:30:00Z' },
  { id: 2, user_id: 1, user_name: 'María Fernández', product_id: 3, rating: 4, comment: 'Los huevos son muy frescos, pero a veces en la Olímpica están más grandes.', created_at: '2026-09-04T14:15:00Z' }
];

let initialFavorites = [
  { id: 1, user_id: 1, product_id: 1 },
  { id: 2, user_id: 1, product_id: 3 }
];

module.exports = {
  initialStores,
  initialCategories,
  initialProducts,
  initialUsers,
  initialReviews,
  initialFavorites
};
