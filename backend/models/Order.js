const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  salePrice: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [OrderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Card', 'UPI', 'NetBanking', 'COD'],
    },
    paymentDetails: {
      transactionId: { type: String },
      cardBrand: { type: String },
      last4: { type: String },
      upiId: { type: String },
      bankName: { type: String },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    finalTotal: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Processing',
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    },
    paymentStatus: {
      type: String,
      required: true,
      default: 'Pending',
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', OrderSchema);
