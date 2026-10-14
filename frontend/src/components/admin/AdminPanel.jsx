import React, { useState } from 'react';
import { X, Plus, Trash2, Edit3, Shield, Check } from 'lucide-react';

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  products = [], 
  categories = [], 
  stores = [], 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}) {
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [unit, setUnit] = useState('1 Unidad');
  const [imageUrl, setImageUrl] = useState('');
  const [d1Price, setD1Price] = useState(4000);
  const [olimpicaPrice, setOlimpicaPrice] = useState(4200);

  if (!isOpen) return null;

  const handleStartEdit = (prod) => {
    setEditingId(prod.id);
    setName(prod.name);
    setDescription(prod.description || '');
    setCategoryId(prod.category_id || 1);
    setUnit(prod.unit || '1 Unidad');
    setImageUrl(prod.image_url || '');

    const d1Pr = prod.prices?.find(p => p.store_id === 1);
    const oliPr = prod.prices?.find(p => p.store_id === 2);
    setD1Price(d1Pr ? d1Pr.price : 4000);
    setOlimpicaPrice(oliPr ? oliPr.price : 4200);
  };

  const handleResetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setCategoryId(1);
    setUnit('1 Unidad');
    setImageUrl('');
    setD1Price(4000);
    setOlimpicaPrice(4200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productPayload = {
      name,
      description,
      category_id: parseInt(categoryId),
      unit,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      prices: [
        { store_id: 1, price: parseFloat(d1Price), previous_price: parseFloat(d1Price), is_offer: false },
        { store_id: 2, price: parseFloat(olimpicaPrice), previous_price: parseFloat(olimpicaPrice), is_offer: false }
      ]
    };

    if (editingId) {
      await onUpdateProduct(editingId, productPayload);
    } else {
      await onAddProduct(productPayload);
    }
    handleResetForm();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '840px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Shield size={24} color="#6366f1" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
            Panel de Administración de Catálogo (Popayán)
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          {/* Form */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem', color: '#334155' }}>
              {editingId ? '✏️ Editar Producto' : '➕ Agregar Nuevo Producto'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>Nombre del Producto</label>
                <input 
                  type="text" 
                  className="search-input" 
                  style={{ borderRadius: '8px', paddingLeft: '0.8rem' }} 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>Categoría</label>
                  <select 
                    className="search-input" 
                    style={{ borderRadius: '8px', paddingLeft: '0.8rem' }}
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>Presentación / Unidad</label>
                  <input 
                    type="text" 
                    className="search-input" 
                    style={{ borderRadius: '8px', paddingLeft: '0.8rem' }} 
                    value={unit} 
                    onChange={(e) => setUnit(e.target.value)} 
                    placeholder="Ej: Bolsa 1 kg"
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>Precio Tiendas D1 ($ COP)</label>
                  <input 
                    type="number" 
                    className="search-input" 
                    style={{ borderRadius: '8px', paddingLeft: '0.8rem' }} 
                    value={d1Price} 
                    onChange={(e) => setD1Price(e.target.value)} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>Precio Olímpica ($ COP)</label>
                  <input 
                    type="number" 
                    className="search-input" 
                    style={{ borderRadius: '8px', paddingLeft: '0.8rem' }} 
                    value={olimpicaPrice} 
                    onChange={(e) => setOlimpicaPrice(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>URL de Imagen</label>
                <input 
                  type="url" 
                  className="search-input" 
                  style={{ borderRadius: '8px', paddingLeft: '0.8rem' }} 
                  placeholder="https://..."
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="nav-btn nav-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Check size={16} /> {editingId ? 'Guardar Cambios' : 'Crear Producto'}
                </button>

                {editingId && (
                  <button type="button" onClick={handleResetForm} className="nav-btn" style={{ background: '#e2e8f0' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Product list for management */}
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem', color: '#334155' }}>
              📦 Productos en Catálogo ({products.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {products.map(p => (
                <div key={p.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <img src={p.image_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.unit}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button className="nav-btn" style={{ padding: '0.3rem', color: '#6366f1' }} onClick={() => handleStartEdit(p)} title="Editar">
                      <Edit3 size={16} />
                    </button>
                    <button className="nav-btn" style={{ padding: '0.3rem', color: '#ef4444' }} onClick={() => onDeleteProduct(p.id)} title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
