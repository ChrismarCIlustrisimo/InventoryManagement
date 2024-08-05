import express from 'express';
import multer from 'multer';
import Product from '../models/productModel.js';
import Counter from '../models/counterModel.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// requireAuth for all product routes
//router.use(requireAuth)

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Ensure this folder exists or create it
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Function to generate a unique product ID
const generateProductId = async () => {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'product_id' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (!counter) {
      throw new Error('Failed to generate product_id');
    }

    return `PRD-${counter.seq.toString().padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating product ID:', error);
    throw new Error('Error generating product ID');
  }
};

// Add Product with image upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { name, category, quantity_in_stock, supplier, buyin_price, selling_price } = req.body;
    const image = req.file ? req.file.path : '';

    if (!name || !category || quantity_in_stock === undefined || !supplier || buyin_price === undefined || selling_price === undefined) {
      return res.status(400).send({
        message: 'All fields are required'
      });
    }

    // Generate product ID
    const product_id = await generateProductId();

    const newProduct = new Product({
      name,
      category,
      quantity_in_stock,
      supplier,
      product_id,
      buyin_price,
      selling_price,
      image
    });

    const product = await newProduct.save(); // Use save to trigger schema pre-save hooks
    return res.status(201).send(product);

  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

// Get All Products
router.get('/', async (request, response) => {
  try {
    const products = await Product.find({});
    return response.status(200).json({
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error(error);
    return response.status(500).send('Server Error');
  }
});

router.put('/bulk-update', async (request, response) => {
  try {
    const updates = request.body;
    await Product.bulkWrite(updates);
    return response.status(200).send({ message: 'Products updated successfully' });
  } catch (error) {
    console.error(error);
    return response.status(500).send('Server Error');
  }
});

// Get Single Product
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const product = await Product.findById(id);
    if (!product) {
      return response.status(404).json({ message: 'Product not found' });
    }

    return response.status(200).json(product);

  } catch (error) {
    console.error(error);
    return response.status(500).send('Server Error');
  }
});

// Update Product
router.put('/:id', async (request, response) => {
  try {
    const { name, category, quantity_in_stock, supplier, buyin_price, selling_price, image } = request.body;

    if (!name || !category || quantity_in_stock === undefined || !supplier || buyin_price === undefined || selling_price === undefined || !image) {
      return response.status(400).send({ message: 'All fields are required' });
    }

    const { id } = request.params;
    const result = await Product.findByIdAndUpdate(id, request.body, { new: true });

    if (!result) {
      return response.status(404).json({ message: 'Product not found' });
    }

    return response.status(200).send({ message: 'Product updated', data: result });
  } catch (error) {
    console.error(error);
    return response.status(500).send('Server Error');
  }
});

// Delete Product
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Product not found' });
    }

    return response.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return response.status(500).send('Server Error');
  }
});

export default router;
