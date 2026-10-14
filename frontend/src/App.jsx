import React, { useState } from 'react';
import Header from './components/layout/Header';
import HeroBanner from './components/layout/HeroBanner';
import ProductCard from './components/products/ProductCard';
import ProductDetailModal from './components/products/ProductDetailModal';
import AuthModal from './components/auth/AuthModal';
import AdminPanel from './components/admin/AdminPanel';
import { useAuth } from './context/AuthContext';
import { useProducts } from './hooks/useProducts';
import { useFavorites } from './hooks/useFavorites';
import { useReviews } from './hooks/useReviews';
import { useProductDetail } from './hooks/useProductDetail';
import { filterProducts } from './utils/filterProducts';
import { Store, AlertCircle } from 'lucide-react';

export default function App() {
  const { user, login, register, logout } = useAuth();
  const { reviews, addReview } = useReviews(user);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog', 'offers', 'favorites'

  const {
    products, catalog, stores, categories, message, error, addProduct, updateProduct, deleteProduct
  } = useProducts({ search: searchTerm, category: selectedCategory, store: selectedStore });

  const { setSelectedProduct, modalProduct, modalReviews, handleAddReview } = useProductDetail({ reviews, addReview });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const { favorites, toggleFavorite } = useFavorites({ user, onAuthRequired: () => setIsAuthOpen(true) });

  // Búsqueda, tienda y categoría ya vienen resueltas por el backend; aquí solo se aplican las pestañas
  const filteredProducts = filterProducts({
    products, categories, stores, favorites, searchTerm: '', selectedCategory: 'all', selectedStore: 'all', activeTab
  });

  const emptyText = error
    || (activeTab === 'catalog' && message)
    || 'Intenta cambiar los términos de búsqueda o selecciona otra categoría o tienda.';

  return (
    <div className="app-root">
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={logout}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
      />

      <HeroBanner />

      <main className="main-container">
        
        {/* Navigation & Filters Bar */}
        <div className="filters-bar">
          
          {/* Category Chips */}
          <div className="category-scroll">
            <button 
              className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              🏷️ Todos ({catalog.length})
            </button>
            {categories.map(c => (
              <button 
                key={c.id} 
                className={`category-chip ${selectedCategory === c.slug ? 'active' : ''}`}
                onClick={() => setSelectedCategory(c.slug)}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>

          {/* Store Filter Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Store size={16} color="#64748b" />
            <select 
              className="search-input" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
            >
              <option value="all">Todas las Tiendas</option>
              {stores.map(s => (
                <option key={s.id} value={s.code}>{s.logo} {s.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* View Header */}
        <div className="section-header">
          <h2 className="section-title">
            {activeTab === 'offers' && <>🔥 Ofertas de la Semana en Popayán</>}
            {activeTab === 'favorites' && <>❤️ Tus Productos Guardados</>}
            {activeTab === 'catalog' && <>📦 Catálogo de Productos y Comparativa</>}
          </h2>

          <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>
            Mostrando {filteredProducts.length} productos
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '3rem 1.5rem', borderRadius: '16px', textAlign: 'center', color: '#64748b' }}>
            <AlertCircle size={48} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.3rem' }}>
              No se encontraron productos
            </h3>
            <p style={{ fontSize: '0.9rem' }}>
              {emptyText}
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(p => (
              <ProductCard 
                key={p.id}
                product={p}
                stores={stores}
                onSelectProduct={(prod) => setSelectedProduct(prod)}
                isFavorite={favorites.includes(p.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

      </main>

      {/* Modals */}
      <ProductDetailModal 
        product={modalProduct}
        stores={stores}
        reviews={modalReviews}
        onClose={() => setSelectedProduct(null)}
        onAddReview={handleAddReview}
        user={user}
        onOpenAuth={() => {
          setSelectedProduct(null);
          setIsAuthOpen(true);
        }}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={login}
        onRegister={register}
      />

      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={catalog}
        categories={categories}
        stores={stores}
        onAddProduct={addProduct}
        onUpdateProduct={updateProduct}
        onDeleteProduct={deleteProduct}
      />
    </div>
  );
}
