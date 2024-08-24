import express from 'express';
import multer from 'multer';
import Product from '../models/productModel.js';
import Counter from '../models/counterModel.js';
import requireAuth from '../middleware/requireAuth.js';
import Supplier from '../models/supplierModel.js';

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

// Add a new product with image upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { name, category, quantity_in_stock, supplierId, buying_price, selling_price } = req.body;
    const image = req.file ? req.file.path : '';

    if (!name || !category || quantity_in_stock === undefined || !supplierId || buying_price === undefined || selling_price === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate that supplier exists
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const product_id = await generateProductId();

    const newProduct = new Product({
      name,
      category,
      quantity_in_stock,
      supplier: supplierId, // Reference supplier by ID
      product_id,
      buying_price,
      selling_price,
      image
    });

    const product = await newProduct.save();
    return res.status(201).json(product);

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});



// Get all products (filtering out zero-stock products)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ quantity_in_stock: { $gt: 0 } }); // Filter out zero-stock products
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

// Update a product by ID
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    const { name, category, quantity_in_stock, supplierId, buying_price, selling_price } = req.body;
    const image = req.file ? req.file.path : req.body.image; // Use existing image if not uploading a new one

    if (!name || !category || quantity_in_stock === undefined || !supplierId || buying_price === undefined || selling_price === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const { id } = req.params;
    const result = await Product.findByIdAndUpdate(id, {
      name,
      category,
      quantity_in_stock,
      supplier: supplierId, // Reference supplier by ID
      buying_price,
      selling_price,
      image
    }, { new: true });

    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product updated', data: result });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});


// Delete a product by ID
/*router.delete('/:id', async (req, res) => {
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
});*/

// Update stock statuses based on quantity and thresholds
router.post('/update-stock-status', async (req, res) => {
  try {
    const products = await Product.find({});

    const bulkOps = products.map(product => {
      // Get thresholds for the product's category
      const thresholds = categoryThresholds[product.category] || { nearLow: 20, low: 10 };

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
