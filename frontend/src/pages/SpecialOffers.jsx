import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import './SpecialOffers.css';

const SPECIAL_OFFERS = [
  {
    id: 601,
    name: 'Aura Home Speaker',
    originalPrice: '₹16,900',
    salePrice: '₹11,900',
    discount: '30% OFF',
    claimedPercent: 82,
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
    claimedPercent: 65,
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
    claimedPercent: 91,
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
    claimedPercent: 44,
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
    claimedPercent: 78,
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
    claimedPercent: 88,
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
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);

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

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);

    const extraRounds = 360 * 5;
    const prizes = ['25% OFF (Code: LUCKY25)', 'Free Express Shipping (Code: SHIPFREE)', '₹1,000 Voucher (Code: CLUB1000)', '30% OFF (Code: MEGA30)'];
    const randomPrizeIdx = Math.floor(Math.random() * prizes.length);
    const targetDegrees = extraRounds + randomPrizeIdx * 90 + 45;

    setWheelRotation(prev => prev + targetDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(prizes[randomPrizeIdx]);
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 }
      });
    }, 3000);
  };

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
      console.warn('Clipboard copy failed:', err);
    }
    setCopiedCode(code);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddWithConfetti = (item) => {
    addToCart(item);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  return (
    <div className="special-offers-page">
      <div className="mesh-gradient bg-glow-1 animate-float"></div>
      <div className="mesh-gradient bg-glow-2 animate-float-reverse"></div>

      <motion.header 
        className="offers-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="badge-promo animate-pulse-glow">Exclusive Deals</span>
        <h1 className="offers-title">Special Offers</h1>
        <p className="offers-subtitle">
          Unlock seasonal discounts, active promo codes, and flash sales curated especially for our club members.
        </p>
      </motion.header>

      {/* Countdown Flash Banner */}
      <motion.div 
        className="countdown-card interactive-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="countdown-content">
          <div className="promo-tag animate-pulse-glow">FLASH SALE ENDING SOON</div>
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
      </motion.div>

      {/* Daily Reward Spin Wheel */}
      <motion.section 
        className="wheel-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="wheel-container glass-panel">
          <div className="wheel-info">
            <span className="badge-promo">🎰 Daily Member Perk</span>
            <h2>Spin The Reward Wheel!</h2>
            <p>Spin every 24 hours to win secret vouchers and free express shipping passes.</p>
            {wonPrize ? (
              <motion.div 
                className="prize-won-box"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                🎉 CONGRATULATIONS! You Won: <br />
                <strong>{wonPrize}</strong>
              </motion.div>
            ) : (
              <motion.button 
                className="btn-spin-wheel"
                onClick={handleSpinWheel}
                disabled={isSpinning}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSpinning ? 'Spinning...' : 'Spin Now 🎯'}
              </motion.button>
            )}
          </div>
          <div className="wheel-visual-wrapper">
            <div className="wheel-pointer">▼</div>
            <motion.div 
              className="wheel-disc"
              animate={{ rotate: wheelRotation }}
              transition={{ duration: 3, ease: [0.15, 0.85, 0.35, 1] }}
            >
              <div className="wheel-segment seg-1">25% OFF</div>
              <div className="wheel-segment seg-2">FREE SHIP</div>
              <div className="wheel-segment seg-3">₹1000 OFF</div>
              <div className="wheel-segment seg-4">30% OFF</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Active Coupons Section */}
      <section className="coupons-section">
        <h2 className="section-title">Active Coupons</h2>
        <div className="coupons-grid">
          <motion.div className="coupon-card interactive-card" whileHover={{ scale: 1.02 }}>
            <div className="coupon-details">
              <span className="coupon-discount">15% OFF</span>
              <h3 className="coupon-title">Summer Kickoff Sale</h3>
              <p className="coupon-condition">Valid on all items. No minimum purchase.</p>
            </div>
            <motion.button 
              className={`copy-btn ${copiedCode === 'SUMMER15' ? 'copied' : ''}`} 
              onClick={() => copyToClipboard('SUMMER15')}
              whileTap={{ scale: 0.9 }}
            >
              {copiedCode === 'SUMMER15' ? 'Copied! 🎉' : 'Copy Code: SUMMER15'}
            </motion.button>
          </motion.div>

          <motion.div className="coupon-card interactive-card" whileHover={{ scale: 1.02 }}>
            <div className="coupon-details">
              <span className="coupon-discount">20% OFF</span>
              <h3 className="coupon-title">Audio Premium Tier</h3>
              <p className="coupon-condition">Applicable only for Tech & Audio products.</p>
            </div>
            <motion.button 
              className={`copy-btn ${copiedCode === 'TECH20' ? 'copied' : ''}`} 
              onClick={() => copyToClipboard('TECH20')}
              whileTap={{ scale: 0.9 }}
            >
              {copiedCode === 'TECH20' ? 'Copied! 🎉' : 'Copy Code: TECH20'}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Flash Sale Items */}
      <section className="sale-grid-section">
        <h2 className="section-title">Flash Sale Items</h2>
        <div className="sale-grid">
          {SPECIAL_OFFERS.map((prod) => (
            <motion.div 
              key={prod.id} 
              className="sale-card interactive-card"
              whileHover={{ y: -8 }}
            >
              <div className="sale-image-wrapper">
                <span className="sale-tag">{prod.tag}</span>
                <span className="discount-badge">{prod.discount}</span>
                <img src={prod.image} alt={prod.name} className="sale-image" />
              </div>
              <div className="sale-details">
                <span className="sale-cat">{prod.category}</span>
                <h3 className="sale-name">{prod.name}</h3>
                
                {/* Claimed progress bar */}
                <div className="claimed-bar-wrapper">
                  <div className="claimed-bar-fill" style={{ width: `${prod.claimedPercent}%` }}></div>
                  <span className="claimed-bar-text">🔥 {prod.claimedPercent}% Claimed</span>
                </div>

                <div className="sale-price-row">
                  <div className="price-tag-group">
                    <span className="original-price">{prod.originalPrice}</span>
                    <span className="sale-price">{prod.salePrice}</span>
                  </div>
                  <motion.button 
                    className="btn-icon-add" 
                    onClick={() => handleAddWithConfetti(prod)} 
                    aria-label="Add to Cart"
                    whileHover={{ scale: 1.15, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div 
            className="floating-cart" 
            onClick={() => setCurrentPage('cart')}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-badge">{cartCount}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecialOffers;

