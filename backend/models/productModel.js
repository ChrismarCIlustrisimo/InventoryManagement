// models/productModel.js
import mongoose from 'mongoose';
import Counter from './counterModel.js';

// Define stock status enumeration
const StockStatusEnum = ['HIGH STOCK', 'NEAR LOW STOCK', 'LOW STOCK', 'OUT OF STOCK'];

// Define category-specific thresholds
const categoryThresholds = {
  'Components': { nearLow: 10, low: 5 },
  'Peripherals': { nearLow: 15, low: 3 },
  'Accessories': { nearLow: 20, low: 10 },
  'PC Furniture': { nearLow: 20, low: 10 },
  'OS & Software': { nearLow: 10, low: 5 },
  // Add more categories as needed
};

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity_in_stock: { type: Number, required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    buying_price: { type: Number, required: true },
    selling_price: { type: Number, required: true },
    product_id: { type: String, required: true, unique: true },
    image: { type: String },
    near_low_stock_threshold: { type: Number },
    low_stock_threshold: { type: Number },
    sales: { type: Number, default: 0 },
    current_stock_status: {
      type: String,
      enum: StockStatusEnum,
      default: 'HIGH STOCK'
    },
    batch_number: { type: String } // New field for batch number
  },
  {
    timestamps: true
  }
);

// Pre-save hook to set thresholds based on category
ProductSchema.pre('save', function (next) {
  const thresholds = categoryThresholds[this.category] || { nearLow: 20, low: 10 }; // default values

  this.near_low_stock_threshold = thresholds.nearLow;
  this.low_stock_threshold = thresholds.low;

  next();
});

// Static method to generate a product ID
ProductSchema.statics.generateProductId = async function () {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'product_id' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (!counter) {
      throw new Error('Failed to generate product_id');
    }

    return `PRD-${counter.seq.toString().padStart(3, '0')}`;
  } catch (error) {
    throw new Error('Error generating product ID');
  }
};

// Static method to generate a batch number
ProductSchema.statics.generateBatchNumber = async function () {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'batch_number' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (!counter) {
      throw new Error('Failed to generate batch number');
    }

    return `BATCH-${counter.seq.toString().padStart(4, '0')}`;
  } catch (error) {
    throw new Error('Error generating batch number');
  }
};

const Product = mongoose.model('Product', ProductSchema);

export default Product;
