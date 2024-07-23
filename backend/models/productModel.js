import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity_in_stock: { type: Number, required: true },
    supplier: { type: String, required: true },
    product_id: { type: String, required: true, unique: true },
    buyin_price: { type: Number, required: true },
    selling_price: { type: Number, required: true },
    image: { type: String, required: true } // This field will store the image file path
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
