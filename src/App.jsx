import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import ProtectedAdmin from './components/ProtectedAdmin';

const WHATSAPP_NUMBER = '919832251149';

function App() {
  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hello Cookies Tea! I'd like to know more about your Darjeeling teas. 🍃");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <Catalog />
            </main>
          } />
          <Route path="/admin" element={<ProtectedAdmin />} />
        </Routes>
        <Footer whatsappNumber={WHATSAPP_NUMBER} />

        {/* Floating WhatsApp Button */}
        <button className="whatsapp-float" onClick={openWhatsApp} title="Chat with us on WhatsApp">
          <MessageCircle size={26} fill="white" />
        </button>
      </div>
    </Router>
  );
}

export default App;

