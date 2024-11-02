// models/productModel.js
import mongoose from 'mongoose';
import Counter from './counterModel.js';

const StockStatusEnum = ['HIGH', 'LOW', 'OUT OF STOCK'];

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    supplier: { type: String, required: false }, 
    buying_price: { type: Number, required: true },
    selling_price: { type: Number, required: true },
    product_id: { type: String, required: true, unique: true },
    image: { type: String },
    description: { type: [String] },
    warranty: { type: String },
    sub_category: { type: String },
    model: { type: String },
    low_stock_threshold: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    current_stock_status: {
      type: String,
      enum: Object.values(StockStatusEnum),
      default: StockStatusEnum[0], // Default to 'HIGH'
    },
    units: [{
      serial_number: { type: String, required: true },
      serial_number_image: { type: String },
      unit_id: { type: String, unique: true }, // Add unit_id field
      status: { type: String, enum: ['in_stock', 'rma', 'sold', 'refunded', 'replaced','reserved'], default: 'in_stock' },
      purchase_date: { type: Date, default: Date.now },
    }],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to update stock status based on available units and thresholds
ProductSchema.pre('save', function (next) {
  const availableUnits = this.units.filter(unit => unit.status === 'in_stock').length;

  // Update stock status based on available units and low stock threshold
  if (availableUnits === 0) {
    this.current_stock_status = StockStatusEnum[2]; // 'OUT OF STOCK'
  } else if (availableUnits <= this.low_stock_threshold) {
    this.current_stock_status = StockStatusEnum[1]; // 'LOW'
  } else {
    this.current_stock_status = StockStatusEnum[0]; // 'HIGH'
  }
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

// Static method to generate a Unit ID in the format "UD-01"
ProductSchema.statics.generateUnitID = async function () {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'unit_id' }, // Create a new counter for unit IDs
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (!counter) {
      throw new Error('Failed to generate unit_id');
    }

    return `UD-${counter.seq.toString().padStart(2, '0')}`; // Format as "UD-01"
  } catch (error) {
    throw new Error('Error generating unit ID');
  }
};

// Preventing model overwrite
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
