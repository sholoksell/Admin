const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Get all products
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};

    if (category) query.categoryId = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).populate('categoryId', 'name').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', authMiddleware, async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk delete
router.post('/bulk-delete', authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;
    await Product.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${ids.length} products deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk update status
router.post('/bulk-update', authMiddleware, async (req, res) => {
  try {
    const { ids, status } = req.body;
    await Product.updateMany(
      { _id: { $in: ids } },
      { status }
    );
    res.json({ message: `${ids.length} products updated successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update stock
router.patch('/:id/stock', authMiddleware, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
