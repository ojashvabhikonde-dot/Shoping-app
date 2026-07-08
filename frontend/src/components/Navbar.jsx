import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ setCurrentPage, currentPage }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar fade-in">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => setCurrentPage('landing')}>
          <span className="logo-icon">✨</span>
          <span className="logo-text">Luxe<span className="logo-accent">Market</span></span>
        </div>

        {/* Links */}
        <ul className="navbar-links">
          <li className={currentPage === 'landing' ? 'active' : ''} onClick={() => setCurrentPage('landing')}>Home</li>
          <li className={currentPage === 'collections' ? 'active' : ''} onClick={() => setCurrentPage('collections')}>Collections</li>
          <li className={currentPage === 'new-arrivals' ? 'active' : ''} onClick={() => setCurrentPage('new-arrivals')}>New Arrivals</li>
          <li className={currentPage === 'special-offers' ? 'active' : ''} onClick={() => setCurrentPage('special-offers')}>Special Offers</li>
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Theme Toggler */}
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle Theme">
            {theme === 'light' ? (
              // Moon Icon for turning dark
              <svg className="theme-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              // Sun Icon for turning light
              <svg className="theme-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          {/* User Auth controls */}
          {user ? (
            <div className="user-profile-menu">
              <span className="welcome-msg">Hi, <strong className="user-name">{user.name}</strong></span>
              <button onClick={logout} className="logout-btn">
                <span>Logout</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button onClick={() => setCurrentPage('login')} className="login-nav-btn">Sign In</button>
              <button onClick={() => setCurrentPage('signup')} className="signup-nav-btn">Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
