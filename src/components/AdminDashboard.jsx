import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Plus, Package, Image as ImageIcon, Loader } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'First Flush',
  });
  const [imageFile, setImageFile] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select an image');
      return;
    }

    try {
      setUploading(true);

      // 1. Upload Image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      // 2. Insert Product
      const { error: insertError } = await supabase
        .from('products')
        .insert([{
          ...newProduct,
          image_url: publicUrl,
          price: parseFloat(newProduct.price)
        }]);

      if (insertError) throw insertError;

      // Reset form
      setNewProduct({ name: '', description: '', price: '', category: 'First Flush' });
      setImageFile(null);
      fetchProducts();
      alert('Product added successfully!');
    } catch (error) {
      alert('Error adding product: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      alert('Error deleting product: ' + error.message);
    }
  };

  return (
    <div className="admin-dashboard container">
      <header className="admin-header">
        <h1><Package /> Product Management</h1>
        <p>Add or remove products from the main catalog</p>
      </header>

      <section className="add-product-section">
        <div className="admin-card">
          <h2><Plus /> Add New Product</h2>
          <form onSubmit={handleAddProduct} className="admin-form">
            <div className="form-group">
              <label>Product Name</label>
              <input 
                type="text" 
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required 
                placeholder="e.g. Silver Tips Imperial"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input 
                  type="number" 
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  required 
                  placeholder="e.g. 1200"
                />
              </div>
              <div className="form-group">
                <label>Flush Type</label>
                <select 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option>First Flush</option>
                  <option>Second Flush</option>
                  <option>Monsoon Flush</option>
                  <option>Autumn Flush</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                required 
                placeholder="Describe the flavor profile and origin..."
              />
            </div>

            <div className="form-group">
              <label>Product Image</label>
              <div className="file-input-wrapper">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImageFile(e.target.files[0])}
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="file-label">
                  <ImageIcon size={20} />
                  {imageFile ? imageFile.name : 'Choose high-quality photo'}
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? <><Loader className="spin" /> Adding...</> : 'Add to Catalog'}
            </button>
          </form>
        </div>
      </section>

      <section className="product-list-section">
        <h2>Current Inventory</h2>
        {loading ? (
          <div className="loading-state"><Loader className="spin" /> Loading products...</div>
        ) : (
          <div className="admin-grid">
            {products.map((product) => (
              <div key={product.id} className="admin-product-card">
                <img src={product.image_url} alt={product.name} />
                <div className="admin-product-info">
                  <h3>{product.name}</h3>
                  <p className="admin-price">₹{product.price}</p>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="btn-delete"
                    title="Delete Product"
                  >
                    <Trash2 size={18} />
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
