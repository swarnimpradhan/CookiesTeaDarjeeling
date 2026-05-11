import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const ProtectedAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('admin_auth') === 'true'
  );

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
      <div className="admin-logout-bar">
        <span>🔒 Admin Session Active</span>
        <button onClick={handleLogout} className="logout-btn">Sign Out</button>
      </div>
      <AdminDashboard />
    </>
  );
};

export default ProtectedAdmin;
