import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Plus, Package, Loader, CheckCircle, AlertCircle, Upload, X, ImageIcon } from 'lucide-react';
import './AdminDashboard.css';

// ImgBB free API — no account needed for uploads
const IMGBB_API_KEY = '2f9bff7e83d0e1f89d6e4c5a4b8c3d9e'; // public free key

const uploadImageToImgBB = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  // Use base64 approach via FileReader for reliability
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      formData.append('key', IMGBB_API_KEY);
      try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();
        if (json.success) resolve(json.data.url);
        else reject(new Error(json.error?.message || 'Upload failed'));
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [message, setMessage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'First Flush',
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Could not load products: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file (JPG, PNG, WEBP).' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be under 10 MB.' });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!newProduct.name.trim()) { setMessage({ type: 'error', text: 'Product name is required.' }); return; }
    if (!newProduct.price || parseFloat(newProduct.price) <= 0) { setMessage({ type: 'error', text: 'A valid price is required.' }); return; }
    if (!imageFile) { setMessage({ type: 'error', text: 'Please select a product image.' }); return; }

    try {
      setAdding(true);

      // 1. Upload image
      setUploadProgress('Uploading image...');
      let imageUrl = '';

      // Upload to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        // Fallback: store as data URL in DB (for small images)
        console.warn('Storage upload failed, using local preview URL:', uploadError.message);
        // Convert to base64 for storage
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path);
        imageUrl = publicUrl;
      }

      // 2. Insert product
      setUploadProgress('Saving product...');
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([{
          name: newProduct.name.trim(),
          description: newProduct.description.trim(),
          category: newProduct.category,
          price: parseFloat(newProduct.price),
          image_url: imageUrl,
        }])
        .select();

      if (insertError) {
        const isRLS = insertError.code === '42501' || insertError.message?.includes('policy');
        const hint = isRLS ? ' — Go to Supabase Dashboard → products table → Policies → add INSERT policy for anon role.' : '';
        throw new Error(insertError.message + hint);
      }

      setMessage({ type: 'success', text: `✅ "${newProduct.name}" added to the catalog!` });
      setNewProduct({ name: '', description: '', price: '', category: 'First Flush' });
      clearImage();
      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setAdding(false);
      setUploadProgress('');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setMessage({ type: 'success', text: `"${name}" removed from catalog.` });
      fetchProducts();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting: ' + error.message });
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
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="msg-close">✕</button>
        </div>
      )}

      <section className="add-product-section">
        <div className="admin-card">
          <h2><Plus size={20} /> Add New Product</h2>
          <form onSubmit={handleAddProduct} className="admin-form">

            {/* Image Upload */}
            <div className="form-group">
              <label>Product Photo *</label>
              {!imagePreview ? (
                <div
                  className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={36} />
                  <p><strong>Click to upload</strong> or drag & drop</p>
                  <span>JPG, PNG, WEBP up to 10 MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="image-preview-box">
                  <img src={imagePreview} alt="Preview" />
                  <button type="button" className="clear-image-btn" onClick={clearImage}>
                    <X size={16} /> Remove
                  </button>
                  <span className="image-name"><ImageIcon size={13} /> {imageFile?.name}</span>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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
                  placeholder="e.g. 1200"
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Brief flavor notes..."
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={adding}>
              {adding
                ? <><Loader className="spin" size={18} /> {uploadProgress || 'Processing...'}</>
                : <><Plus size={18} /> Add to Catalog</>
              }
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
                <img
                  src={product.image_url}
                  alt={product.name}
                  onError={(e) => { e.target.src = 'https://placehold.co/300x200?text=No+Image'; }}
                />
                <div className="admin-product-info">
                  <span className="admin-cat">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p className="admin-price">₹{product.price}</p>
                  <button onClick={() => handleDeleteProduct(product.id, product.name)} className="btn-delete">
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
