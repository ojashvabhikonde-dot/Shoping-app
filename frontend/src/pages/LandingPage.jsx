import React, { useState } from 'react';
import './LandingPage.css';

const PRODUCTS = [
  {
    id: 1,
    name: 'Aura Sound Headphones',
    price: '₹24,900',
    category: 'Tech & Audio',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    tag: 'Best Seller',
    gradient: 'linear-gradient(135deg, #a78bfa, #6366f1)'
  },
  {
    id: 2,
    name: 'Minimalist Chrono Watch',
    price: '₹15,900',
    category: 'Accessories',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    tag: 'Trending',
    gradient: 'linear-gradient(135deg, #f472b6, #ec4899)'
  },
  {
    id: 3,
    name: 'Eclipse Leather Bag',
    price: '₹11,900',
    category: 'Fashion & Style',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    tag: 'New',
    gradient: 'linear-gradient(135deg, #38bdf8, #0284c7)'
  },
  {
    id: 4,
    name: 'Nebula Smart Lamp',
    price: '₹6,500',
    category: 'Smart Living',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    tag: 'Smart',
    gradient: 'linear-gradient(135deg, #34d399, #059669)'
  },
  {
    id: 5,
    name: 'Aura Curved Monitor',
    price: '₹49,900',
    category: 'Tech & Audio',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    tag: 'New Release',
    gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)'
  },
  {
    id: 6,
    name: 'AeroLeather Backpack',
    price: '₹14,500',
    category: 'Fashion & Style',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    tag: 'Limited Edition',
    gradient: 'linear-gradient(135deg, #fbbf24, #d97706)'
  }
];

const CATEGORIES = [
  { name: 'Fashion & Style', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80', count: '1,200+ Products' },
  { name: 'Tech & Audio', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80', count: '450+ Products' },
  { name: 'Smart Living', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80', count: '320+ Products' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&auto=format&fit=crop&q=80', count: '680+ Products' }
];

const LandingPage = ({ setCurrentPage }) => {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="landing-page">
      <div className="mesh-gradient bg-glow-1"></div>
      <div className="mesh-gradient bg-glow-2"></div>

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
            <div className="visual-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80" 
                alt="Aura Wireless Max" 
                className="visual-image" 
              />
            </div>
            <div className="visual-info">
              <h3>Aura Wireless Max</h3>
              <p>Premium Noise Cancelling</p>
              <div className="visual-price">
                <span className="price">₹28,900</span>
                <button className="visual-add-btn" onClick={handleAddToCart}>+</button>
              </div>
            </div>
          </div>
          <div className="visual-card shadow-card-1"></div>
          <div className="visual-card shadow-card-2"></div>
        </div>
      </section>

      {cartCount > 0 && (
        <div className="floating-cart">
          <span className="cart-icon">🛒</span>
          <span className="cart-badge">{cartCount}</span>
        </div>
      )}

      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-desc">Handpicked collections tailored to your aesthetic preference</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="category-card" onClick={() => setCurrentPage('collections')}>
              <div className="category-image-wrapper">
                <img src={cat.image} alt={cat.name} className="category-card-image" />
              </div>
              <h3 className="category-name">{cat.name}</h3>
              <span className="category-count">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">Trending Now</h2>
          <p className="section-desc">Our most popular designs this week, reviewed by thousands</p>
        </div>
        <div className="products-grid">
          {PRODUCTS.map((prod) => (
            <div key={prod.id} className="product-card">
              <div className="product-visual-wrapper">
                <span className="product-tag">{prod.tag}</span>
                <img src={prod.image} alt={prod.name} className="product-image" />
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
