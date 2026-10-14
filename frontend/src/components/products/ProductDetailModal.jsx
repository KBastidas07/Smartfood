import React, { useState } from 'react';
import { X, Star, Send, TrendingDown, Store, CheckCircle, MessageSquare } from 'lucide-react';

export default function ProductDetailModal({ 
  product, 
  stores = [], 
  reviews = [], 
  onClose, 
  onAddReview, 
  user,
  onOpenAuth 
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const { id, name, description, unit, image_url, prices = [] } = product;

  // Sorting prices
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const lowest = sortedPrices[0];
  const highest = sortedPrices[sortedPrices.length - 1];
  const maxSavings = highest && lowest ? highest.price - lowest.price : 0;
  const savingsPct = highest && highest.price > 0 ? Math.round((maxSavings / highest.price) * 100) : 0;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    await onAddReview(id, rating, comment);
    setComment('');
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <img 
              src={image_url} 
              alt={name} 
              style={{ width: '100%', height: '230px', objectFit: 'cover', borderRadius: '12px' }} 
            />
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
              {unit}
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, margin: '0.2rem 0 0.5rem' }}>
              {name}
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
              {description || 'Producto seleccionado de la canasta familiar disponible en supermercados de Popayán.'}
            </p>

            {maxSavings > 0 && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.8rem 1rem', borderRadius: '12px', color: '#047857' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem' }}>
                  <TrendingDown size={18} /> ¡Ahorras hasta ${maxSavings.toLocaleString('es-CO')} ({savingsPct}%)!
                </div>
                <div style={{ fontSize: '0.8rem', color: '#065f46', marginTop: '2px' }}>
                  Comprando en la opción más económica de Popayán.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Price Comparison Table */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Store size={18} color="#059669" /> Comparativa Detallada por Supermercado
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {sortedPrices.map((pr, idx) => {
              const store = stores.find(s => s.id === pr.store_id);
              const isBest = idx === 0;

              return (
                <div 
                  key={pr.store_id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    border: isBest ? '2px solid #059669' : '1px solid #e2e8f0',
                    background: isBest ? '#f0fdf4' : '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{store ? store.logo : '🏬'}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {store ? store.name : 'Tienda en Popayán'}
                        {isBest && (
                          <span style={{ marginLeft: '8px', background: '#059669', color: 'white', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: 700 }}>
                            MEJOR OPCCIÓN
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {store ? store.address : 'Popayán'}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: isBest ? '#059669' : '#0f172a' }}>
                      ${pr.price.toLocaleString('es-CO')}
                    </div>
                    {pr.is_offer && (
                      <div style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 600 }}>
                        {pr.offer_description || 'Oferta activa'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MessageSquare size={18} color="#6366f1" /> Reseñas y Opiniones de Compradores
          </h3>

          {/* Add review form */}
          {user ? (
            <form onSubmit={handleSubmitReview} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tu Calificación:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={20} 
                    style={{ cursor: 'pointer' }}
                    fill={star <= rating ? '#f59e0b' : 'none'} 
                    color={star <= rating ? '#f59e0b' : '#94a3b8'}
                    onClick={() => setRating(star)} 
                  />
                ))}
              </div>

              <textarea 
                className="search-input" 
                style={{ borderRadius: '8px', minHeight: '70px', width: '100%', marginBottom: '0.5rem', resize: 'vertical' }}
                placeholder="Escribe tu opinión sobre el precio, calidad o disponibilidad en Popayán..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="nav-btn nav-btn-primary" 
                style={{ marginLeft: 'auto', fontSize: '0.85rem' }}
              >
                <Send size={14} /> Publicar Reseña
              </button>
            </form>
          ) : (
            <div style={{ background: '#f1f5f9', padding: '0.8rem 1rem', borderRadius: '10px', fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Inicia sesión para publicar tu opinión sobre este producto.</span>
              <button className="nav-btn nav-btn-primary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }} onClick={onOpenAuth}>
                Ingresar
              </button>
            </div>
          )}

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Sé el primero en dejar una reseña sobre este producto.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{r.user_name || 'Comprador local'}</span>
                    <div style={{ display: 'flex' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} fill={s <= r.rating ? '#f59e0b' : 'none'} color={s <= r.rating ? '#f59e0b' : '#cbd5e1'} />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#334155' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
