import React from 'react';
import './Hero.css';
import heroImg from '../assets/tea_garden_hero.png';

const Hero = () => {
  return (
    <>
      {/* ── Hero ── */}
      <section className="hero" id="about">

        {/* Left: text panel */}
        <div className="hero-left">
          <div className="hero-tag">
            <span className="tag-dot" />
            Premium Darjeeling · Est. 2020
          </div>

          <h1 className="hero-title">
            The Finest<br />
            <span className="hero-title-accent">Darjeeling</span><br />
            Teas, Delivered
          </h1>

          <p className="hero-subtitle">
            Hand‑picked from mist‑covered estates at&nbsp;2000&nbsp;m elevation.
            Pure, artisanal &amp; shipped fresh to your door.
          </p>

          <div className="hero-cta-row">
            <a href="#catalog" className="btn btn-primary hero-btn">Shop Now</a>
            <a href="#about" className="hero-link">Our Story →</a>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">12+</span>
              <span className="stat-label">Varieties</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Pure Leaf</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">Pan‑India</span>
              <span className="stat-label">Delivery</span>
            </div>
          </div>
        </div>

        {/* Right: image panel with shape clip */}
        <div className="hero-right">
          <div className="hero-img-frame">
            <img src={heroImg} alt="Darjeeling tea garden" className="hero-img" />
            <div className="hero-img-overlay" />
          </div>

          {/* Floating badge */}
          <div className="hero-badge">
            <span className="badge-emoji">🍃</span>
            <div>
              <strong>First Flush</strong>
              <span>Season 2025</span>
            </div>
          </div>

          {/* Decorative blobs */}
          <div className="blob blob-1" />
          <div className="blob blob-2" />
        </div>
      </section>

      {/* ── Feature strip ── */}
      <div className="feature-strip">
        {[
          { icon: '🌿', label: 'Single Estate', desc: 'Direct from the garden' },
          { icon: '✈️', label: 'Fast Shipping', desc: 'Delivered in 3–5 days' },
          { icon: '🏆', label: 'Award Winning', desc: 'Certified quality teas' },
          { icon: '♻️', label: 'Eco Packed', desc: 'Sustainable packaging' },
        ].map((f) => (
          <div className="feature-item" key={f.label}>
            <span className="feature-icon">{f.icon}</span>
            <div>
              <strong>{f.label}</strong>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Hero;
