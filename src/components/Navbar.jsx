import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-content">
        <a href="/" className="logo-container">
          <img src="/logo.JPG" alt="Cookies Darjeeling Tea Logo" className="logo-img" />
          <span className="logo-text">Cookies Tea</span>
        </a>

        <div className="nav-links desktop-only">
          <a href="#about" className="nav-link">Our Story</a>
          <a href="#catalog" className="nav-link">The Catalog</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>

        <div className="nav-actions">
          <a href="#catalog" className="btn btn-primary desktop-only">Shop Now</a>
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <a href="#about" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Our Story</a>
          <a href="#catalog" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>The Catalog</a>
          <a href="#contact" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
