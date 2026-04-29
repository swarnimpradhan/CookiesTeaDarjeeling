import React from 'react';
import { MessageCircle } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product, whatsappNumber }) => {
  const { id, name, flush, description, price, imageUrl, tags } = product;

  const handleWhatsAppOrder = () => {
    const message = `Hello Cookies Darjeeling Tea! I am interested in ordering: ${name} (${flush}).`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={imageUrl} alt={name} className="product-image" />
        <div className="product-badges">
          <span className="badge badge-flush">{flush}</span>
        </div>
      </div>
      <div className="product-content">
        <div className="product-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-footer">
          <span className="product-price">{price}</span>
          <button className="btn btn-primary btn-order" onClick={handleWhatsAppOrder}>
            <MessageCircle size={18} /> Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
