import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Collections.css';

const COLLECTIONS_PRODUCTS = [
  {
    id: 101,
    name: 'Classic Trench Coat',
    price: '₹19,900',
    category: 'Fashion & Style',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
    tag: 'Trending',
    desc: 'Tailored luxury trench coat designed with weather-resistant gabardine fabric.'
  },
  {
    id: 102,
    name: 'Eclipse Leather Bag',
    price: '₹11,900',
    category: 'Fashion & Style',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    tag: 'New',
    desc: 'Structured top-handle bag made of premium Italian pebble leather.'
  },
  {
    id: 103,
    name: 'Aviator Sunglasses',
    price: '₹7,500',
    category: 'Fashion & Style',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    tag: 'Popular',
    desc: 'Timeless double-bridge metal frame with polarized protective lenses.'
  },
  {
    id: 104,
    name: 'Cashmere Knit Sweater',
    price: '₹12,900',
    category: 'Fashion & Style',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1574164904299-3a102b110380?w=600&auto=format&fit=crop&q=80',
    tag: 'Premium',
    desc: 'Ultra-soft pure cashmere knit sweater, ethically sourced and finished with ribbed trims.'
  },
  {
    id: 105,
    name: 'Silk Evening Scarf',
    price: '₹4,500',
    category: 'Fashion & Style',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=600&auto=format&fit=crop&q=80',
    tag: 'Pure Silk',
    desc: 'Lustrous mulberry silk scarf featuring a hand-rolled hem and signature organic print.'
  },
  {
    id: 106,
    name: 'Tailored Blazer Jacket',
    price: '₹22,500',
    category: 'Fashion & Style',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&auto=format&fit=crop&q=80',
    tag: 'Modern Fit',
    desc: 'Structured slim-fit blazer made of fine wool-blend cloth, perfect for versatile formal looks.'
  },
  {
    id: 201,
    name: 'Aura Sound Headphones',
    price: '₹24,900',
    category: 'Tech & Audio',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    tag: 'Best Seller',
    desc: 'Studio-grade acoustics with hybrid active noise cancellation and 40-hour battery life.'
  },
  {
    id: 202,
    name: 'Studio Mechanical Keyboard',
    price: '₹13,900',
    category: 'Tech & Audio',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    tag: 'Hot',
    desc: 'Wireless hot-swappable keyboard with linear switches and aluminum frame.'
  },
  {
    id: 203,
    name: 'Cinema Smart Projector',
    price: '₹37,900',
    category: 'Tech & Audio',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&auto=format&fit=crop&q=80',
    tag: 'Premium',
    desc: 'Compact 4K smart projector featuring autofocus and built-in premium sound.'
  },
  {
    id: 204,
    name: 'Hi-Fi DAC Amplifier',
    price: '₹18,900',
    category: 'Tech & Audio',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbd1d5?w=600&auto=format&fit=crop&q=80',
    tag: 'Audiophile',
    desc: 'Portable high-resolution USB DAC and headphone amplifier with ultra-low distortion.'
  },
  {
    id: 205,
    name: 'Acoustic Wood Speakers',
    price: '₹32,900',
    category: 'Tech & Audio',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
    tag: 'Natural Wood',
    desc: 'Handcrafted walnut wood speakers delivering rich, organic sound and wireless connectivity.'
  },
  {
    id: 206,
    name: 'Wireless Earbuds Pro',
    price: '₹9,900',
    category: 'Tech & Audio',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    tag: 'Compact',
    desc: 'Ergonomic true wireless earbuds with custom dynamic drivers and transparency mode.'
  },
  {
    id: 301,
    name: 'Nebula Smart Lamp',
    price: '₹6,500',
    category: 'Smart Living',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    tag: 'Smart',
    desc: 'App-controlled ambient light with 16 million colors and circadian rhythm cycles.'
  },
  {
    id: 302,
    name: 'Minimalist Ceramic Vase',
    price: '₹3,900',
    category: 'Smart Living',
    rating: '4.5',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&auto=format&fit=crop&q=80',
    tag: 'Aesthetic',
    desc: 'Matte textured hand-thrown ceramic vase, perfect for dried botanicals.'
  },
  {
    id: 303,
    name: 'Stone Essential Diffuser',
    price: '₹5,500',
    category: 'Smart Living',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&auto=format&fit=crop&q=80',
    tag: 'Wellness',
    desc: 'Ultrasonic diffuser crafted with a hand-milled porcelain stone cover.'
  },
  {
    id: 304,
    name: 'Intelligent Air Purifier',
    price: '₹16,900',
    category: 'Smart Living',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80',
    tag: 'Pure Air',
    desc: 'Medical-grade True HEPA air purifier with silent motor and automated PM2.5 tracking.'
  },
  {
    id: 305,
    name: 'E-Ink Desktop Clock',
    price: '₹7,900',
    category: 'Smart Living',
    rating: '4.5',
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&auto=format&fit=crop&q=80',
    tag: 'Minimal',
    desc: 'High-contrast paper-like e-ink display showing time, humidity, and atmospheric metrics.'
  },
  {
    id: 306,
    name: 'Ergonomic Desk Chair',
    price: '₹29,900',
    category: 'Smart Living',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80',
    tag: 'Orthopedic',
    desc: 'Breathable mesh executive chair with multi-dimensional lumbar support and steel base.'
  },
  {
    id: 401,
    name: 'Minimalist Chrono Watch',
    price: '₹15,900',
    category: 'Accessories',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    tag: 'Trending',
    desc: 'Precision Japanese quartz movement with minimalist clean design face.'
  },
  {
    id: 402,
    name: 'Saddle Leather Wallet',
    price: '₹4,500',
    category: 'Accessories',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1627124118303-624c8943ee5a?w=600&auto=format&fit=crop&q=80',
    tag: 'RFID Secure',
    desc: 'Slim bi-fold wallet featuring RFID blocking and 6 card slots.'
  },
  {
    id: 403,
    name: 'Bamboo Wireless Charger',
    price: '₹3,200',
    category: 'Accessories',
    rating: '4.4',
    image: 'https://images.unsplash.com/photo-1622445262465-2481c457487f?w=600&auto=format&fit=crop&q=80',
    tag: 'Eco-Friendly',
    desc: 'Fast charging Qi-compatible pad crafted from sustainable natural bamboo.'
  },
  {
    id: 404,
    name: 'Titanium Key Organizer',
    price: '₹3,500',
    category: 'Accessories',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
    tag: 'EDC Essential',
    desc: 'Aircraft-grade titanium key holder that eliminates pocket jingle and fits up to 8 keys.'
  },
  {
    id: 405,
    name: 'Sleek Aluminum Cardholder',
    price: '₹2,900',
    category: 'Accessories',
    rating: '4.5',
    image: 'https://images.unsplash.com/photo-1572245381838-89c0b299e527?w=600&auto=format&fit=crop&q=80',
    tag: 'RFID Protection',
    desc: 'Minimalist aluminum card ejector wallet with integrated RFID protection and silicone cash band.'
  },
  {
    id: 406,
    name: 'Canvas Travel Duffle',
    price: '₹8,900',
    category: 'Accessories',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    tag: 'Weekend Bag',
    desc: 'Water-resistant heavy cotton canvas duffle bag reinforced with premium cowhide leather straps.'
  }
];

const CATEGORIES = ['All', 'Fashion & Style', 'Tech & Audio', 'Smart Living', 'Accessories'];

const Collections = ({ setCurrentPage }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, cartCount } = useCart();

  const filteredProducts = COLLECTIONS_PRODUCTS.filter(prod => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="collections-page">
      <div className="mesh-gradient bg-glow-1"></div>
      <div className="mesh-gradient bg-glow-2"></div>

      <header className="collections-header fade-in">
        <span className="badge-promo">Curated Catalog</span>
        <h1 className="collections-title">Our Collections</h1>
        <p className="collections-subtitle">
          Discover a curated ecosystem of premium essentials designed to seamlessly fit your lifestyle.
        </p>
      </header>

      <div className="filter-controls-row">
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-bar">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="product-card">
              <div className="product-visual-wrapper">
                <span className="product-tag">{prod.tag}</span>
                <img src={prod.image} alt={prod.name} className="product-image" />
                <div className="product-overlay">
                  <p className="product-overlay-desc">{prod.desc}</p>
                </div>
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
                <button className="btn-add-to-cart" onClick={() => addToCart(prod)}>
                  Add to Cart
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <span className="no-results-icon">🔍</span>
          <h3>No products found</h3>
          <p>Try adjusting your search terms or selecting another category.</p>
        </div>
      )}

      {cartCount > 0 && (
        <div className="floating-cart" onClick={() => setCurrentPage('cart')}>
          <span className="cart-icon">🛒</span>
          <span className="cart-badge">{cartCount}</span>
        </div>
      )}
    </div>
  );
};

export default Collections;
