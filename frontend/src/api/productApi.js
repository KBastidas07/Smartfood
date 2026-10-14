import { request } from './httpClient';

export const productApi = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? '?' + query : ''}`);
  },
  getProductDetail: (id) => request(`/products/${id}`),
  getOffers: () => request('/products/offers')
};
