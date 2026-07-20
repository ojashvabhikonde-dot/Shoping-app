const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { sendOrderConfirmation, sendOrderStatusUpdate } = require('../utils/email');


// Helper to parse price string like "₹19,900" or number to float
const parsePrice = (priceVal) => {
  if (!priceVal) return 0;
  if (typeof priceVal === 'number') return priceVal;
  const numericStr = priceVal.replace(/[₹,]/g, '').trim();
  return parseFloat(numericStr) || 0;
};

// @desc    Get all orders for the authenticated user
// @route   GET /api/orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ orderDate: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching orders' });
  }
});

// @desc    Create/Place a new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentDetails, appliedCoupon } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || 
        !shippingAddress.streetAddress || !shippingAddress.city || !shippingAddress.state || 
        !shippingAddress.pinCode) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: 'Payment method is required' });
    }

    // Server-side calculation of pricing to prevent tampering
    let cartTotal = 0;
    const formattedItems = items.map(item => {
      const unitPrice = parsePrice(item.salePrice || item.price);
      cartTotal += unitPrice * item.quantity;
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        salePrice: item.salePrice,
        quantity: item.quantity,
        image: item.image,
        category: item.category
      };
    });

    // Discount calculations
    let discountAmount = 0;
    if (appliedCoupon === 'SUMMER15') {
      discountAmount = cartTotal * 0.15;
    } else if (appliedCoupon === 'TECH20') {
      discountAmount = items.reduce((acc, item) => {
        if (item.category === 'Tech & Audio') {
          const itemPrice = parsePrice(item.salePrice || item.price);
          return acc + itemPrice * item.quantity * 0.2;
        }
        return acc;
      }, 0);
    }

    // Shipping Cost (Free for subtotal >= 10000)
    const shippingCost = cartTotal >= 10000 || cartTotal === 0 ? 0 : 250;
    const finalTotal = cartTotal - discountAmount + shippingCost;

    // Secure sensitive payment details depending on method
    const processedPaymentDetails = {};
    let paymentStatus = 'Pending';

    if (paymentMethod === 'Card') {
      // Mock payment gate approval
      if (!paymentDetails || !paymentDetails.cardNumber || !paymentDetails.cvv) {
        return res.status(400).json({ success: false, message: 'Card details are incomplete' });
      }
      const rawCard = paymentDetails.cardNumber.replace(/\s+/g, '');
      if (rawCard.length < 15) {
        return res.status(400).json({ success: false, message: 'Invalid card number' });
      }
      processedPaymentDetails.transactionId = 'tx_' + Math.random().toString(36).substr(2, 9);
      processedPaymentDetails.cardBrand = paymentDetails.cardBrand || 'Visa';
      processedPaymentDetails.last4 = rawCard.slice(-4);
      paymentStatus = 'Paid';
    } else if (paymentMethod === 'UPI') {
      if (!paymentDetails || !paymentDetails.upiId) {
        return res.status(400).json({ success: false, message: 'UPI ID is required' });
      }
      processedPaymentDetails.transactionId = 'tx_' + Math.random().toString(36).substr(2, 9);
      processedPaymentDetails.upiId = paymentDetails.upiId;
      paymentStatus = 'Paid';
    } else if (paymentMethod === 'NetBanking') {
      if (!paymentDetails || !paymentDetails.bankName) {
        return res.status(400).json({ success: false, message: 'Bank selection is required' });
      }
      processedPaymentDetails.transactionId = 'tx_' + Math.random().toString(36).substr(2, 9);
      processedPaymentDetails.bankName = paymentDetails.bankName;
      paymentStatus = 'Paid';
    } else if (paymentMethod === 'COD') {
      processedPaymentDetails.transactionId = 'cod_' + Math.random().toString(36).substr(2, 9);
      paymentStatus = 'Pending';
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported payment method' });
    }

    const order = await Order.create({
      user: req.user._id,
      items: formattedItems,
      shippingAddress,
      paymentMethod,
      paymentDetails: processedPaymentDetails,
      totalAmount: Math.round(cartTotal),
      shippingCost,
      discountAmount: Math.round(discountAmount),
      finalTotal: Math.round(finalTotal),
      paymentStatus,
      status: 'Processing',
    });

    // Send order confirmation email (async)
    sendOrderConfirmation(req.user, order);

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Place Order Error:', error);
    res.status(500).json({ success: false, message: 'Server error processing your order' });
  }
});

// @desc    Update order status (Simulation)
// @route   PATCH /api/orders/:id/status
// @access  Private
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    if (status && !['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    // Send order status update email (async)
    sendOrderStatusUpdate(req.user, order);

    res.json({ success: true, order });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating order status' });
  }
});

module.exports = router;
