import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { supabase } from '../lib/supabase';
import { Loader } from 'lucide-react';
import './Catalog.css';

const Catalog = ({ whatsappNumber }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      
      // Map Supabase fields to component props if necessary
      const formattedProducts = data?.map(p => ({
        ...p,
        flush: p.category, // Assuming category is used for flush type
        imageUrl: p.image_url,
        price: `₹${p.price} / 100g`
      })) || [];

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="catalog" id="catalog">
      <div className="container">
        <div className="catalog-header">
          <h2 className="catalog-title">The Darjeeling Catalog</h2>
          <p className="catalog-subtitle">Explore our carefully curated selection of the finest Darjeeling flushes.</p>
          <div className="catalog-divider"></div>
        </div>
        
        {loading ? (
          <div className="loading-state">
            <Loader className="spin" size={40} />
            <p>Loading the finest Darjeeling teas...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="catalog-grid">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                whatsappNumber={whatsappNumber} 
              />
            ))}
          </div>
        ) : (
          <div className="empty-catalog">
            <p>No products found in the catalog. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Catalog;
