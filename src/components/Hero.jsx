import React from 'react';
import './Hero.css';
import heroImg from '../assets/tea_garden_hero.png';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <img src={heroImg} alt="Darjeeling Tea Garden" />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-container">
        <div className="hero-content-wrapper">
          <span className="hero-pretitle">Premium Darjeeling Collection</span>
          <h1 className="hero-title">
            Amazing Variety <br />
            Of Teas Starting <br />
            Just ₹499
          </h1>
          <div className="hero-actions">
            <a href="#catalog" className="btn btn-primary hero-btn">
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
