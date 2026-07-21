import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useCart, parsePrice, formatPrice } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = ({ setCurrentPage, setRedirectPage }) => {
  const { user } = useAuth();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    return localStorage.getItem('appliedCoupon') || null;
  });
  const [couponError, setCouponError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('appliedCoupon', appliedCoupon);
    } else {
      localStorage.removeItem('appliedCoupon');
    }
  }, [appliedCoupon]);

  const shippingThreshold = 10000;
  const shippingCost = cartTotal >= shippingThreshold || cartTotal === 0 ? 0 : 250;
  const freeShippingProgress = Math.min(100, Math.round((cartTotal / shippingThreshold) * 100));

  const getTechDiscount = () => {
    return cartItems.reduce((acc, item) => {
      if (item.category === 'Tech & Audio') {
        const itemPrice = parsePrice(item.salePrice || item.price);
        return acc + itemPrice * item.quantity * 0.2;
      }
      return acc;
    }, 0);
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === 'SUMMER15') {
      return cartTotal * 0.15;
    }
    if (appliedCoupon === 'TECH20') {
      return getTechDiscount();
    }
    return 0;
  };

  const discountAmount = getDiscountAmount();
  const finalTotal = cartTotal - discountAmount + shippingCost;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'SUMMER15') {
      setAppliedCoupon('SUMMER15');
      setCouponCode('');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    } else if (code === 'TECH20') {
      const hasTechItems = cartItems.some(item => item.category === 'Tech & Audio');
      if (!hasTechItems) {
        setCouponError('Coupon TECH20 is only applicable to Tech & Audio items.');
      } else {
        setAppliedCoupon('TECH20');
        setCouponCode('');
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      }
    } else {
      setCouponError('Invalid coupon code. Try SUMMER15 or TECH20.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleCheckout = () => {
    if (!user) {
      setRedirectPage('checkout');
      setCurrentPage('login');
    } else {
      setCurrentPage('checkout');
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="checkout-success-container fade-in">
        <div className="mesh-gradient bg-glow-1 animate-float"></div>
        <div className="mesh-gradient bg-glow-2 animate-float-reverse"></div>
        <div className="success-card glass-panel">
          <div className="success-icon-wrapper">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          <h2 className="success-title">Order Placed Successfully!</h2>
          <p className="success-message">
            Thank you for your purchase. We are processing your order and will notify you when it ships.
          </p>
          <div className="success-actions">
            <motion.button 
              className="btn-primary-glow" 
              onClick={() => setCurrentPage('collections')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Shopping
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="mesh-gradient bg-glow-1 animate-float"></div>
      <div className="mesh-gradient bg-glow-2 animate-float-reverse"></div>

      <motion.header 
        className="cart-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button 
          className="btn-back" 
          onClick={() => setCurrentPage('collections')}
          whileHover={{ x: -4 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Shop
        </motion.button>
        <h1 className="cart-title">Your Cart</h1>
      </motion.header>

      {/* Free Shipping Truck Progress Bar */}
      {cartItems.length > 0 && (
        <motion.div 
          className="shipping-truck-card glass-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="truck-bar-header">
            <span>
              {freeShippingProgress >= 100 ? (
                <>🎉 You unlocked <strong>FREE Express Shipping</strong>!</>
              ) : (
                <>Add <strong>{formatPrice(shippingThreshold - cartTotal)}</strong> more for <strong>FREE Shipping</strong></>
              )}
            </span>
          </div>
          <div className="truck-progress-track">
            <motion.div 
              className="truck-progress-fill"
              animate={{ width: `${freeShippingProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div 
              className="truck-icon-mover"
              animate={{ left: `${Math.min(94, Math.max(2, freeShippingProgress))}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              🚚
            </motion.div>
          </div>
        </motion.div>
      )}

      {cartItems.length === 0 ? (
        <motion.div 
          className="empty-cart-state glass-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Explore our curated collections and add items to your cart to see them here.</p>
          <motion.button 
            className="btn-primary-glow" 
            onClick={() => setCurrentPage('collections')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Shopping
          </motion.button>
        </motion.div>
      ) : (
        <div className="cart-content-layout">
          {/* Cart Items List */}
          <div className="cart-items-section">
            <div className="cart-items-container glass-panel">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => {
                  const itemUnitPrice = parsePrice(item.salePrice || item.price);
                  const itemSubtotal = itemUnitPrice * item.quantity;

                  return (
                    <motion.div 
                      layout
                      key={item.id} 
                      className="cart-item-card"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                      
                      <div className="cart-item-details">
                        <span className="cart-item-category">{item.category}</span>
                        <h3 className="cart-item-name">{item.name}</h3>
                        <div className="cart-item-price-info">
                          {item.salePrice ? (
                            <>
                              <span className="cart-item-sale-price">{item.salePrice}</span>
                              <span className="cart-item-original-price">{item.price}</span>
                            </>
                          ) : (
                            <span className="cart-item-price">{item.price}</span>
                          )}
                        </div>
                      </div>

                      <div className="cart-item-actions-row">
                        <div className="quantity-controls">
                          <motion.button 
                            className="quantity-btn" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                          >
                            −
                          </motion.button>
                          <span className="quantity-display">{item.quantity}</span>
                          <motion.button 
                            className="quantity-btn" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                          >
                            +
                          </motion.button>
                        </div>

                        <span className="cart-item-total">{formatPrice(itemSubtotal)}</span>

                        <motion.button 
                          className="btn-remove" 
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          whileHover={{ scale: 1.15, rotate: 15 }}
                          whileTap={{ scale: 0.85 }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            <motion.button 
              className="btn-clear-cart" 
              onClick={clearCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear Cart
            </motion.button>
          </div>

          {/* Cart Summary Section */}
          <div className="cart-summary-section">
            {/* Promo Code Form */}
            <div className="coupon-card-wrapper glass-panel">
              <h3>Have a Promo Code?</h3>
              {appliedCoupon ? (
                <div className="applied-coupon-badge">
                  <span>
                    Active: <strong>{appliedCoupon}</strong> 
                    ({appliedCoupon === 'SUMMER15' ? '15% Off' : '20% Off Tech'})
                  </span>
                  <button className="btn-remove-coupon" onClick={handleRemoveCoupon}>×</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <input
                    type="text"
                    placeholder="Enter code (SUMMER15 / TECH20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="coupon-input"
                  />
                  <motion.button 
                    type="submit" 
                    className="coupon-apply-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply
                  </motion.button>
                </form>
              )}
              {couponError && <p className="coupon-error-msg">{couponError}</p>}
            </div>

            {/* Price Calculations */}
            <div className="summary-details-card glass-panel">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">{formatPrice(cartTotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="summary-row discount-row">
                  <span className="summary-label">Discount ({appliedCoupon})</span>
                  <span className="summary-value">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-value">
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>
              
              <hr className="summary-divider" />

              <div className="summary-row total-row">
                <span className="summary-label">Total</span>
                <span className="summary-value">{formatPrice(finalTotal)}</span>
              </div>

              <motion.button 
                className="btn-checkout-glow" 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isCheckingOut ? (
                  <div className="loader"></div>
                ) : (
                  <>
                    Proceed to Checkout
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

