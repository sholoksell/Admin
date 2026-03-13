const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');

// ─── PUBLIC ROUTES (must be before /:id) ────────────────────────────────────

// Get category by slug - public, used by storefront CategoryPage
router.get('/public/slug/:slug', async (req, res) => {
  try {
    const cat = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    // Get subcategories
    const subcategories = await Category.find({ parentId: cat._id, isActive: true }).sort({ order: 1, name: 1 });

    // Get parent chain for breadcrumb
    let parent = null;
    if (cat.parentId) {
      parent = await Category.findById(cat.parentId).select('name slug');
    }

    res.json({
      category: {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        icon: cat.icon,
        parentId: cat.parentId,
        parent: parent ? { name: parent.name, slug: parent.slug } : null,
      },
      subcategories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all active categories nested - used by stoefront sidebar & Shop By Category
router.get('/public/all', async (req, res) => {
  try {
    const allCategories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    const categoryMap = {};
    const rootCategories = [];
    allCategories.forEach(cat => {
      categoryMap[cat._id.toString()] = {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        icon: cat.icon,
        featured: cat.featured,
        order: cat.order,
        subcategories: []
      };
    });
    allCategories.forEach(cat => {
      if (cat.parentId) {
        const parent = categoryMap[cat.parentId.toString()];
        if (parent) parent.subcategories.push(categoryMap[cat._id.toString()]);
      } else {
        rootCategories.push(categoryMap[cat._id.toString()]);
      }
    });
    res.json(rootCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured/top categories with subcategories - used by homepage Shop By Category section
router.get('/public/featured', async (req, res) => {
  try {
    // Return ALL active root categories (not just featured-flagged ones)
    const rootCategories = await Category.find({
      isActive: true,
      parentId: null
    }).sort({ order: 1, name: 1 });

    const allCats = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });

    // Build full nested structure in one pass (no extra queries per category)
    const categoryMap = {};
    allCats.forEach(cat => {
      categoryMap[cat._id.toString()] = {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        icon: cat.icon,
        featured: cat.featured,
        order: cat.order,
        subcategories: []
      };
    });
    allCats.forEach(cat => {
      if (cat.parentId) {
        const parent = categoryMap[cat.parentId.toString()];
        if (parent) parent.subcategories.push(categoryMap[cat._id.toString()]);
      }
    });

    const result = rootCategories.map(cat => categoryMap[cat._id.toString()]).filter(Boolean);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Legacy shop-by-category public endpoint
router.get('/public/shop-by-category', async (req, res) => {
  try {
    const allCategories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    const categoryMap = {};
    const rootCategories = [];
    allCategories.forEach(cat => {
      categoryMap[cat._id.toString()] = {
        _id: cat._id, name: cat.name, slug: cat.slug,
        description: cat.description, image: cat.image,
        featured: cat.featured, order: cat.order, subcategories: []
      };
    });
    allCategories.forEach(cat => {
      if (cat.parentId) {
        const parent = categoryMap[cat.parentId.toString()];
        if (parent) parent.subcategories.push(categoryMap[cat._id.toString()]);
      } else {
        rootCategories.push(categoryMap[cat._id.toString()]);
      }
    });
    res.json(rootCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── AUTHENTICATED ROUTES ────────────────────────────────────────────────────

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

module.exports = router;
