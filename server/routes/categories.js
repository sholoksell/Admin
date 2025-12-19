const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');

// Get all categories
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find().populate('parentId', 'name').sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get category by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parentId', 'name');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create category
router.post('/', authMiddleware, async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update category
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete category
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk delete
router.post('/bulk-delete', authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;
    await Category.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${ids.length} categories deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk update status
router.post('/bulk-update', authMiddleware, async (req, res) => {
  try {
    const { ids, isActive } = req.body;
    await Category.updateMany(
      { _id: { $in: ids } },
      { isActive }
    );
    res.json({ message: `${ids.length} categories updated successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get hierarchical categories for shop by category section
router.get('/public/shop-by-category', async (req, res) => {
  try {
    // Get all active categories
    const allCategories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    
    // Build hierarchy
    const categoryMap = {};
    const rootCategories = [];
    
    // First pass: create map
    allCategories.forEach(cat => {
      categoryMap[cat._id.toString()] = {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        featured: cat.featured,
        order: cat.order,
        subcategories: []
      };
    });
    
    // Second pass: build hierarchy
    allCategories.forEach(cat => {
      if (cat.parentId) {
        const parent = categoryMap[cat.parentId.toString()];
        if (parent) {
          parent.subcategories.push(categoryMap[cat._id.toString()]);
        }
      } else {
        rootCategories.push(categoryMap[cat._id.toString()]);
      }
    });
    
    res.json(rootCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured categories with subcategories
router.get('/public/featured', async (req, res) => {
  try {
    const featuredCategories = await Category.find({ 
      isActive: true, 
      featured: true,
      parentId: null 
    }).sort({ order: 1, name: 1 });
    
    const categoriesWithSubs = await Promise.all(
      featuredCategories.map(async (cat) => {
        const subcategories = await Category.find({ 
          isActive: true, 
          parentId: cat._id 
        }).sort({ order: 1, name: 1 }).limit(8);
        
        return {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          subcategories
        };
      })
    );
    
    res.json(categoriesWithSubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
