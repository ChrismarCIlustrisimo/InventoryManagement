import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    in_stock: { type: Boolean, required: true },
    supplier: { type: String, required: true },
    product_id: { type: String, required: true},
    buyin_price: { type: Number, required: true },
    selling_price: { type: Number, required: true },
    image: { type: String, required: true } 
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
