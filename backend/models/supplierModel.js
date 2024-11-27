import mongoose from 'mongoose';
import Counter from './counterModel.js'; // Ensure you have a Counter model for sequence tracking

const SupplierSchema = new mongoose.Schema(
  {
    supplier_id: { type: String, required: true, unique: true },
    supplier_name: { type: String, required: true, unique: true },
    contact_person: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    remarks: { type: String, required: true },
    categories: [{type: String, required: true}],},
  {
    timestamps: true,
  }
);

// Static method to generate a unique supplier ID
SupplierSchema.statics.generateSupplierId = async function () {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'supplier_id' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (!counter) {
      throw new Error('Failed to generate supplier_id');
    }

    return `SUP-${counter.seq.toString().padStart(2, '0')}`; // Example: SUP-0001
  } catch (error) {
    throw new Error('Error generating supplier ID');
  }
};

const Supplier = mongoose.model('Supplier', SupplierSchema);

export default Supplier;
