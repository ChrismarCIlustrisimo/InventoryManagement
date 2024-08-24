import mongoose from 'mongoose';
// Define stock status enumeration
const StockStatusEnum = ['HIGH STOCK', 'NEAR LOW STOCK', 'LOW STOCK', 'OUT OF STOCK'];

// Define category-specific thresholds
const categoryThresholds = {
  'Components': { nearLow: 10, low: 5 }, // Example thresholds
  'Peripherals': { nearLow: 15, low: 3 }, // Example thresholds
  'Accessories': { nearLow: 20, low: 10 }, // Example thresholds
  'PC Furniture': { nearLow: 20, low: 10 }, // Example thresholds
  'OS & Software': { nearLow: 10, low: 5 }, // Example thresholds
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
    near_low_stock_threshold: { type: Number},
    low_stock_threshold: { type: Number},
    sales: { type: Number, default: 0 },
    current_stock_status: {
      type: String,
      enum: StockStatusEnum,
      default: 'HIGH STOCK'
    } 
  },
  {
    timestamps: true
  }
);

// Pre-save hook to set thresholds based on category
ProductSchema.pre('save', function(next) {
  const thresholds = categoryThresholds[this.category] || { nearLow: 20, low: 10 }; // default values

  this.near_low_stock_threshold = thresholds.nearLow;
  this.low_stock_threshold = thresholds.low;

  next();
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
