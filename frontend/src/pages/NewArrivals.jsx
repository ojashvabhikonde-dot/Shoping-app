import React, { useState } from 'react';
import './NewArrivals.css';

const NEW_ARRIVALS = [
  {
    id: 501,
    name: 'Aura Curved Monitor',
    price: '₹49,900',
    category: 'Tech & Audio',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    tag: 'New Release',
    badgeColor: '#4f46e5',
    desc: '34-inch curved ultra-wide studio display with color-accurate Nano IPS panel.'
  },
  {
    id: 502,
    name: 'Smart Chrono Active',
    price: '₹18,900',
    category: 'Accessories',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    tag: 'Just Landed',
    badgeColor: '#e11d48',
    desc: 'Sleek titanium body smart watch featuring advanced health tracking and 10-day battery.'
  },
  {
    id: 503,
    name: 'AeroLeather Backpack',
    price: '₹14,500',
    category: 'Fashion & Style',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    tag: 'Limited Edition',
    badgeColor: '#059669',
    desc: 'Waterproof full-grain leather backpack with integrated laptop compartment.'
  },
  {
    id: 504,
    name: 'Aroma Drip Brewer',
    price: '₹9,900',
    category: 'Smart Living',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
    tag: 'Design Award',
    badgeColor: '#d97706',
    desc: 'Double-walled borosilicate glass drip brewer with reusable stainless steel mesh filter.'
  },
  {
    id: 505,
    name: 'Pro-Studio Microphone',
    price: '₹19,900',
    category: 'Tech & Audio',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
    tag: 'Exclusive',
    badgeColor: '#7c3aed',
    desc: 'High-fidelity condenser microphone optimized for vocals and high-dynamic instrument recording.'
  },
  {
    id: 506,
    name: 'Heritage Leather Boots',
    price: '₹25,900',
    category: 'Fashion & Style',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80',
    tag: 'Handcrafted',
    badgeColor: '#db2777',
    desc: 'Custom-fitted boots made of vegetable tanned leather and Goodyear-welted soles.'
  },
  {
    id: 507,
    name: 'Acoustic Wood Speakers',
    price: '₹32,900',
    category: 'Tech & Audio',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
    tag: 'Pure Acoustic',
    badgeColor: '#10b981',
    desc: 'Handcrafted walnut wood speakers delivering rich, organic sound and wireless connectivity.'
  },
  {
    id: 508,
    name: 'Minimalist Chrono Watch',
    price: '₹15,900',
    category: 'Accessories',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    tag: 'Aesthetic',
    badgeColor: '#6b7280',
    desc: 'Precision Japanese quartz movement with minimalist clean design face.'
  }
];

const NewArrivals = () => {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="new-arrivals-page">
      <div className="mesh-gradient bg-glow-1"></div>
      <div className="mesh-gradient bg-glow-2"></div>

      <header className="arrivals-header fade-in">
        <span className="badge-promo">Fresh Drops</span>
        <h1 className="arrivals-title">New Arrivals</h1>
        <p className="arrivals-subtitle">
          Be the first to explore our latest collection of premium aesthetics and technological milestones.
        </p>
      </header>

      <div className="spotlight-card fade-in">
        <div className="spotlight-badge">SPOTLIGHT OF THE MONTH</div>
        <div className="spotlight-layout">
          <div className="spotlight-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80" 
              alt="Aura Curved Monitor" 
              className="spotlight-image"
            />
          </div>
          <div className="spotlight-details">
            <span className="spotlight-category">TECH & STUDIO</span>
            <h2 className="spotlight-title">Aura Curved UltraWide</h2>
            <p className="spotlight-description">
              Unleash ultimate productivity with the new Aura Curved Monitor. Engineered with visual artists in mind, it delivers unmatched DCI-P3 color accuracy, deep contrasts, and seamless high-refresh rates, all framed in a minimalist bead-blasted aluminum casing.
            </p>
            <div className="spotlight-specs">
              <div className="spec-item">
                <span className="spec-val">34"</span>
                <span className="spec-lbl">Size</span>
              </div>
              <div className="spec-item">
                <span className="spec-val">4K UHD</span>
                <span className="spec-lbl">Resolution</span>
              </div>
              <div className="spec-item">
                <span className="spec-val">144Hz</span>
                <span className="spec-lbl">Refresh Rate</span>
              </div>
            </div>
            <div className="spotlight-price-row">
              <span className="spotlight-price">₹49,900</span>
              <button className="btn-primary-glow" onClick={handleAddToCart}>
                Pre-Order Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="arrivals-grid-section">
        <h2 className="section-title">Just Landed</h2>
        <div className="arrivals-grid">
          {NEW_ARRIVALS.map((prod) => (
            <div key={prod.id} className="arrival-card">
              <div className="arrival-image-wrapper">
                <span className="arrival-tag" style={{ backgroundColor: prod.badgeColor }}>
                  {prod.tag}
                </span>
                <img src={prod.image} alt={prod.name} className="arrival-image" />
              </div>
              <div className="arrival-details">
                <span className="arrival-cat">{prod.category}</span>
                <h3 className="arrival-name">{prod.name}</h3>
                <p className="arrival-desc">{prod.desc}</p>
                <div className="arrival-price-row">
                  <span className="arrival-price">{prod.price}</span>
                  <button className="btn-icon-add" onClick={handleAddToCart} aria-label="Add to Cart">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {cartCount > 0 && (
        <div className="floating-cart">
          <span className="cart-icon">🛒</span>
          <span className="cart-badge">{cartCount}</span>
        </div>
      )}
    </div>
  );
};

export default NewArrivals;
