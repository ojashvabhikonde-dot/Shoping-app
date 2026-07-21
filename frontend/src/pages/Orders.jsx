import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { formatPrice, parsePrice } from '../context/CartContext';
import './Orders.css';

const Orders = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: newStatus,
          paymentStatus: newStatus === 'Delivered' ? 'Paid' : undefined
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? data.order : o));
        if (newStatus === 'Delivered') {
          triggerConfetti();
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your orders.');
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || 'Failed to fetch orders.');
        }
      } catch (err) {
        console.error('Fetch orders error:', err);
        setError('Server error fetching orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpandOrder = (id) => {
    if (expandedOrderId === id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(id);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Processing': return 'status-processing';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };


  return (
    <div className="orders-page">
      <canvas id="confetti-canvas" style={{position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', pointerEvents:'none', zIndex: 9999}} />
      <div className="mesh-gradient bg-glow-1"></div>
      <div className="mesh-gradient bg-glow-2"></div>

      <header className="orders-header fade-in">
        <button className="btn-back" onClick={() => setCurrentPage('landing')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
        <h1 className="orders-title">Your Order History</h1>
      </header>

      {isLoading ? (
        <div className="orders-loading glass-panel fade-in">
          <div className="spinner-loader"></div>
          <p>Fetching your orders...</p>
        </div>
      ) : error ? (
        <div className="orders-error-state glass-panel fade-in">
          <span className="error-icon">⚠️</span>
          <h2>An error occurred</h2>
          <p>{error}</p>
          <button className="btn-primary-glow" onClick={() => setCurrentPage('login')}>
            Sign In
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-orders-state glass-panel fade-in">
          <div className="empty-icon">📦</div>
          <h2>No orders found</h2>
          <p>You haven't placed any orders yet. Discover our collections to place your first order!</p>
          <button className="btn-primary-glow" onClick={() => setCurrentPage('collections')}>
            Explore Shop
          </button>
        </div>
      ) : (
        <div className="orders-list-container fade-in">
          {orders.map((order) => {
            const shortId = order._id.substring(order._id.length - 8).toUpperCase();
            const isExpanded = expandedOrderId === order._id;
            const orderDateStr = new Date(order.orderDate).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <motion.div 
                key={order._id} 
                className={`order-card glass-panel ${isExpanded ? 'expanded' : ''}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Order card header summary */}
                <div className="order-summary-row" onClick={() => toggleExpandOrder(order._id)}>
                  <div className="summary-block">
                    <span className="label">Order ID</span>
                    <strong className="value">#{shortId}</strong>
                  </div>
                  
                  <div className="summary-block">
                    <span className="label">Date Placed</span>
                    <strong className="value">{orderDateStr}</strong>
                  </div>

                  <div className="summary-block">
                    <span className="label">Total Amount</span>
                    <strong className="value total-price">{formatPrice(order.finalTotal)}</strong>
                  </div>

                  <div className="summary-block">
                    <span className="label">Status</span>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <button className="btn-expand-toggle" aria-label="Toggle details">
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5"
                      className={`chevron-icon ${isExpanded ? 'rotate' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>

                {/* Expanded Details Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      className="order-expanded-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >

                    <hr className="details-divider" />
                    
                    <div className="details-grid">
                      {/* Shipping Info */}
                      <div className="details-section">
                        <h4>Shipping Address</h4>
                        <div className="section-content address-content">
                          <strong>{order.shippingAddress.fullName}</strong>
                          <p>{order.shippingAddress.streetAddress}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
                          <p>Phone: {order.shippingAddress.phone}</p>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="details-section">
                        <h4>Payment Information</h4>
                        <div className="section-content payment-content">
                          <p>Method: <strong>{order.paymentMethod}</strong></p>
                          <p>Status: <span className={`payment-status ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span></p>
                          {order.paymentMethod === 'Card' && (
                            <p>Card: <strong>{order.paymentDetails.cardBrand}</strong> ending in <strong>•••• {order.paymentDetails.last4}</strong></p>
                          )}
                          {order.paymentMethod === 'UPI' && (
                            <p>UPI VPA: <strong>{order.paymentDetails.upiId}</strong></p>
                          )}
                          {order.paymentMethod === 'NetBanking' && (
                            <p>Bank: <strong>{order.paymentDetails.bankName} Bank</strong></p>
                          )}
                          <p>Txn ID: <code className="txn-code">{order.paymentDetails.transactionId}</code></p>
                        </div>
                      </div>

                      {/* Pricing Summary */}
                      <div className="details-section">
                        <h4>Order Pricing Summary</h4>
                        <div className="section-content pricing-summary-content">
                          <div className="pricing-row">
                            <span>Subtotal:</span>
                            <span>{formatPrice(order.totalAmount)}</span>
                          </div>
                          {order.discountAmount > 0 && (
                            <div className="pricing-row discount">
                              <span>Discount:</span>
                              <span>-{formatPrice(order.discountAmount)}</span>
                            </div>
                          )}
                          <div className="pricing-row">
                            <span>Shipping:</span>
                            <span>{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span>
                          </div>
                          <hr className="pricing-divider" />
                          <div className="pricing-row final">
                            <span>Total Paid:</span>
                            <strong>{formatPrice(order.finalTotal)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="simulation-controls-wrapper">
                      <span className="sim-title">Admin simulation panel:</span>
                      <div className="sim-buttons">
                        <button 
                          className="btn-sim processing" 
                          onClick={() => handleUpdateStatus(order._id, 'Processing')}
                          disabled={order.status === 'Processing'}
                        >
                          ⚙️ Process
                        </button>
                        <button 
                          className="btn-sim shipped" 
                          onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                          disabled={order.status === 'Shipped'}
                        >
                          🚚 Ship
                        </button>
                        <button 
                          className="btn-sim delivered" 
                          onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                          disabled={order.status === 'Delivered'}
                        >
                          🎉 Deliver
                        </button>
                        <button 
                          className="btn-sim cancelled" 
                          onClick={() => handleUpdateStatus(order._id, 'Cancelled')}
                          disabled={order.status === 'Cancelled'}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="details-items-section">
                      <h4>Items Ordered</h4>
                      <div className="details-items-grid">
                        {order.items.map((item) => (
                          <div key={item.id} className="detail-item-card">
                            <img src={item.image} alt={item.name} className="detail-item-image" />
                            <div className="detail-item-info">
                              <span className="item-category">{item.category}</span>
                              <h5 className="item-name">{item.name}</h5>
                              <div className="item-meta">
                                <span className="item-quantity">Qty: {item.quantity}</span>
                                <span className="item-unit-price">Unit: {item.salePrice || item.price}</span>
                              </div>
                            </div>
                            <strong className="detail-item-subtotal">
                              {formatPrice(parsePrice(item.salePrice || item.price) * item.quantity)}
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    )}
  </div>
);
};

export default Orders;
