import mongoose from 'mongoose';
import Counter from './counterModel.js';

const RMASchema = new mongoose.Schema({
  rma_id: { type: String, required: true, unique: true },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  serial_number: { type: String, required: true },
  date_initiated: { type: Date, default: Date.now },
  customer_name: { type: String, required: true },
  request_type: { type: String, enum: ['Return', 'Exchange'], required: true },
  reason: { type: String, required: true },
  serial_number: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'In Progress', 'Completed', 'Expired'], default: 'Pending' },
  warranty_status: { type: String, enum: ['Valid', 'Expired'], required: true },
  notes: { type: String },  // New optional field for notes
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
