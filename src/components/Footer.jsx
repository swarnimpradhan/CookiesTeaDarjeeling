import React from 'react';
import { Leaf, Globe, Link, MessageSquare, MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

const Footer = ({ whatsappNumber }) => {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/logo.JPG" alt="Cookies Darjeeling Tea Logo" className="footer-logo-img" />
            <h3>Cookies Tea</h3>
          </div>
          <p className="footer-description">
            Bringing the authentic taste and aroma of Darjeeling's finest tea estates directly to tea lovers anywhere in the world.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><Globe size={20} /></a>
            <a href="#" className="social-icon"><Link size={20} /></a>
            <a href="#" className="social-icon"><MessageSquare size={20} /></a>
          </div>
        </div>
        
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#about">Our Story</a></li>
            <li><a href="#catalog">The Catalog</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <ul>
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>Darjeeling, West Bengal, India</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>+{whatsappNumber.slice(0, 2)} {whatsappNumber.slice(2, 6)} {whatsappNumber.slice(6)}</span>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <span>hello@cookiestea.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Cookies Darjeeling Tea. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
