import { useState } from 'react';
import { favoriteApi } from '../api/favoriteApi';

export function useFavorites({ user, onAuthRequired }) {
  const [favorites, setFavorites] = useState([1, 3]); // default initial fav product ids

  const toggleFavorite = async (productId) => {
    if (!user) {
      onAuthRequired();
      return;
    }
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
    try {
      await favoriteApi.toggleFavorite(productId);
    } catch (e) {
      // Ignored dev fallback
    }
  };

  return { favorites, toggleFavorite };
}
