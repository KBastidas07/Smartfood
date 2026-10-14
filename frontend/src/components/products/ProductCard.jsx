import React from 'react';
import { Heart, Tag, Eye, TrendingDown, Star } from 'lucide-react';

export default function ProductCard({ 
  product, 
  stores = [], 
  onSelectProduct, 
  isFavorite, 
  onToggleFavorite 
}) {
  const { id, name, unit, image_url, prices = [] } = product;

  // Calculate lowest price & best store
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPrices.length > 0 ? sortedPrices[0] : null;
  const lowestStore = lowestPrice ? stores.find(s => s.id === lowestPrice.store_id) : null;
  const hasOffer = prices.some(p => p.is_offer);

  return (
    <div className="product-card">
      <div className="card-img-container">
        <img src={image_url} alt={name} className="card-img" />
        
        {hasOffer && (
          <div className="offer-badge">
            🔥 En Oferta
          </div>
        )}

        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(id);
          }}
          title={isFavorite ? 'Quitar de guardados' : 'Guardar producto'}
        >
          <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>
      </div>

      <div className="card-body">
        <div className="card-unit">{unit}</div>
        <h3 className="card-title">{name}</h3>

        {/* Price Comparison Summary Box */}
        <div className="price-comparison-box">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            Comparativa por Tienda:
          </div>

          {prices.map((pr) => {
            const store = stores.find(s => s.id === pr.store_id);
            const isLowest = lowestPrice && pr.store_id === lowestPrice.store_id;

            return (
              <div key={pr.store_id} className="price-row">
                <span className="store-name-tag">
                  <span>{store ? store.logo : '🏬'}</span>
                  <span>{store ? store.name : 'Tienda'}</span>
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {pr.is_offer && (
                    <span style={{ fontSize: '0.7rem', color: '#ea580c', background: '#ffedd5', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 700 }}>
                      OFERTA
                    </span>
                  )}
                  <span className={`price-val ${isLowest ? 'lowest' : ''}`}>
                    ${pr.price.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {lowestStore && (
          <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1rem' }}>
            <TrendingDown size={14} /> Mejor precio en {lowestStore.name}
          </div>
        )}

        <div className="card-footer-btns">
          <button className="btn-detail" onClick={() => onSelectProduct(product)}>
            <Eye size={16} inline="true" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Ver Comparación Completa & Reseñas
          </button>
        </div>
      </div>
    </div>
  );
}
