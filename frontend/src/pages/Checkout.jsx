import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useCart, parsePrice, formatPrice } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const Checkout = ({ setCurrentPage }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [isAddressesLoading, setIsAddressesLoading] = useState(true);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const [appliedCoupon] = useState(() => {
    return localStorage.getItem('appliedCoupon') || null;
  });

  const shippingThreshold = 10000;
  const shippingCost = cartTotal >= shippingThreshold || cartTotal === 0 ? 0 : 250;
  
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

  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
  });

  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5000/api/addresses', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setAddresses(data.addresses);
          if (data.addresses.length > 0) {
            const defaultAddr = data.addresses.find(a => a.isDefault);
            setSelectedAddressId(defaultAddr ? defaultAddr._id : data.addresses[0]._id);
          } else {
            setShowNewAddressForm(true);
          }
        }
      } catch (err) {
        console.error('Failed to fetch addresses:', err);
      } finally {
        setIsAddressesLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddressChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value,
    });
    setCheckoutError('');
  };

  const handlePaymentChange = (e) => {
    setPaymentForm({
      ...paymentForm,
      [e.target.name]: e.target.value,
    });
    setCheckoutError('');
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getCardType = (num) => {
    const raw = num.replace(/\s+/g, '');
    if (/^4/.test(raw)) return 'Visa';
    if (/^5[1-5]/.test(raw)) return 'Mastercard';
    if (/^6(011|5)/.test(raw)) return 'Discover';
    if (/^3[47]/.test(raw)) return 'Amex';
    if (/^(508[5-9]|6521|6522)/.test(raw)) return 'RuPay';
    return 'Generic';
  };

  const handleCardNumberInput = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentForm({ ...paymentForm, cardNumber: formatted });
  };

  const handleExpiryInput = (e) => {
    const formatted = formatExpiry(e.target.value);
    setPaymentForm({ ...paymentForm, expiryDate: formatted });
  };

  const handleVerifyUpi = (e) => {
    e.preventDefault();
    if (!paymentForm.upiId.includes('@')) {
      setCheckoutError('Please enter a valid UPI VPA ID (e.g. name@upi)');
      return;
    }
    setIsVerifyingUpi(true);
    setCheckoutError('');
    setTimeout(() => {
      setIsVerifyingUpi(false);
      setIsUpiVerified(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }, 1500);
  };

  const handleNextStep = async () => {
    setCheckoutError('');
    
    if (step === 1) {
      if (showNewAddressForm) {
        const { fullName, phone, streetAddress, city, state, pinCode } = addressForm;
        if (!fullName || !phone || !streetAddress || !city || !state || !pinCode) {
          setCheckoutError('Please fill in all address fields.');
          return;
        }
        if (phone.replace(/[^0-9]/g, '').length < 10) {
          setCheckoutError('Please enter a valid 10-digit phone number.');
          return;
        }
        if (pinCode.length < 5) {
          setCheckoutError('Please enter a valid PIN/ZIP code.');
          return;
        }

        if (saveToProfile) {
          const token = localStorage.getItem('token');
          try {
            const res = await fetch('http://localhost:5000/api/addresses', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(addressForm),
            });
            const data = await res.json();
            if (data.success) {
              setAddresses([...addresses, data.address]);
              setSelectedAddressId(data.address._id);
              setShowNewAddressForm(false);
            } else {
              setCheckoutError(data.message || 'Error saving new address');
              return;
            }
          } catch (err) {
            console.error('Error saving address:', err);
            setCheckoutError('Server error saving your address.');
            return;
          }
        }
      } else {
        if (!selectedAddressId) {
          setCheckoutError('Please select a shipping address.');
          return;
        }
      }
      setStep(2);
    } else if (step === 2) {
      if (paymentMethod === 'Card') {
        const { cardNumber, cardholderName, expiryDate, cvv } = paymentForm;
        if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
          setCheckoutError('Please fill in all card details.');
          return;
        }
        if (cardNumber.replace(/\s+/g, '').length < 15) {
          setCheckoutError('Invalid card number length.');
          return;
        }
        if (!expiryDate.includes('/') || expiryDate.split('/')[0] > 12) {
          setCheckoutError('Invalid card expiry date.');
          return;
        }
        if (cvv.length < 3) {
          setCheckoutError('Invalid CVV.');
          return;
        }
      } else if (paymentMethod === 'UPI') {
        if (!paymentForm.upiId) {
          setCheckoutError('Please enter your UPI ID.');
          return;
        }
        if (!isUpiVerified) {
          setCheckoutError('Please verify your UPI ID before continuing.');
          return;
        }
      } else if (paymentMethod === 'NetBanking') {
        if (!paymentForm.bankName) {
          setCheckoutError('Please select your bank.');
          return;
        }
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setCheckoutError('');
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setIsSubmittingOrder(true);
    setCheckoutError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setCheckoutError('Session expired. Please log in again.');
      setIsSubmittingOrder(false);
      return;
    }

    let finalAddress;
    if (showNewAddressForm) {
      finalAddress = addressForm;
    } else {
      const selected = addresses.find(a => a._id === selectedAddressId);
      if (selected) {
        finalAddress = {
          fullName: selected.fullName,
          phone: selected.phone,
          streetAddress: selected.streetAddress,
          city: selected.city,
          state: selected.state,
          pinCode: selected.pinCode,
          country: selected.country,
        };
      } else {
        finalAddress = addressForm;
      }
    }

    const finalPaymentDetails = {
      cardBrand: paymentMethod === 'Card' ? getCardType(paymentForm.cardNumber) : undefined,
      cardNumber: paymentMethod === 'Card' ? paymentForm.cardNumber : undefined,
      cvv: paymentMethod === 'Card' ? paymentForm.cvv : undefined,
      upiId: paymentMethod === 'UPI' ? paymentForm.upiId : undefined,
      bankName: paymentMethod === 'NetBanking' ? paymentForm.bankName : undefined,
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: finalAddress,
          paymentMethod,
          paymentDetails: finalPaymentDetails,
          appliedCoupon,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPlacedOrder(data.order);
        clearCart();
        localStorage.removeItem('appliedCoupon');

        // Big celebration confetti burst
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.5 }
        });
      } else {
        setCheckoutError(data.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      setCheckoutError('Server error while placing order. Please try again.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="checkout-success-page fade-in">
        <div className="mesh-gradient bg-glow-1 animate-float"></div>
        <div className="mesh-gradient bg-glow-2 animate-float-reverse"></div>
        <motion.div 
          className="success-checkout-card glass-panel"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="success-ring">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          <h1 className="success-headline">Payment & Order Successful!</h1>
          <p className="success-order-num">
            Order Reference: <strong>#{placedOrder._id.substring(placedOrder._id.length - 8).toUpperCase()}</strong>
          </p>
          <div className="delivery-estimate glass-panel">
            <div className="delivery-icon">🚚</div>
            <div className="delivery-details">
              <span>Estimated Delivery</span>
              <strong>
                {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </strong>
            </div>
          </div>
          <div className="success-order-summary">
            <h3>Shipment Sent to:</h3>
            <p className="summary-name">{placedOrder.shippingAddress.fullName}</p>
            <p className="summary-addr">
              {placedOrder.shippingAddress.streetAddress}, {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state} - {placedOrder.shippingAddress.pinCode}
            </p>
            <div className="summary-total-paid">
              <span>Total Paid:</span>
              <strong>{formatPrice(placedOrder.finalTotal)}</strong>
            </div>
          </div>
          <div className="success-buttons">
            <motion.button 
              className="btn-primary-glow" 
              onClick={() => setCurrentPage('orders')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Orders
            </motion.button>
            <motion.button 
              className="btn-secondary-link" 
              onClick={() => setCurrentPage('collections')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Shopping
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="mesh-gradient bg-glow-1 animate-float"></div>
      <div className="mesh-gradient bg-glow-2 animate-float-reverse"></div>

      <motion.header 
        className="checkout-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button 
          className="btn-back" 
          onClick={() => setCurrentPage('cart')}
          whileHover={{ x: -4 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Cart
        </motion.button>
        <h1 className="checkout-title">Secure Checkout</h1>
      </motion.header>

      {/* Stepper Progress Bar */}
      <div className="checkout-stepper glass-panel">
        <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <span className="step-label">Shipping</span>
        </div>
        <div className="step-line"></div>
        <div className={`step-item ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <span className="step-label">Payment</span>
        </div>
        <div className="step-line"></div>
        <div className={`step-item ${step >= 3 ? 'active' : ''} ${step === 3 ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <span className="step-label">Review</span>
        </div>
      </div>

      <AnimatePresence>
        {checkoutError && (
          <motion.div 
            className="checkout-error-banner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="error-icon">⚠️</span>
            <span>{checkoutError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="checkout-grid">
        <div className="checkout-main-content glass-panel">
          <AnimatePresence mode="wait">
            {/* STEP 1: SHIPPING ADDRESS */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="checkout-section"
              >
                <h2 className="section-title">Select Shipping Address</h2>
                
                {isAddressesLoading ? (
                  <div className="checkout-loading">
                    <div className="spinner-loader"></div>
                    <p>Loading your saved addresses...</p>
                  </div>
                ) : (
                  <>
                    {addresses.length > 0 && !showNewAddressForm && (
                      <div className="addresses-grid">
                        {addresses.map((addr) => (
                          <motion.div 
                            key={addr._id} 
                            className={`address-card ${selectedAddressId === addr._id ? 'selected' : ''}`}
                            onClick={() => setSelectedAddressId(addr._id)}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="address-card-header">
                              <span className="address-name">{addr.fullName}</span>
                              {addr.isDefault && <span className="default-badge">Default</span>}
                              {selectedAddressId === addr._id && <span className="check-icon">✓</span>}
                            </div>
                            <p className="address-details">
                              {addr.streetAddress},<br />
                              {addr.city}, {addr.state} - {addr.pinCode}<br />
                              {addr.country}
                            </p>
                            <p className="address-phone">📞 {addr.phone}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {addresses.length > 0 && !showNewAddressForm && (
                      <motion.button 
                        className="btn-add-address" 
                        onClick={() => {
                          setShowNewAddressForm(true);
                          setCheckoutError('');
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        + Add a New Delivery Address
                      </motion.button>
                    )}

                    {(addresses.length === 0 || showNewAddressForm) && (
                      <div className="new-address-form-wrapper">
                        {addresses.length > 0 && (
                          <button className="btn-cancel-address" onClick={() => setShowNewAddressForm(false)}>
                            ← Back to Saved Addresses
                          </button>
                        )}
                        <h3 className="form-subtitle">New Shipping Address</h3>
                        <div className="form-grid">
                          <div className="form-group span-2">
                            <label>Full Name</label>
                            <input 
                              type="text" 
                              name="fullName" 
                              value={addressForm.fullName} 
                              onChange={handleAddressChange}
                              placeholder="John Doe" 
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <label>Phone Number</label>
                            <input 
                              type="tel" 
                              name="phone" 
                              value={addressForm.phone} 
                              onChange={handleAddressChange}
                              placeholder="10-digit number" 
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <label>PIN/ZIP Code</label>
                            <input 
                              type="text" 
                              name="pinCode" 
                              value={addressForm.pinCode} 
                              onChange={handleAddressChange}
                              placeholder="e.g. 400001" 
                              required 
                            />
                          </div>
                          <div className="form-group span-2">
                            <label>Street Address</label>
                            <input 
                              type="text" 
                              name="streetAddress" 
                              value={addressForm.streetAddress} 
                              onChange={handleAddressChange}
                              placeholder="Flat/House no., Building, Street name" 
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <label>City</label>
                            <input 
                              type="text" 
                              name="city" 
                              value={addressForm.city} 
                              onChange={handleAddressChange}
                              placeholder="Mumbai" 
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <label>State</label>
                            <input 
                              type="text" 
                              name="state" 
                              value={addressForm.state} 
                              onChange={handleAddressChange}
                              placeholder="Maharashtra" 
                              required 
                            />
                          </div>
                        </div>

                        {addresses.length > 0 && (
                          <div className="checkbox-group">
                            <input 
                              type="checkbox" 
                              id="saveToProfile" 
                              checked={saveToProfile} 
                              onChange={(e) => setSaveToProfile(e.target.checked)} 
                            />
                            <label htmlFor="saveToProfile">Save this address to my profile for future orders</label>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* STEP 2: PAYMENT METHOD */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="checkout-section"
              >
                <h2 className="section-title">Select Payment Mode</h2>
                
                <div className="payment-method-selector">
                  {['Card', 'UPI', 'NetBanking', 'COD'].map((method) => (
                    <button 
                      key={method}
                      className={`payment-tab-btn ${paymentMethod === method ? 'active' : ''}`}
                      onClick={() => { setPaymentMethod(method); setCheckoutError(''); }}
                    >
                      {method === 'Card' && '💳 Credit/Debit Card'}
                      {method === 'UPI' && '⚡ UPI Payment'}
                      {method === 'NetBanking' && '🏦 Net Banking'}
                      {method === 'COD' && '💵 Cash on Delivery'}
                    </button>
                  ))}
                </div>

                <div className="payment-form-content">
                  {paymentMethod === 'Card' && (
                    <div className="card-payment-wrapper">
                      {/* Interactive 3D Flipping Card */}
                      <div className="card-3d-perspective">
                        <motion.div 
                          className={`live-card-graphic ${isCardFlipped ? 'flipped' : ''}`}
                          animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                        >
                          {/* Front Side */}
                          <div className="live-card-inner card-front">
                            <div className="live-card-row">
                              <div className="live-card-chip"></div>
                              <div className="live-card-brand">{getCardType(paymentForm.cardNumber)}</div>
                            </div>
                            <div className="live-card-number">
                              {paymentForm.cardNumber || '•••• •••• •••• ••••'}
                            </div>
                            <div className="live-card-row">
                              <div className="live-card-holder">
                                <span>Cardholder</span>
                                <strong>{paymentForm.cardholderName.toUpperCase() || 'YOUR NAME'}</strong>
                              </div>
                              <div className="live-card-expiry">
                                <span>Expires</span>
                                <strong>{paymentForm.expiryDate || 'MM/YY'}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Back Side */}
                          <div className="live-card-inner card-back">
                            <div className="magnetic-stripe"></div>
                            <div className="cvv-bar-container">
                              <span>CVV</span>
                              <div className="cvv-bar-display">{paymentForm.cvv || '•••'}</div>
                            </div>
                            <div className="card-back-text">LuxeMarket Encrypted Platinum Access</div>
                          </div>
                        </motion.div>
                      </div>

                      <div className="form-grid card-inputs-grid">
                        <div className="form-group span-2">
                          <label>Card Number</label>
                          <input 
                            type="text" 
                            placeholder="4111 2222 3333 4444" 
                            maxLength="19" 
                            value={paymentForm.cardNumber}
                            onChange={handleCardNumberInput} 
                            required 
                          />
                        </div>
                        <div className="form-group span-2">
                          <label>Cardholder Name</label>
                          <input 
                            type="text" 
                            name="cardholderName" 
                            placeholder="John Doe" 
                            value={paymentForm.cardholderName} 
                            onChange={handlePaymentChange}
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY" 
                            maxLength="5" 
                            value={paymentForm.expiryDate} 
                            onChange={handleExpiryInput}
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input 
                            type="password" 
                            name="cvv" 
                            placeholder="•••" 
                            maxLength="4" 
                            value={paymentForm.cvv} 
                            onChange={handlePaymentChange}
                            onFocus={() => setIsCardFlipped(true)}
                            onBlur={() => setIsCardFlipped(false)}
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'UPI' && (
                    <div className="upi-payment-wrapper">
                      <p className="upi-intro">Enter your virtual payment address (VPA) / UPI ID below to securely verify and pay.</p>
                      <div className="upi-form-row">
                        <div className="form-group">
                          <label>UPI ID / VPA</label>
                          <input 
                            type="text" 
                            name="upiId" 
                            placeholder="e.g. johndoe@okhdfcbank" 
                            value={paymentForm.upiId} 
                            onChange={(e) => {
                              setPaymentForm({ ...paymentForm, upiId: e.target.value });
                              setIsUpiVerified(false);
                              setCheckoutError('');
                            }}
                            required 
                          />
                        </div>
                        <motion.button 
                          className={`btn-verify-upi ${isUpiVerified ? 'verified' : ''}`}
                          onClick={handleVerifyUpi}
                          disabled={isVerifyingUpi || !paymentForm.upiId}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isVerifyingUpi ? (
                            <div className="small-loader"></div>
                          ) : isUpiVerified ? (
                            '✓ Verified'
                          ) : (
                            'Verify'
                          )}
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'NetBanking' && (
                    <div className="netbanking-payment-wrapper">
                      <p className="nb-intro">Select from our list of popular banks, or select another bank from the menu.</p>
                      <div className="nb-grid">
                        {['SBI', 'HDFC', 'ICICI', 'AXIS', 'KOTAK'].map((bank) => (
                          <motion.button 
                            key={bank}
                            className={`nb-bank-btn ${paymentForm.bankName === bank ? 'selected' : ''}`}
                            onClick={() => setPaymentForm({ ...paymentForm, bankName: bank })}
                            whileHover={{ scale: 1.04 }}
                          >
                            <span className="bank-logo-icon">🏦</span>
                            <span className="bank-logo-name">{bank} Bank</span>
                          </motion.button>
                        ))}
                      </div>
                      <div className="form-group nb-select-group">
                        <label>All Other Banks</label>
                        <select 
                          value={paymentForm.bankName} 
                          onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                          className="nb-select"
                        >
                          <option value="">-- Choose your Bank --</option>
                          <option value="YesBank">Yes Bank</option>
                          <option value="IndusInd">IndusInd Bank</option>
                          <option value="IDFC">IDFC First Bank</option>
                          <option value="PunjabNational">Punjab National Bank</option>
                          <option value="BankOfBaroda">Bank of Baroda</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'COD' && (
                    <div className="cod-payment-wrapper">
                      <div className="cod-info-box">
                        <div className="cod-icon">💵</div>
                        <div className="cod-text">
                          <h3>Pay on Delivery</h3>
                          <p>No prepayment is required. You can pay using cash, credit card, or any UPI app once the delivery executive arrives at your doorstep.</p>
                          <p className="cod-restriction">Please ensure someone is available at the shipping address to receive the delivery.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: REVIEW & ORDER */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="checkout-section"
              >
                <h2 className="section-title">Review and Complete Order</h2>
                
                <div className="review-grids">
                  <div className="review-group">
                    <h3>Delivery Address</h3>
                    <div className="review-card">
                      {(() => {
                        const addr = showNewAddressForm ? addressForm : addresses.find(a => a._id === selectedAddressId) || addressForm;
                        return (
                          <>
                            <strong>{addr.fullName}</strong>
                            <p>{addr.streetAddress}, {addr.city}, {addr.state} - {addr.pinCode}</p>
                            <p>Phone: {addr.phone}</p>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="review-group">
                    <h3>Payment Method</h3>
                    <div className="review-card">
                      {paymentMethod === 'Card' && (
                        <p>💳 Credit/Debit Card ending in <strong>{paymentForm.cardNumber.slice(-4)}</strong> ({getCardType(paymentForm.cardNumber)})</p>
                      )}
                      {paymentMethod === 'UPI' && (
                        <p>⚡ UPI ID: <strong>{paymentForm.upiId}</strong> (Verified)</p>
                      )}
                      {paymentMethod === 'NetBanking' && (
                        <p>🏦 Net Banking: <strong>{paymentForm.bankName} Bank</strong></p>
                      )}
                      {paymentMethod === 'COD' && (
                        <p>💵 Cash on Delivery (COD)</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="review-items-list">
                  <h3>Items in Shipment</h3>
                  <div className="review-items-container">
                    {cartItems.map((item) => (
                      <div key={item.id} className="review-item-row">
                        <img src={item.image} alt={item.name} className="review-item-thumb" />
                        <div className="review-item-desc">
                          <h4>{item.name}</h4>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <span className="review-item-price">
                          {formatPrice(parsePrice(item.salePrice || item.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls Navigation */}
          <div className="checkout-controls">
            {step > 1 && (
              <motion.button 
                className="btn-checkout-prev" 
                onClick={handlePrevStep} 
                disabled={isSubmittingOrder}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back
              </motion.button>
            )}
            
            {step < 3 ? (
              <motion.button 
                className="btn-checkout-next" 
                onClick={handleNextStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </motion.button>
            ) : (
              <motion.button 
                className="btn-checkout-place" 
                onClick={handlePlaceOrder} 
                disabled={isSubmittingOrder}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isSubmittingOrder ? (
                  <div className="loader"></div>
                ) : (
                  <>
                    Pay & Place Order
                    <span className="btn-total-badge">{formatPrice(finalTotal)}</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Sidebar Summary Area */}
        <div className="checkout-sidebar glass-panel">
          <h3>Order Overview</h3>
          <div className="overview-details">
            <div className="overview-row">
              <span>Items Total ({cartItems.length})</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>

            {appliedCoupon && (
              <div className="overview-row discount">
                <span>Discount ({appliedCoupon})</span>
                <strong>-{formatPrice(discountAmount)}</strong>
              </div>
            )}

            <div className="overview-row">
              <span>Shipping Fee</span>
              <strong>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</strong>
            </div>

            <hr className="overview-divider" />

            <div className="overview-row total">
              <span>Total Payable</span>
              <strong>{formatPrice(finalTotal)}</strong>
            </div>
          </div>

          <div className="safety-guarantee">
            <span className="lock-icon">🔒</span>
            <p>128-bit SSL encrypted safe checkout transaction. All data is processed securely.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

