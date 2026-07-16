import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = ({ setCurrentPage, redirectPage, setRedirectPage }) => {
  const { login, error, setError, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [validationError, setValidationError] = useState('');

  // Clear previous errors when page mounts
  useEffect(() => {
    setError(null);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setValidationError('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      if (redirectPage) {
        setCurrentPage(redirectPage);
        setRedirectPage(null);
      } else {
        setCurrentPage('landing');
      }
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-mesh-1"></div>
      <div className="auth-mesh-2"></div>
      
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo" onClick={() => setCurrentPage('landing')}>✨ LuxeMarket</span>
          <h2>Welcome Back</h2>
          <p>Sign in to access your dashboard, orders, and wishlist.</p>
        </div>

        {/* Errors display */}
        {(validationError || error) && (
          <div className="auth-error-box">
            <span className="error-icon">⚠️</span>
            <span className="error-msg">{validationError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <span className="forgot-pass-link">Forgot password?</span>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner-loader"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <span onClick={() => setCurrentPage('signup')} className="auth-link">Sign Up</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
