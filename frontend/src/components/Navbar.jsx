import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const navItems = [
  { id: 'landing', label: 'Home' },
  { id: 'collections', label: 'Collections' },
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'special-offers', label: 'Special Offers' }
];

const Navbar = ({ setCurrentPage, currentPage }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Animated Logo */}
        <motion.div 
          className="navbar-logo" 
          onClick={() => { setCurrentPage('landing'); setMobileMenuOpen(false); }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span 
            className="logo-icon"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            ✨
          </motion.span>
          <span className="logo-text">Luxe<span className="logo-accent">Market</span></span>
        </motion.div>

        {/* Animated Desktop Navigation Links */}
        <ul className="navbar-links">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <li 
                key={item.id} 
                className={isActive ? 'active' : ''} 
                onClick={() => setCurrentPage(item.id)}
              >
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="active-pill-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </li>
            );
          })}
          {user && (
            <li 
              className={currentPage === 'orders' ? 'active' : ''} 
              onClick={() => setCurrentPage('orders')}
            >
              My Orders
              {currentPage === 'orders' && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="active-pill-indicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </li>
          )}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Animated Theme Toggler */}
          <motion.button 
            onClick={toggleTheme} 
            className="theme-toggle-btn" 
            aria-label="Toggle Theme"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'light' ? (
              <svg className="theme-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
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
          </motion.button>

          {/* Cart Trigger with Bounce Animation */}
          <motion.button 
            onClick={() => setCurrentPage('cart')} 
            className={`cart-toggle-btn ${currentPage === 'cart' ? 'active' : ''}`}
            aria-label="View Cart"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  key={cartCount}
                  className="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1.4, 1] }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* User Auth controls */}
          {user ? (
            <div className="user-profile-menu">
              <span className="welcome-msg">Hi, <strong className="user-name-link" onClick={() => setCurrentPage('profile')}>{user.name}</strong></span>
              <motion.button 
                onClick={logout} 
                className="logout-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Logout</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </motion.button>
            </div>
          ) : (
            <div className="auth-buttons">
              <motion.button 
                onClick={() => setCurrentPage('login')} 
                className="login-nav-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              <motion.button 
                onClick={() => setCurrentPage('signup')} 
                className="signup-nav-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button 
            className="mobile-hamburger-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="mobile-nav-links">
              {navItems.map((item) => (
                <li 
                  key={item.id}
                  className={currentPage === item.id ? 'active' : ''}
                  onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                >
                  {item.label}
                </li>
              ))}
              {user && (
                <li 
                  className={currentPage === 'orders' ? 'active' : ''}
                  onClick={() => { setCurrentPage('orders'); setMobileMenuOpen(false); }}
                >
                  My Orders
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
