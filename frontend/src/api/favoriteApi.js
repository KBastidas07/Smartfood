import { request } from './httpClient';

export const favoriteApi = {
  getFavorites: () => request('/favorites'),
  toggleFavorite: (productId) => request('/favorites/toggle', { method: 'POST', body: JSON.stringify({ product_id: productId }) })
};
