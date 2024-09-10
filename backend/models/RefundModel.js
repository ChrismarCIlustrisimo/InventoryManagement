import mongoose from 'mongoose';

const RefundSchema = new mongoose.Schema({
  transaction_id: { type: String, required: true, ref: 'Transaction' },
  refunded_products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }],
  refund_reason: { type: String, required: [true, 'Refund reason is required'], },
  refund_date: { type: Date, default: Date.now },
  refunded_by: { type: String } // Cashier or person processing the refund
});

const Refund = mongoose.model('Refund', RefundSchema);

export default Refund;
