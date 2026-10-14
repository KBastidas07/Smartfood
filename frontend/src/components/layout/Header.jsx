import React from 'react';
import { Search, Heart, User, Shield, Sparkles, MapPin, Tag } from 'lucide-react';

export default function Header({ 
  searchTerm, 
  setSearchTerm, 
  user, 
  onOpenAuth, 
  onLogout, 
  onOpenAdmin, 
  activeTab, 
  setActiveTab,
  favoritesCount 
}) {
  return (
    <header className="app-header">
      <div className="header-container">
        
        {/* Brand */}
        <div className="brand-logo" onClick={() => setActiveTab('catalog')}>
          <span style={{ fontSize: '1.6rem' }}>🛒</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>SmartFood</span>
              <span className="brand-badge">Popayán</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500, marginTop: '-3px' }}>
              Comparador de Supermercados
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="header-search">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por producto (ej: Arroz, Leche, Aceite)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Actions & Navigation */}
        <div className="header-actions">
          <button 
            className={`nav-btn ${activeTab === 'offers' ? 'nav-btn-primary' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            <Tag size={16} />
            <span>Ofertas</span>
          </button>

          <button 
            className={`nav-btn ${activeTab === 'favorites' ? 'nav-btn-primary' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart size={16} fill={activeTab === 'favorites' ? 'currentColor' : 'none'} />
            <span>Favoritos</span>
            {favoritesCount > 0 && (
              <span style={{ background: '#ef4444', color: 'white', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>
                {favoritesCount}
              </span>
            )}
          </button>

          {user && user.role === 'admin' && (
            <button className="nav-btn nav-btn-admin" onClick={onOpenAdmin}>
              <Shield size={16} />
              <span>Admin Panel</span>
            </button>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                👋 {user.name.split(' ')[0]}
              </div>
              <button className="nav-btn" onClick={onLogout} style={{ fontSize: '0.8rem', color: '#ef4444' }}>
                Salir
              </button>
            </div>
          ) : (
            <button className="nav-btn nav-btn-primary" onClick={onOpenAuth}>
              <User size={16} />
              <span>Ingresar / Registro</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
