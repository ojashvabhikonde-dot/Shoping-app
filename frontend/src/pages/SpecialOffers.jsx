import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './SpecialOffers.css';

const SPECIAL_OFFERS = [
  {
    id: 601,
    name: 'Aura Home Speaker',
    originalPrice: '₹16,900',
    salePrice: '₹11,900',
    discount: '30% OFF',
    category: 'Tech & Audio',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80',
    tag: 'Limited Supply',
    desc: '360-degree omnidirectional smart speaker with rich bass and Siri/Alexa integrations.'
  },
  {
    id: 602,
    name: 'Minimalist Chrono Gold',
    originalPrice: '₹21,900',
    salePrice: '₹15,900',
    discount: '24% OFF',
    category: 'Accessories',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&auto=format&fit=crop&q=80',
    tag: 'Best Price',
    desc: 'Japanese quartz movement watch with pure gold-plated steel bezel and leather strap.'
  },
  {
    id: 603,
    name: 'Sunshield Aviator',
    originalPrice: '₹8,500',
    salePrice: '₹5,900',
    discount: '30% OFF',
    category: 'Accessories',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    tag: 'Hot Item',
    desc: 'Premium classic metal frames with polarized UV400 sun protection lenses.'
  },
  {
    id: 604,
    name: 'Essential Wellness Kit',
    originalPrice: '₹7,500',
    salePrice: '₹4,900',
    discount: '30% OFF',
    category: 'Smart Living',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
    tag: 'Self Care',
    desc: 'A complete aromatherapy set containing organic essential oils and stone bath salts.'
  },
  {
    id: 605,
    name: 'Pro-Studio Microphone',
    originalPrice: '₹19,900',
    salePrice: '₹14,900',
    discount: '25% OFF',
    category: 'Tech & Audio',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
    tag: 'Studio Special',
    desc: 'High-fidelity condenser microphone optimized for vocals and high-dynamic instrument recording.'
  },
  {
    id: 606,
    name: 'Cinema Smart Projector',
    originalPrice: '₹37,900',
    salePrice: '₹29,900',
    discount: '21% OFF',
    category: 'Tech & Audio',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&auto=format&fit=crop&q=80',
    tag: 'Deal of the Week',
    desc: 'Compact 4K smart projector featuring autofocus and built-in premium sound.'
  }
];

const SpecialOffers = ({ setCurrentPage }) => {
  const { addToCart, cartCount } = useCart();
  const [copiedCode, setCopiedCode] = useState(null);

  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (code) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code);
      } else {
        const el = document.createElement('textarea');
        el.value = code;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
    } catch (err) {
      console.warn('Clipboard copy failed, using state update anyway:', err);
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="special-offers-page">
      <div className="mesh-gradient bg-glow-1"></div>
      <div className="mesh-gradient bg-glow-2"></div>

      <header className="offers-header fade-in">
        <span className="badge-promo">Exclusive Deals</span>
        <h1 className="offers-title">Special Offers</h1>
        <p className="offers-subtitle">
          Unlock seasonal discounts, active promo codes, and flash sales curated especially for our club members.
        </p>
      </header>

      <div className="countdown-card fade-in">
        <div className="countdown-content">
          <div className="promo-tag">FLASH SALE ENDING SOON</div>
          <h2 className="countdown-title">Get Up To 30% Off Selected Styles</h2>
          <p className="countdown-desc">
            Prices are marked down for a limited time. Don't miss out on premium audio, fashion accessories, and home elements.
          </p>
          <div className="countdown-timer">
            <div className="time-block">
              <span className="time-digits">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span className="time-label">HOURS</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-block">
              <span className="time-digits">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span className="time-label">MINUTES</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-block">
              <span className="time-digits">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              <span className="time-label">SECONDS</span>
            </div>
          </div>
        </div>
      </div>

      <section className="coupons-section fade-in">
        <h2 className="section-title">Active Coupons</h2>
        <div className="coupons-grid">
          <div className="coupon-card">
            <div className="coupon-details">
              <span className="coupon-discount">15% OFF</span>
              <h3 className="coupon-title">Summer Kickoff Sale</h3>
              <p className="coupon-condition">Valid on all items. No minimum purchase.</p>
            </div>
            <button className={`copy-btn ${copiedCode === 'SUMMER15' ? 'copied' : ''}`} onClick={() => copyToClipboard('SUMMER15')}>
              {copiedCode === 'SUMMER15' ? 'Copied!' : 'Copy Code: SUMMER15'}
            </button>
          </div>
          <div className="coupon-card">
            <div className="coupon-details">
              <span className="coupon-discount">20% OFF</span>
              <h3 className="coupon-title">Audio Premium Tier</h3>
              <p className="coupon-condition">Applicable only for Tech & Audio products.</p>
            </div>
            <button className={`copy-btn ${copiedCode === 'TECH20' ? 'copied' : ''}`} onClick={() => copyToClipboard('TECH20')}>
              {copiedCode === 'TECH20' ? 'Copied!' : 'Copy Code: TECH20'}
            </button>
          </div>
        </div>
      </section>

      <section className="sale-grid-section">
        <h2 className="section-title">Flash Sale Items</h2>
        <div className="sale-grid">
          {SPECIAL_OFFERS.map((prod) => (
            <div key={prod.id} className="sale-card">
              <div className="sale-image-wrapper">
                <span className="sale-tag">{prod.tag}</span>
                <span className="discount-badge">{prod.discount}</span>
                <img src={prod.image} alt={prod.name} className="sale-image" />
              </div>
              <div className="sale-details">
                <span className="sale-cat">{prod.category}</span>
                <h3 className="sale-name">{prod.name}</h3>
                <p className="sale-desc">{prod.desc}</p>
                <div className="sale-price-row">
                  <div className="price-tag-group">
                    <span className="original-price">{prod.originalPrice}</span>
                    <span className="sale-price">{prod.salePrice}</span>
                  </div>
                  <button className="btn-icon-add" onClick={() => addToCart(prod)} aria-label="Add to Cart">
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
        <div className="floating-cart" onClick={() => setCurrentPage('cart')}>
          <span className="cart-icon">🛒</span>
          <span className="cart-badge">{cartCount}</span>
        </div>
      )}
    </div>
  );
};

export default SpecialOffers;
