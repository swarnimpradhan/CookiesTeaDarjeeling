import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Plus, Package, Link as LinkIcon, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'First Flush',
    image_url: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      setMessage({ type: 'error', text: 'Could not load products: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!newProduct.name.trim()) {
      setMessage({ type: 'error', text: 'Product name is required.' }); return;
    }
    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      setMessage({ type: 'error', text: 'A valid price is required.' }); return;
    }
    if (!newProduct.image_url.trim()) {
      setMessage({ type: 'error', text: 'Image URL is required.' }); return;
    }

    try {
      setAdding(true);

      const payload = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        image_url: newProduct.image_url.trim(),
      };

      console.log('Inserting product:', payload);

      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        // Friendly hint for RLS policy block
        const isRLS = error.code === '42501' || error.message?.includes('row-level security') || error.message?.includes('policy');
        const hint = isRLS
          ? ' ⚠️ Hint: Go to Supabase → Table Editor → products → Policies, and add an INSERT policy that allows "anon" role.'
          : '';
        throw new Error(`${error.message} (code: ${error.code})${hint}`);
      }

      console.log('Inserted:', data);
      setMessage({ type: 'success', text: `✅ "${newProduct.name}" added to catalog!` });
      setNewProduct({ name: '', description: '', price: '', category: 'First Flush', image_url: '' });
      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: `"${name}" removed from catalog.` });
      fetchProducts();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting product: ' + error.message });
    }
  };

  return (
    <div className="admin-dashboard container">
      <header className="admin-header">
        <h1><Package size={28} /> Product Management</h1>
        <p>Add or remove products from the main catalog</p>
      </header>

      {message && (
        <div className={`admin-message ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
          <button onClick={() => setMessage(null)} className="msg-close">✕</button>
        </div>
      )}

      <section className="add-product-section">
        <div className="admin-card">
          <h2><Plus size={20} /> Add New Product</h2>
          <form onSubmit={handleAddProduct} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                  placeholder="e.g. Silver Tips Imperial"
                />
              </div>
              <div className="form-group">
                <label>Flush / Category *</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  <option>First Flush</option>
                  <option>Second Flush</option>
                  <option>Monsoon Flush</option>
                  <option>Autumn Flush</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                  placeholder="e.g. 1200"
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="text"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  placeholder="Paste image link (https://...)"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Describe the flavor profile and origin..."
              />
            </div>

            {newProduct.image_url && (
              <div className="image-preview">
                <img src={newProduct.image_url} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={adding}>
              {adding ? <><Loader className="spin" size={18} /> Adding...</> : <><Plus size={18} /> Add to Catalog</>}
            </button>
          </form>
        </div>
      </section>

      <section className="product-list-section">
        <h2>Current Inventory ({products.length})</h2>
        {loading ? (
          <div className="loading-state"><Loader className="spin" size={30} /> Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-admin">No products yet. Add your first product above!</div>
        ) : (
          <div className="admin-grid">
            {products.map((product) => (
              <div key={product.id} className="admin-product-card">
                <img src={product.image_url} alt={product.name} onError={(e) => { e.target.src = 'https://placehold.co/300x200?text=No+Image'; }} />
                <div className="admin-product-info">
                  <span className="admin-cat">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p className="admin-price">₹{product.price}</p>
                  <button
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    className="btn-delete"
                    title="Delete Product"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
