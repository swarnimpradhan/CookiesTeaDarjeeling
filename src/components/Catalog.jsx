import React from 'react';
import ProductCard from './ProductCard';
import './Catalog.css';

const products = [
  {
    id: 1,
    name: "Spring Valley Premium",
    flush: "First Flush",
    description: "Harvested in early spring, this premium tea offers a delicate, floral aroma with a light golden infusion and slightly astringent, fresh finish.",
    price: "₹1,200 / 100g",
    imageUrl: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cbf9?q=80&w=800&auto=format&fit=crop",
    tags: ["Floral", "Delicate", "Spring"]
  },
  {
    id: 2,
    name: "Muscatel Royale",
    flush: "Second Flush",
    description: "The 'Champagne of Teas'. A mature, full-bodied summer harvest renowned for its distinct, sweet muscatel grape flavor and rich amber hue.",
    price: "₹1,500 / 100g",
    imageUrl: "https://images.unsplash.com/photo-1576092762791-dd9e2220cad1?q=80&w=800&auto=format&fit=crop",
    tags: ["Muscatel", "Full-bodied", "Fruity"]
  },
  {
    id: 3,
    name: "Monsoon Mist",
    flush: "Monsoon Flush",
    description: "Grown during the heavy rains, this robust tea provides an earthy, strong infusion. Perfect for those who prefer a bold, intense cup or brewing chai.",
    price: "₹800 / 100g",
    imageUrl: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=800&auto=format&fit=crop",
    tags: ["Earthy", "Robust", "Strong"]
  },
  {
    id: 4,
    name: "Autumn Amber",
    flush: "Autumn Flush",
    description: "The final harvest of the year yields a smooth, mellow cup with a heavier body and a comforting, slightly sweet, 'cooked' fruit profile.",
    price: "₹1,000 / 100g",
    imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc5096fd80f?q=80&w=800&auto=format&fit=crop",
    tags: ["Smooth", "Mellow", "Rich"]
  }
];

const Catalog = ({ whatsappNumber }) => {
  return (
    <section className="catalog" id="catalog">
      <div className="container">
        <div className="catalog-header">
          <h2 className="catalog-title">The Darjeeling Catalog</h2>
          <p className="catalog-subtitle">Explore our carefully curated selection of the finest Darjeeling flushes.</p>
          <div className="catalog-divider"></div>
        </div>
        
        <div className="catalog-grid">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              whatsappNumber={whatsappNumber} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Catalog;
