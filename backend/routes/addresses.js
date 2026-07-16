const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const { protect } = require('../middleware/auth');

// @desc    Get all saved addresses of user
// @route   GET /api/addresses
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, addresses });
  } catch (error) {
    console.error('Get Addresses Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching addresses' });
  }
});

// @desc    Create/Save a new address
// @route   POST /api/addresses
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { fullName, phone, streetAddress, city, state, pinCode, country, isDefault } = req.body;

    // Validation
    if (!fullName || !phone || !streetAddress || !city || !state || !pinCode) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (phone.length < 10) {
      return res.status(400).json({ success: false, message: 'Phone number must be at least 10 characters' });
    }

    if (pinCode.length < 5) {
      return res.status(400).json({ success: false, message: 'PIN/ZIP code must be at least 5 characters' });
    }

    // If this address is set as default, unset other defaults
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    // Check if user has no addresses yet, make this default
    const count = await Address.countDocuments({ user: req.user._id });
    const setAsDefault = count === 0 ? true : !!isDefault;

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      streetAddress,
      city,
      state,
      pinCode,
      country: country || 'India',
      isDefault: setAsDefault,
    });

    res.status(201).json({ success: true, address });
  } catch (error) {
    console.error('Create Address Error:', error);
    res.status(500).json({ success: false, message: 'Server error saving address' });
  }
});

// @desc    Delete a saved address
// @route   DELETE /api/addresses/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found or unauthorized' });
    }

    await address.deleteOne();

    // If the deleted address was default, set the latest remaining address as default
    if (address.isDefault) {
      const remaining = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 });
      if (remaining) {
        remaining.isDefault = true;
        await remaining.save();
      }
    }

    res.json({ success: true, message: 'Address removed successfully' });
  } catch (error) {
    console.error('Delete Address Error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting address' });
  }
});

module.exports = router;
