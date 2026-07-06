import React, { useState } from 'react';
import './LandingPage.css';

// Predefined mock products to render a beautiful layout
const PRODUCTS = [
  {
    id: 1,
    name: 'Aura Sound Headphones',
    price: '$299.00',
    category: 'Audio',
    rating: '4.9',
    image: '🎧',
    tag: 'Best Seller',
    gradient: 'linear-gradient(135deg, #a78bfa, #6366f1)'
  },
  {
    id: 2,
    name: 'Minimalist Chrono Watch',
    price: '$189.00',
    category: 'Accessories',
    rating: '4.8',
    image: '⌚',
    tag: 'Trending',
    gradient: 'linear-gradient(135deg, #f472b6, #ec4899)'
  },
  {
    id: 3,
    name: 'Eclipse Leather Bag',
    price: '$145.00',
    category: 'Fashion',
    rating: '4.7',
    image: '👜',
    tag: 'New',
    gradient: 'linear-gradient(135deg, #38bdf8, #0284c7)'
  },
  {
    id: 4,
    name: 'Nebula Smart Lamp',
    price: '$79.00',
    category: 'Home',
    rating: '4.6',
    image: '💡',
    tag: 'Smart',
    gradient: 'linear-gradient(135deg, #34d399, #059669)'
  }
];

const CATEGORIES = [
  { name: 'Fashion & Style', icon: '👕', count: '1,200+ Products' },
  { name: 'Tech & Audio', icon: '💻', count: '450+ Products' },
  { name: 'Smart Living', icon: '🏠', count: '320+ Products' },
  { name: 'Accessories', icon: '🕶️', count: '680+ Products' }
];

const LandingPage = ({ setCurrentPage }) => {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="landing-page">
      {/* Background Mesh Gradients */}
      <div className="mesh-gradient bg-glow-1"></div>
      <div className="mesh-gradient bg-glow-2"></div>

      {/* Hero Section */}
      <section className="hero-section fade-in">
        <div className="hero-content">
          <div className="badge-promo">🎉 SUMMER COLLECTION IS LIVE</div>
          <h1 className="hero-title">
            Elevate Your <br />
            <span className="gradient-text">Everyday Essentials</span>
          </h1>
          <p className="hero-subtitle">
            Explore curated design pieces, state-of-the-art tech gadgets, and aesthetic collections crafted with focus on quality and detail.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setCurrentPage('login')}>
              Shop Collection
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button className="btn-secondary">Explore Lookbook</button>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-num">50k+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-border"></div>
            <div className="stat-item">
              <span className="stat-num">24/7</span>
              <span className="stat-label">Expert Support</span>
            </div>
            <div className="stat-border"></div>
            <div className="stat-item">
              <span className="stat-num">100%</span>
              <span className="stat-label">Secure Checkout</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card main-visual">
            <span className="visual-badge">Hot Release</span>
            <span className="visual-icon">🎧</span>
            <div className="visual-info">
              <h3>Aura Wireless Max</h3>
              <p>Premium Noise Cancelling</p>
              <div className="visual-price">
                <span className="price">$349</span>
                <button className="visual-add-btn" onClick={handleAddToCart}>+</button>
              </div>
            </div>
          </div>
          <div className="visual-card shadow-card-1"></div>
          <div className="visual-card shadow-card-2"></div>
        </div>
      </section>

      {/* Floating Cart Indicator */}
      {cartCount > 0 && (
        <div className="floating-cart">
          <span className="cart-icon">🛒</span>
          <span className="cart-badge">{cartCount}</span>
        </div>
      )}

      {/* Category Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-desc">Handpicked collections tailored to your aesthetic preference</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="category-card">
              <span className="category-icon">{cat.icon}</span>
              <h3 className="category-name">{cat.name}</h3>
              <span className="category-count">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">Trending Now</h2>
          <p className="section-desc">Our most popular designs this week, reviewed by thousands</p>
        </div>
        <div className="products-grid">
          {PRODUCTS.map((prod) => (
            <div key={prod.id} className="product-card">
              <div className="product-visual-wrapper" style={{ background: prod.gradient }}>
                <span className="product-tag">{prod.tag}</span>
                <span className="product-visual-icon">{prod.image}</span>
              </div>
              <div className="product-details">
                <span className="product-cat">{prod.category}</span>
                <h3 className="product-name">{prod.name}</h3>
                <div className="product-rating-row">
                  <div className="product-rating">
                    <span className="star-icon">⭐</span>
                    <span className="rating-value">{prod.rating}</span>
                  </div>
                  <span className="product-price">{prod.price}</span>
                </div>
                <button className="btn-add-to-cart" onClick={handleAddToCart}>
                  Add to Cart
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Banner Section */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>Get 15% Off Your First Order</h2>
          <p>Subscribe to our newsletter to receive catalog updates, early releases, and secret promos.</p>
          <div className="promo-input-row">
            <input type="email" placeholder="Enter your email address" className="promo-input" />
            <button className="promo-btn">Join Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="footer-logo">✨ LuxeMarket</span>
            <p>Premium aesthetics for modern shoppers. Connecting design with everyday utilities.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li>All Products</li>
              <li>Featured</li>
              <li>Discount</li>
              <li>Gift Cards</li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li>Help Center</li>
              <li>Shipping Policy</li>
              <li>Returns & Refunds</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Careers</li>
              <li>Press Release</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LuxeMarket Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
