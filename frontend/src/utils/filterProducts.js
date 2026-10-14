// Filtrado del catálogo (RF03, RF04, RF08, RF09, RF10)
export function filterProducts({ products, categories, stores, favorites, searchTerm, selectedCategory, selectedStore, activeTab }) {
  return products.filter(product => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = (product.description || '').toLowerCase().includes(q);
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
