const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: String,
  sku: String,
  price: Number,
  salePrice: Number,
  stock: Number,
  attributes: {
    type: Map,
    of: String,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  shortDescription: {
    type: String,
    default: '',
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
    default: null,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  images: [{
    type: String,
  }],
  variants: [variantSchema],
  status: {
    type: String,
    enum: ['active', 'draft', 'out_of_stock'],
    default: 'active',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
