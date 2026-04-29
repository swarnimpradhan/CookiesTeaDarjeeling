import React from 'react';
import { ArrowRight } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="about">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <span className="hero-subtitle animate-fade-in">Misty Hills of Darjeeling</span>
        <h1 className="hero-title animate-fade-in delay-1">
          Experience the Champagne <br />
          <span className="text-accent">of Teas</span>
        </h1>
        <p className="hero-description animate-fade-in delay-2">
          From the finest tea estates directly to your cup. Discover our exquisite selection of First Flush, Second Flush, and Autumn harvests, carefully handpicked for perfection.
        </p>
        <div className="hero-actions animate-fade-in delay-3">
          <a href="#catalog" className="btn btn-primary">
            Explore Collection <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
