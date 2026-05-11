import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Leaf } from 'lucide-react';
import './AdminLogin.css';

// Credentials loaded from .env — never exposed on GitHub
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      onLogin();
    } else {
      setError('Incorrect username or password.');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="admin-login-page">
      <div className={`login-card ${shaking ? 'shake' : ''}`}>
        <div className="login-brand">
          <Leaf size={28} className="login-leaf" />
          <h1>Cookies Tea</h1>
          <p>Admin Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <User size={16} className="field-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="login-field">
            <Lock size={16} className="field-icon" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-pass"
              onClick={() => setShowPass(!showPass)}
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn btn-primary login-btn">
            Sign In
          </button>
        </form>

        <p className="login-back"><a href="/">← Back to store</a></p>
      </div>
    </div>
  );
};

export default AdminLogin;
