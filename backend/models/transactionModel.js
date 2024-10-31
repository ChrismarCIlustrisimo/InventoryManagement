import mongoose from 'mongoose';

const ProductItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  product_name: { type: String },
  serial_number: { type: [String], required: true },
});

const TransactionSchema = new mongoose.Schema(
  {
    transaction_id: { type: String, required: true, unique: true },
    products: [ProductItemSchema], 
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    total_price: { type: Number, required: true },
    total_amount_paid: { type: Number },
    transaction_date: { type: Date, default: Date.now },
    due_date: { type: Date },
    discount: { type: Number },
    vat: { type: Number },
    status: { type: String, enum: ['Completed', 'Replaced', 'Refunded','RMA', 'Reserved'], default: 'Reserved'},
    payment_status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
    cashier: { type: String },
    payment_method: {
      type: String,
      enum: [
        'Cash',
        'GCash',
        'GGvices',
        'Bank Transfer',
        'BDO Credit Card',
        'Credit Card - Online',
        'None',
      ],
      default: 'Cash'
    },  },  
  {
    timestamps: true
  }
);


// Pre-save hook for TransactionSchema to update item_status
TransactionSchema.pre('save', function (next) {
  // Loop through products and update item_status if it is null or undefined
  this.products.forEach(productItem => {
    if (!productItem.item_status) {
      productItem.item_status = 'Sale'; // Assign default item_status if null or undefined
    }
  });
  next();
});


const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;
