const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const authMiddleware = require('../middleware/auth');

// Get all payments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, method } = req.query;
    let query = {};

    if (status) query.status = status;
    if (method) query.method = method;

    const payments = await Payment.find(query)
      .populate('orderId', 'orderNumber total')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('orderId', 'orderNumber total customerId')
      .populate({
        path: 'orderId',
        populate: { path: 'customerId', select: 'name email' }
      });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create payment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update payment
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
