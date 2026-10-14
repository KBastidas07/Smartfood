import { useState, useEffect, useRef } from 'react';
import { productApi } from '../api/productApi';
import { adminApi } from '../api/adminApi';
import { initialProducts, initialStores, initialCategories } from '../data/mockData';
import { filterProducts } from '../utils/filterProducts';

const SEARCH_DEBOUNCE_MS = 300;

// Catálogo: búsqueda y filtros se resuelven en el backend (con dataset local de respaldo si no responde)
export function useProducts({ search = '', category = 'all', store = 'all' } = {}) {
  const [catalog, setCatalog] = useState(initialProducts);
  const [stores, setStores] = useState(initialStores);
  const [categories, setCategories] = useState(initialCategories);
  const [filtered, setFiltered] = useState({ products: [], message: '', error: '' });
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const catalogRef = useRef(catalog);
  catalogRef.current = catalog;
  const lastSearchRef = useRef(search);

  const term = search.trim();
  const filtersActive = Boolean(term) || category !== 'all' || store !== 'all';

  // Catálogo completo (sin filtros)
  useEffect(() => {
    let cancelled = false;
    productApi.getProducts()
      .then(res => {
        if (cancelled) return;
        if (res.products) setCatalog(res.products);
        if (res.stores) setStores(res.stores);
        if (res.categories) setCategories(res.categories);
      })
      .catch(() => {
        console.log('Backend server unreachable; using built-in Popayán dataset.');
      });
    return () => { cancelled = true; };
  }, [refreshKey]);

  // Consulta filtrada: solo la respuesta de la petición más reciente se aplica
  useEffect(() => {
    if (!filtersActive) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    const params = {};
    if (term) params.search = term;
    if (category !== 'all') params.category = category;
    if (store !== 'all') params.store = store;

    const searchChanged = lastSearchRef.current !== search;
    lastSearchRef.current = search;

    setLoading(true);
    const timer = setTimeout(() => {
      productApi.getProducts(params)
        .then(res => {
          if (cancelled) return;
          setFiltered({ products: res.products || [], message: res.message || '', error: '' });
          if (res.stores) setStores(res.stores);
          if (res.categories) setCategories(res.categories);
        })
        .catch(err => {
          if (cancelled) return;
          // Errores de validación (4xx) se informan; sin conexión o fallo del servidor (5xx) se usa el respaldo local
          if (err.status && err.status < 500) {
            setFiltered({ products: [], message: '', error: err.message });
            return;
          }
          // Se filtra el dataset local con la lógica de respaldo
          const products = filterProducts({
            products: catalogRef.current, categories, stores, favorites: [],
            searchTerm: term, selectedCategory: category, selectedStore: store, activeTab: 'catalog'
          });
          setFiltered({
            products,
            message: products.length === 0 ? 'No se encontraron productos con los filtros seleccionados' : '',
            error: ''
          });
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, searchChanged ? SEARCH_DEBOUNCE_MS : 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // categories/stores solo se usan en el respaldo local
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, category, store, refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);

  const addProduct = async (productData) => {
    const newId = Math.max(0, ...catalog.map(p => p.id)) + 1;
    const newProd = { id: newId, ...productData };
    setCatalog(prev => [newProd, ...prev]);
    try {
      await adminApi.addProduct(productData);
      refresh();
    } catch (e) {}
  };

  const updateProduct = async (id, productData) => {
    setCatalog(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
    try {
      await adminApi.updateProduct(id, productData);
      refresh();
    } catch (e) {}
  };

  const deleteProduct = async (id) => {
    setCatalog(prev => prev.filter(p => p.id !== id));
    try {
      await adminApi.deleteProduct(id);
      refresh();
    } catch (e) {}
  };

  return {
    products: filtersActive ? filtered.products : catalog,
    catalog,
    stores,
    categories,
    message: filtersActive ? filtered.message : '',
    error: filtersActive ? filtered.error : '',
    loading,
    addProduct,
    updateProduct,
    deleteProduct
  };
}
