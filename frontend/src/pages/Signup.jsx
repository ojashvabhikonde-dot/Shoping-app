import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = ({ setCurrentPage }) => {
  const { signup, error, setError, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    const res = await signup(name, email, password);
    if (res.success) {
      setCurrentPage('landing');
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-mesh-1"></div>
      <div className="auth-mesh-2"></div>

      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo" onClick={() => setCurrentPage('landing')}>✨ LuxeMarket</span>
          <h2>Create Account</h2>
          <p>Join LuxeMarket today and enjoy premium e-commerce services.</p>
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
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner-loader"></span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <span onClick={() => setCurrentPage('login')} className="auth-link">Sign In</span></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
