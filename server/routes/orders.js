const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const authMiddleware = require('../middleware/auth');

// Get all orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, paymentStatus, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.orderNumber = { $regex: search, $options: 'i' };
    }

    const orders = await Order.find(query)
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('items.productId', 'name images');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Generate order number
    const count = await Order.countDocuments();
    const orderNumber = `#ORD-${String(count + 1).padStart(5, '0')}`;

    const order = new Order({
      ...req.body,
      orderNumber,
    });
    const savedOrder = await order.save();

    // Update customer stats
    await Customer.findByIdAndUpdate(req.body.customerId, {
      $inc: { totalOrders: 1, totalSpent: req.body.total },
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete order
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
