import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../api/productApi';

/*
 * RF05 (detalle del producto), frontend
 * SRP: este hook se encarga solo del producto seleccionado y de su detalle (backend o respaldo local).
 *      App.jsx quedó dedicado a componer la interfaz.
 * Por qué: la carga del detalle, la cancelación de respuestas antiguas y la mezcla con reseñas locales
 *      cambian por razones distintas a las del resto de la pantalla.
 */
// Producto seleccionado + su detalle del backend (con reseñas). Si el backend no responde,
// se usan el producto del listado y las reseñas locales.
export function useProductDetail({ reviews, addReview }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailVersion, setDetailVersion] = useState(0);

  const selectedId = selectedProduct ? selectedProduct.id : null;

  useEffect(() => {
    if (selectedId === null) return undefined;
    let cancelled = false;
    productApi.getProductDetail(selectedId)
      .then(res => { if (!cancelled) setDetail(res); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [selectedId, detailVersion]);

  const handleAddReview = useCallback(async (productId, rating, comment) => {
    const persisted = await addReview(productId, rating, comment);
    if (persisted) setDetailVersion(v => v + 1);
  }, [addReview]);

  const detailMatches = selectedProduct && detail && detail.product && detail.product.id === selectedProduct.id;

  const modalProduct = detailMatches
    ? { ...selectedProduct, ...detail.product }
    : selectedProduct;

  const modalReviews = detailMatches
    ? [...reviews.filter(r => r.local && r.product_id === selectedProduct.id), ...detail.reviews]
    : reviews.filter(r => selectedProduct && r.product_id === selectedProduct.id);

  return { selectedProduct, setSelectedProduct, modalProduct, modalReviews, handleAddReview };
}
