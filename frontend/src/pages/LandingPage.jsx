import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
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
    gradient: 'linear-gradient(135deg, #a78bfa, #6366f1)',
    desc: 'Studio-grade acoustics with hybrid active noise cancellation and 40-hour battery life.'
  },
  {
    id: 2,
    name: 'Minimalist Chrono Watch',
    price: '₹15,900',
    category: 'Accessories',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    tag: 'Trending',
    gradient: 'linear-gradient(135deg, #f472b6, #ec4899)',
    desc: 'Precision Japanese quartz movement with minimalist clean design face and sapphire crystal.'
  },
  {
    id: 3,
    name: 'Eclipse Leather Bag',
    price: '₹11,900',
    category: 'Fashion & Style',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    tag: 'New',
    gradient: 'linear-gradient(135deg, #38bdf8, #0284c7)',
    desc: 'Structured top-handle bag made of premium Italian pebble leather with gold accents.'
  },
  {
    id: 4,
    name: 'Nebula Smart Lamp',
    price: '₹6,500',
    category: 'Smart Living',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    tag: 'Smart',
    gradient: 'linear-gradient(135deg, #34d399, #059669)',
    desc: 'App-controlled ambient light with 16 million colors and circadian rhythm cycles.'
  },
  {
    id: 5,
    name: 'Aura Curved Monitor',
    price: '₹49,900',
    category: 'Tech & Audio',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    tag: 'New Release',
    gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    desc: '34-inch 240Hz OLED ultrawide curved monitor with 99% DCI-P3 color calibration.'
  },
  {
    id: 6,
    name: 'AeroLeather Backpack',
    price: '₹14,500',
    category: 'Fashion & Style',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    tag: 'Limited Edition',
    gradient: 'linear-gradient(135deg, #fbbf24, #d97706)',
    desc: 'Water-resistant heavy cotton canvas duffle bag reinforced with premium cowhide straps.'
  }
];

const CATEGORIES = [
  { name: 'Fashion & Style', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80', count: '1,200+ Products' },
  { name: 'Tech & Audio', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80', count: '450+ Products' },
  { name: 'Smart Living', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80', count: '320+ Products' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&auto=format&fit=crop&q=80', count: '680+ Products' }
];

const TICKER_ITEMS = [
  "⚡ Free Express Shipping On Orders Over ₹2,000",
  "🛡️ 2-Year Extended Hassle-Free Warranty",
  "💎 100% Handpicked Authentic Quality",
  "🌟 4.9/5 Rating from 50,000+ Happy Customers",
  "🔒 256-Bit Encrypted Secure Checkout",
  "🔄 30-Day Money Back Guarantee"
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
  }
};

const LandingPage = ({ setCurrentPage }) => {
  const { addToCart, cartCount } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart(item || PRODUCTS[0]);
    
    // Trigger confetti
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#4f46e5', '#e11d48', '#38bdf8', '#34d399']
    });
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setNewsletterSuccess(true);
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="landing-page">
      {/* Dynamic Animated Mesh Glow Blobs */}
      <motion.div 
        className="mesh-gradient bg-glow-1 animate-float"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="mesh-gradient bg-glow-2 animate-float-reverse"
        animate={{ scale: [1, 1.3, 1], x: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <motion.div 
            className="badge-promo animate-pulse-glow"
            whileHover={{ scale: 1.05 }}
          >
            🎉 SUMMER COLLECTION IS LIVE
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Elevate Your <br />
            <span className="text-gradient-shimmer">Everyday Essentials</span>
          </motion.h1>

          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Explore curated design pieces, state-of-the-art tech gadgets, and aesthetic collections crafted with focus on quality and detail.
          </motion.p>

          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.button 
              className="btn-primary" 
              onClick={() => setCurrentPage('collections')}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(79, 70, 229, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Collection
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </motion.button>
            <motion.button 
              className="btn-secondary"
              onClick={() => setCurrentPage('new-arrivals')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Lookbook
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="stat-item">
              <span className="stat-num text-gradient-shimmer">50k+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-border"></div>
            <div className="stat-item">
              <span className="stat-num text-gradient-shimmer">24/7</span>
              <span className="stat-label">Expert Support</span>
            </div>
            <div className="stat-border"></div>
            <div className="stat-item">
              <span className="stat-num text-gradient-shimmer">100%</span>
              <span className="stat-label">Secure Checkout</span>
            </div>
          </motion.div>
        </div>

        {/* 3D Floating Interactive Visual */}
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            className="visual-card main-visual interactive-card"
            whileHover={{ rotate: 0, scale: 1.04, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="visual-badge">Hot Release</span>
            <div className="visual-image-wrapper">
              <motion.img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80" 
                alt="Aura Wireless Max" 
                className="visual-image" 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="visual-info">
              <h3>Aura Wireless Max</h3>
              <p>Premium Noise Cancelling</p>
              <div className="visual-price">
                <span className="price">₹28,900</span>
                <motion.button 
                  className="visual-add-btn" 
                  onClick={(e) => handleAddToCart(e, PRODUCTS[0])}
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  +
                </motion.button>
              </div>
            </div>
          </motion.div>
          <div className="visual-card shadow-card-1 animate-float"></div>
          <div className="visual-card shadow-card-2 animate-float-reverse"></div>
        </motion.div>
      </motion.section>

      {/* Marquee Ticker Bar */}
      <div className="marquee-container">
        <div className="marquee-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <span key={idx} className="marquee-item">{item}</span>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div 
            className="floating-cart"
            onClick={() => setCurrentPage('cart')}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.15, y: -4 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="cart-icon">🛒</span>
            <motion.span 
              className="cart-badge"
              key={cartCount}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
            >
              {cartCount}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Section */}
      <motion.section 
        className="categories-section"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-desc">Handpicked collections tailored to your aesthetic preference</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat, idx) => (
            <motion.div 
              key={idx} 
              className="category-card interactive-card" 
              variants={staggerItem}
              onClick={() => setCurrentPage('collections')}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="category-image-wrapper">
                <img src={cat.image} alt={cat.name} className="category-card-image" />
              </div>
              <h3 className="category-name">{cat.name}</h3>
              <span className="category-count">{cat.count}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Products Section */}
      <motion.section 
        className="products-section"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="section-header">
          <h2 className="section-title">Trending Now</h2>
          <p className="section-desc">Our most popular designs this week, reviewed by thousands</p>
        </div>
        <div className="products-grid">
          {PRODUCTS.map((prod) => (
            <motion.div 
              key={prod.id} 
              className="product-card interactive-card"
              variants={staggerItem}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedProduct(prod)}
            >
              <div className="product-visual-wrapper">
                <span className="product-tag">{prod.tag}</span>
                <img src={prod.image} alt={prod.name} className="product-image" />
                <motion.div 
                  className="quick-view-overlay"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <span>Quick Preview 👁️</span>
                </motion.div>
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
                <motion.button 
                  className="btn-add-to-cart" 
                  onClick={(e) => handleAddToCart(e, prod)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add to Cart
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quick View Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>×</button>
              <div className="modal-grid">
                <div className="modal-image-col">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-img" />
                </div>
                <div className="modal-info-col">
                  <span className="modal-tag">{selectedProduct.tag}</span>
                  <h2 className="modal-title">{selectedProduct.name}</h2>
                  <div className="modal-rating">
                    <span>⭐ {selectedProduct.rating} / 5.0</span>
                    <span className="modal-cat-badge">{selectedProduct.category}</span>
                  </div>
                  <p className="modal-desc">{selectedProduct.desc}</p>
                  <div className="modal-price">{selectedProduct.price}</div>
                  <div className="modal-actions">
                    <motion.button 
                      className="btn-primary"
                      onClick={(e) => {
                        handleAddToCart(e, selectedProduct);
                        setSelectedProduct(null);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add To Cart 🛒
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promo Banner Section */}
      <motion.section 
        className="promo-banner"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="promo-content">
          <h2>Get 15% Off Your First Order</h2>
          <p>Subscribe to our newsletter to receive catalog updates, early releases, and secret promos.</p>

          {newsletterSuccess ? (
            <motion.div 
              className="newsletter-success-box"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              🎉 Welcome aboard! Check your inbox for your 15% discount code.
            </motion.div>
          ) : (
            <form onSubmit={handleNewsletter} className="promo-input-row">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="promo-input"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              <motion.button 
                type="submit" 
                className="promo-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Now
              </motion.button>
            </form>
          )}
        </div>
      </motion.section>

      {/* Footer Section */}
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

