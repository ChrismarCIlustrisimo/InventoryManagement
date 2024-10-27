import mongoose from 'mongoose';
import Counter from './counterModel.js';

const RMASchema = new mongoose.Schema({
  rma_id: { type: String, required: true, unique: true },
  transaction: { type: String, required: true },
  product: { type: String, required: true },
  serial_number: { type: String, required: true },
  date_initiated: { type: Date, default: Date.now },
  customer_name: { type: String, required: true },
  reason: { type: String, required: true },
  condition: { type: String, required: true },
  product_warranty: { type: String, required: true },
  product_price: { type: String, required: true },
  product_id: { type: String, required: true },
  cashier: { type: String, required: true },
  customerID: { type: String, required: true },
  process: { type: String, enum: ['Refund', 'Replacement','None'], default: 'None' },
  transaction_date: { type: Date, required: true }, // Ensure this is a Date
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
  warranty_status: { type: String, enum: ['Valid', 'Expired'], default: 'Valid', required: true },
  notes: { type: String },
}, {
  timestamps: true,
});

// Static method to generate RMA ID
RMASchema.statics.generateRMAId = async function () {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'rma_id' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (!counter) {
    throw new Error('Failed to generate RMA ID');
  }

  return `RMA-${counter.seq.toString().padStart(2, '0')}`;
};

const RMA = mongoose.model('RMA', RMASchema);

export default RMA;
