import mongoose from 'mongoose';

const RefundSchema = new mongoose.Schema(
  {
    refund_id: { type: String, required: true, unique: true },
    transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
    sales_date: { type: Date, default: Date.now },
    cashier: { type: String, required: true },
    refund_amount: { type: Number, required: true, min: 0 },
    refund_method: {
      type: String,
      required: true,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'Online'],
    },
    product_name: { type: String, required: true },
    serial_number: { type: String, required: true },
    reason: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create and export the Refund model
const Refund = mongoose.model('Refund', RefundSchema);
export default Refund;
