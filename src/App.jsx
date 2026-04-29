import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Footer from './components/Footer';

function App() {
  const whatsappNumber = '919832251149';

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Catalog whatsappNumber={whatsappNumber} />
      </main>
      <Footer whatsappNumber={whatsappNumber} />
    </div>
  );
}

export default App;
