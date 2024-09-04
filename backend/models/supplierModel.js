import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema(
  {
    image: { type: String },
    name: { type: String, required: true, unique: true },
    contact_number: { type: String, required: true },
    email: { type: String, required: true, unique: true }
  },
  {
    timestamps: true
  }
);

const Supplier = mongoose.model('Supplier', SupplierSchema);

export default Supplier;
