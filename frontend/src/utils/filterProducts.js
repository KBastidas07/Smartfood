// Minúsculas y sin tildes; misma regla que la búsqueda del backend
const normalizeText = (text) => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Filtrado del catálogo (RF03, RF04, RF08, RF09, RF10)
export function filterProducts({ products, categories, stores, favorites, searchTerm, selectedCategory, selectedStore, activeTab }) {
  return products.filter(product => {
    if (searchTerm.trim()) {
      const q = normalizeText(searchTerm.trim());
      const matchName = normalizeText(product.name).includes(q);
      const matchDesc = normalizeText(product.description).includes(q);
      if (!matchName && !matchDesc) return false;
    }

    if (selectedCategory !== 'all') {
      const catObj = categories.find(c => c.slug === selectedCategory || c.id === parseInt(selectedCategory));
      if (catObj && product.category_id !== catObj.id) return false;
    }

    if (selectedStore !== 'all') {
      const storeObj = stores.find(s => s.code === selectedStore || s.id === parseInt(selectedStore));
      if (storeObj && !product.prices.some(pr => pr.store_id === storeObj.id)) return false;
    }

    if (activeTab === 'offers') {
      if (!product.prices.some(p => p.is_offer)) return false;
    }

    if (activeTab === 'favorites') {
      if (!favorites.includes(product.id)) return false;
    }

    return true;
  });
}
