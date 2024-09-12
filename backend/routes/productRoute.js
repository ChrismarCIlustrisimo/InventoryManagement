import express from 'express';
import multer from 'multer';
import Product from '../models/productModel.js';
import Counter from '../models/counterModel.js';
import requireAuth from '../middleware/requireAuth.js';
import Supplier from '../models/supplierModel.js';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware to require authentication for all routes
//router.use(requireAuth);

// Define category-specific thresholds
const categoryThresholds = {
  'Components': { nearLow: 10, low: 5 },
  'Peripherals': { nearLow: 15, low: 3 },
  'Accessories': { nearLow: 20, low: 10 },
  'PC Furniture': { nearLow: 20, low: 10 },
  'OS & Software': { nearLow: 10, low: 5 },
  // Add more categories as needed
};

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Ensure this folder exists or create it
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Add a new product with image upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { name, category, quantity_in_stock, supplierId, buying_price, selling_price } = req.body;
    const image = req.file ? req.file.path : '';

    // Check for required fields
    if (!name || !category || quantity_in_stock === undefined || buying_price === undefined || selling_price === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate supplierId
    let supplier = null;
    if (supplierId && supplierId !== 'NONE') {
      if (!mongoose.Types.ObjectId.isValid(supplierId)) {
        return res.status(400).json({ message: 'Invalid supplier ID' });
      }
      supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }
    }

    const productId = await Product.generateProductId(); // Generate product ID

    const product = new Product({
      name,
      category,
      quantity_in_stock,
      supplier: supplier ? supplier._id : null, // Set to null if no supplier
      buying_price,
      selling_price,
      image,
      product_id: productId // Set the generated product ID
    });

    await product.save();

    // Emit a WebSocket event after adding the product
    req.app.get('io').emit('product-added', product);

    return res.status(201).json(product);

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});



// Get all products (filtering out zero-stock products)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    
    // Emit a WebSocket event for product list fetch
    req.app.get('io').emit('products-fetched', products);

    return res.status(200).json({
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});


// Bulk update products
router.put('/bulk-update', async (req, res) => {
  try {
    const updates = req.body;
    await Product.bulkWrite(updates);
    return res.status(200).send({ message: 'Products updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Use multer to handle file uploads and body parsing
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity_in_stock, supplier, buying_price, selling_price, batchNumber, currentStockStatus, dateAdded, updatedAt } = req.body;
    const file = req.file;

    // Convert empty supplier to null
    const supplierId = supplier === "" ? null : supplier;

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, quantity_in_stock, supplier: supplierId, buying_price, selling_price, batchNumber, currentStockStatus, dateAdded, updatedAt },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Emit a WebSocket event after updating the product
    req.app.get('io').emit('product-updated', updatedProduct);

    return res.status(200).json(updatedProduct);

  } catch (error) {
    console.error('Error updating product:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});







// Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Update stock statuses based on quantity and thresholds
router.post('/update-stock-status', async (req, res) => {
  try {
    const products = await Product.find({});

    const bulkOps = products.map(product => {
      // Get thresholds for the product's category
      const thresholds = categoryThresholds[product.category];

      // Update thresholds based on category
      product.near_low_stock_threshold = thresholds.nearLow;
      product.low_stock_threshold = thresholds.low;

      // Determine stock status
      let status;
      const { quantity_in_stock, low_stock_threshold, near_low_stock_threshold } = product;

      if (quantity_in_stock <= 0) {
        status = 'OUT OF STOCK';
      } else if (quantity_in_stock <= low_stock_threshold) {
        status = 'LOW STOCK';
      } else if (quantity_in_stock <= near_low_stock_threshold) {
        status = 'NEAR LOW STOCK';
      } else {
        status = 'HIGH STOCK';
      }

      return {
        updateOne: {
          filter: { _id: product._id },
          update: { 
            $set: { 
              current_stock_status: status,
              near_low_stock_threshold: product.near_low_stock_threshold,
              low_stock_threshold: product.low_stock_threshold
            } 
          },
        }
      };
    });

    await Product.bulkWrite(bulkOps);
    res.status(200).json({ message: 'Stock statuses updated successfully' });
  } catch (error) {
    console.error('Error updating stock statuses:', error);
    res.status(500).json({ message: 'Failed to update stock statuses' });
  }
});

// Get all products (filtering out zero-stock products and sorting by sales)
router.get('/', async (req, res) => {
  try {
    // Extract query parameters
    const sortBy = req.query.sortBy || 'sales';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    // Check if sortBy is a valid field for sorting
    if (sortBy !== 'sales') {
      return res.status(400).json({ message: 'Invalid sortBy parameter' });
    }

    // Fetch products with quantity_in_stock > 0
    const products = await Product.find({ quantity_in_stock: { $gt: 0 } });

    // Filter out products with sales equal to 0
    const filteredProducts = products.filter(product => product.sales !== 0);

    // Sort products
    const sortedProducts = filteredProducts.sort((a, b) => (a.sales - b.sales) * -1);

    // Send response
    return res.status(200).json({
      count: sortedProducts.length,
      data: sortedProducts
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});





export default router;