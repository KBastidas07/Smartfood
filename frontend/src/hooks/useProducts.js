import { useState, useEffect } from 'react';
import { productApi } from '../api/productApi';
import { adminApi } from '../api/adminApi';
import { initialProducts, initialStores, initialCategories } from '../data/mockData';

// Catálogo: carga desde el backend (con dataset local de respaldo) y acciones de administración
export function useProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [stores, setStores] = useState(initialStores);
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    productApi.getProducts()
      .then(res => {
        if (res.products) setProducts(res.products);
        if (res.stores) setStores(res.stores);
        if (res.categories) setCategories(res.categories);
      })
      .catch(() => {
        console.log('Backend server unreachable; using built-in Popayán dataset.');
      });
  }, []);

  const addProduct = async (productData) => {
    const newId = Math.max(...products.map(p => p.id)) + 1;
    const newProd = { id: newId, ...productData };
    setProducts(prev => [newProd, ...prev]);
    try {
      await adminApi.addProduct(productData);
    } catch (e) {}
  };

  const updateProduct = async (id, productData) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
    try {
      await adminApi.updateProduct(id, productData);
    } catch (e) {}
  };

  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await adminApi.deleteProduct(id);
    } catch (e) {}
  };

  return { products, stores, categories, addProduct, updateProduct, deleteProduct };
}
