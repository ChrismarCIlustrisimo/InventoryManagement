import mongoose from 'mongoose';
import Counter from './counterModel.js';

const RefundSchema = new mongoose.Schema(
  {
    refund_id: { type: String, required: true, unique: true },
    customer_name: { type: String, required: true },
    transaction_id: { type: String, required: true },
    sales_date: { type: Date, default: Date.now },
    cashier: { type: String, required: true },
    refund_amount: { type: Number, required: true, min: 0 },
    refund_method: {
      type: String,
      required: true,
      enum: ['Cash', 'GCash', 'GGvices', 'Bank Transfer', 'BDO Credit Card', 'Credit Card - Online'],
    },
    product_name: { type: String, required: true },
    serial_number: { type: String, required: true },
    reason: { type: String, required: true },
    unit_price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Static method to generate unique refund_id
RefundSchema.statics.generateRefundId = async function () {
  try {
      const counter = await Counter.findByIdAndUpdate(
          { _id: 'refund_id' },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
      );

      if (!counter) {
          throw new Error('Failed to generate refund_id');
      }

      return `REF-${counter.seq.toString().padStart(3, '0')}`;
  } catch (error) {
      throw new Error('Error generating refund ID');
  }
};

const Refund = mongoose.model('Refund', RefundSchema);

export default Refund;
