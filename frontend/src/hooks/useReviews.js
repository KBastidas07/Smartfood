import { useState } from 'react';
import { reviewApi } from '../api/reviewApi';
import { initialReviews } from '../data/mockData';

export function useReviews(user) {
  const [reviews, setReviews] = useState(initialReviews);

  const addReview = async (productId, rating, comment) => {
    const newRev = {
      id: Date.now(),
      user_id: user ? user.id : 1,
      user_name: user ? user.name : 'Usuario Popayán',
      product_id: productId,
      rating,
      comment,
      created_at: new Date().toISOString()
    };
    setReviews(prev => [newRev, ...prev]);
    try {
      await reviewApi.addReview(productId, rating, comment);
    } catch (e) {
      // Dev fallback
    }
  };

  return { reviews, addReview };
}
