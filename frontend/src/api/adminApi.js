import { request } from './httpClient';

export const adminApi = {
  addProduct: (productData) => request('/admin/products', { method: 'POST', body: JSON.stringify(productData) }),
  updateProduct: (id, productData) => request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' })
};
