import { useState } from 'react';
import { reviewApi } from '../api/reviewApi';
import { initialReviews } from '../data/mockData';

export function useReviews(user) {
  const [reviews, setReviews] = useState(initialReviews);

  // Devuelve true si el backend guardó la reseña; si no, queda solo en memoria local (respaldo)
  const addReview = async (productId, rating, comment) => {
    try {
      await reviewApi.addReview(productId, rating, comment);
      return true;
    } catch (e) {
      const localReview = {
        id: Date.now(),
        user_id: user ? user.id : 1,
        user_name: user ? user.name : 'Usuario Popayán',
        product_id: productId,
        rating,
        comment,
        created_at: new Date().toISOString(),
        local: true
      };
      setReviews(prev => [localReview, ...prev]);
      return false;
    }
  };

  return { reviews, addReview };
}
