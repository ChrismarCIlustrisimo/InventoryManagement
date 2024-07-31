import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String }, // Set unique to false
    phone: { type: String },
    address: { type: String },
  },
  {
    timestamps: true
  }
);


const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;
