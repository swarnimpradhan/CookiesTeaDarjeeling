import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { supabase } from '../lib/supabase';
import { Loader } from 'lucide-react';
import './Catalog.css';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState(5000);
  const [activeCategory, setActiveCategory] = useState('All');

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
      
      const formattedProducts = data?.map(p => ({
        ...p,
        flush: p.category,
        imageUrl: p.image_url,
        priceDisplay: `₹${p.price}`
      })) || [];

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'First Flush', 'Second Flush', 'Autumn Flush', 'Monsoon Flush'];
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesPrice = p.price <= priceRange;
    return matchesCategory && matchesPrice;
  });

  return (
    <section className="catalog" id="catalog">
      <div className="container catalog-container">
        <aside className="catalog-sidebar">
          <div className="sidebar-widget">
            <h3 className="widget-title">Filter by price</h3>
            <div className="price-filter">
              <input 
                type="range" 
                min="0" 
                max="5000" 
                value={priceRange} 
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="range-slider"
              />
              <div className="price-range-labels">
                <span>₹0</span>
                <span>₹{priceRange}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-widget">
            <h3 className="widget-title">Categories</h3>
            <ul className="category-list">
              {categories.map(cat => (
                <li key={cat}>
                  <button 
                    className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                    <span className="cat-count">
                      ({cat === 'All' ? products.length : products.filter(p => p.category === cat).length})
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-widget promo-widget">
            <div className="promo-card">
              <h4 className="promo-title">✨ Freshly Picked Floater</h4>
              {products.length > 0 ? (
                <div className="floater-item" onClick={() => {
                  const p = products[0];
                  const msg = `Hello! I'd like to order *${p.name}* (${p.flush}) from Cookies Darjeeling Tea. Please let me know availability and delivery details. 🍃`;
                  window.open(`https://wa.me/919832251149?text=${encodeURIComponent(msg)}`, '_blank');
                }}>
                  <img src={products[0].imageUrl} alt={products[0].name} className="floater-img" onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Tea'; }} />
                  <span className="floater-badge">Latest Harvest</span>
                  <div className="floater-info">
                    <h5>{products[0].name}</h5>
                    <p className="floater-price">₹{products[0].price} <span className="price-unit">per 100g</span></p>
                    <span className="floater-cta">Order Now →</span>
                  </div>
                </div>
              ) : (
                <img src="/tea_garden_hero.png" alt="Tea Deal" className="promo-img" />
              )}
            </div>
          </div>
        </aside>

        <main className="catalog-main">
          <header className="catalog-main-header">
            <div className="breadcrumb">Home / Shop</div>
            <h1 className="main-title">Store</h1>
            <div className="catalog-meta">
              <span className="result-count">Showing all {filteredProducts.length} results</span>
              <div className="sort-wrapper">
                <select className="sort-select">
                  <option>Default sorting</option>
                  <option>Sort by price: low to high</option>
                  <option>Sort by price: high to low</option>
                </select>
              </div>
            </div>
          </header>
          
          {loading ? (
            <div className="loading-state">
              <Loader className="spin" size={40} />
              <p>Loading the finest Darjeeling teas...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="catalog-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="empty-catalog">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default Catalog;
