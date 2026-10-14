import React from 'react';
import { MapPin, TrendingDown, Store, CheckCircle } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="hero-section">
      <div className="hero-container">
        
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem' }}>
            <MapPin size={14} color="#a7f3d0" /> Cobertura Popayán: Tiendas D1 & Olímpica
          </div>
          
          <h1>Compara Precios y Ahorra en tus Compras</h1>
          <p>
            Centralizamos los mejores precios de la canasta familiar en Popayán en un solo lugar. Consulta ofertas, compara precios por tienda y lee reseñas reales de consumidores.
          </p>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-num">30%+</div>
              <div className="stat-label">Ahorro Promedio</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">D1 & Olímpica</div>
              <div className="stat-label">Tiendas Monitoreadas</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">100%</div>
              <div className="stat-label">Transparente & Libre</div>
            </div>
          </div>
        </div>

        <div className="hero-badge-container">
          <div style={{ color: '#d1fae5', fontSize: '0.85rem', fontWeight: 600 }}>Supermercados integrados:</div>
          <div className="store-pill-group">
            <div className="store-pill" style={{ borderLeft: '4px solid #dc2626' }}>
              <span>🏬</span> Tiendas D1
            </div>
            <div className="store-pill" style={{ borderLeft: '4px solid #2563eb' }}>
              <span>🛒</span> Olímpica Catay
            </div>
            <div className="store-pill" style={{ borderLeft: '4px solid #d97706' }}>
              <span>💛</span> Almacenes Éxito
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.8rem 1.2rem', borderRadius: '12px', fontSize: '0.85rem', color: '#e6f4ea', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <TrendingDown size={18} color="#a7f3d0" />
            <span>Precios actualizados para la canasta familiar de Popayán</span>
          </div>
        </div>

      </div>
    </div>
  );
}
