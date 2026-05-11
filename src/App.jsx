import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const whatsappNumber = '919832251149';

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <Catalog whatsappNumber={whatsappNumber} />
            </main>
          } />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer whatsappNumber={whatsappNumber} />
      </div>
    </Router>
  );
}

export default App;
