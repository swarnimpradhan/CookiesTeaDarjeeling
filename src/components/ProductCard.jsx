import React from 'react';
import { Star, MessageCircle } from 'lucide-react';
import './ProductCard.css';

const WHATSAPP_NUMBER = '919832251149';

const ProductCard = ({ product }) => {
  const { name, flush, price, imageUrl, description } = product;

  const handleWhatsAppOrder = () => {
    const message = `Hello! I'd like to order *${name}* (${flush}) from Cookies Darjeeling Tea. Please let me know availability and delivery details. 🍃`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  return (
    <div className="product-card">
      <div className="product-image-box">
        <img
          src={imageUrl}
          alt={name}
          className="product-image"
          onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Tea'; }}
        />
        <span className="flush-badge">{flush}</span>
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        {description && <p className="product-desc">{description}</p>}
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={13} fill={i < 4 ? '#4a6741' : 'none'} color={i < 4 ? '#4a6741' : '#ccc'} />
          ))}
        </div>
        <div className="product-price">₹{price}</div>
        <button className="btn-order-whatsapp" onClick={handleWhatsAppOrder}>
          <MessageCircle size={18} />
          Order on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
