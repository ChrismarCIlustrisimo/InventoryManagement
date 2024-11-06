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
// Define category-specific thresholds
const categoryThresholds = {
  'Components': { low: 5 },
  'Peripherals': { low: 3 },
  'Accessories': { low: 10 },
  'PC Furniture': { low: 10 },
  'OS & Software': { low: 5 },
  // Add more categories as needed
};

// Multer configuration for multiple file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Ensure this folder exists or create it
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Add a new product with units
router.post('/', upload.fields([
  { name: 'file', maxCount: 1 }, // For product image
  { name: 'serialImages', maxCount: 200 } // For serial images
]), async (req, res) => {
  try {
    const { 
      name, 
      category, 
      supplier, 
      buying_price, 
      selling_price, 
      description, 
      model,
      low_stock_threshold,
      sub_category, 
      warranty,  // Add warranty here
      units 
    } = req.body;

    // Check for required fields
    if (!name || !category || buying_price === undefined || selling_price === undefined || !units || units.length === 0) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Parse the units from the incoming JSON string
    const parsedUnits = JSON.parse(units);

    const processedUnits = [];
    const mainImage = req.files['file'] ? req.files['file'][0] : null; // Get the main product image
    const serialImages = req.files['serialImages'] || []; // Get the serial images

    for (let i = 0; i < parsedUnits.length; i++) {
      const unit = parsedUnits[i];

      // Ensure the unit has a serial number
      if (!unit.serial_number) {
        return res.status(400).json({ message: 'Serial number is required for each unit' });
      }

      // Generate a unique unit_id for each unit
      const unit_id = await Product.generateUnitID();

      processedUnits.push({
        serial_number: unit.serial_number,
        serial_number_image: serialImages[i] ? `images/${serialImages[i].filename}` : '',
        unit_id, // Add generated unit_id
        status: unit.status || 'in_stock',
        purchase_date: new Date(unit.purchase_date || Date.now()),
      });
    }

    // Create the product with processed units
    const product = new Product({
      name,
      category,
      supplier,
      buying_price,
      selling_price,
      description,
      model,
      low_stock_threshold: low_stock_threshold ? Number(low_stock_threshold) : undefined,
      sub_category,
      warranty,
      image: mainImage ? `images/${mainImage.filename}` : '',
      product_id: await Product.generateProductId(),
      units: processedUnits,
    });

    await product.save();
    req.app.get('io').emit('product-added', product);
    return res.status(201).json(product);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/search', async (req, res) => {
  const { name } = req.query; // Get the search query from the request

  try {
    const products = await Product.find({
      name: { $regex: name, $options: 'i' }, // Case-insensitive search
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





// Get all products (filtering out zero-stock products)
router.get('/', async (req, res) => {
  try {
      const products = await Product.find({});

      // Process each product to determine the stock status
      products.forEach(product => {
          const inStockCount = product.units.filter(unit => unit.status === 'in_stock').length;
          const lowStockThreshold = product.low_stock_threshold; // Assuming this is part of the product data

          // Assign stock status based on inStockCount
          if (inStockCount === 0) {
              product.current_stock_status = 'OUT OF STOCK';
          } else if (inStockCount <= lowStockThreshold) {
              product.current_stock_status = 'LOW';
          } else {
              product.current_stock_status = 'HIGH'; // Assign a default HIGH status if above the threshold
          }
      });

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



router.put('/bulk-update', async (req, res) => {
  try {
      const updates = req.body;

      // Iterate through the updates to handle each product's update
      for (const update of updates) {
          const { filter, update: updateData } = update.updateOne;

          // Update the product using findOneAndUpdate for a single operation
          const product = await Product.findOneAndUpdate(
              filter,
              updateData, // This will contain the $inc operation for quantity and sales
              { new: true } // Return the updated document
          );

          // If the product is found, check the number of in-stock units
          if (product) {
              const inStockCount = product.units.filter(unit => unit.status === 'in_stock').length;
              const lowStockThreshold = product.low_stock_threshold; // Assuming this is part of the product data

              // Assign stock status based on inStockCount
              if (inStockCount === 0) {
                  product.current_stock_status = 'OUT OF STOCK';
              } else if (inStockCount <= lowStockThreshold) {
                  product.current_stock_status = 'LOW';
              } else {
                  product.current_stock_status = 'HIGH'; // Assign a default HIGH status if above the threshold
              }

              // Save the updated product
              await product.save();
          }
      }

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


router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, supplier, buying_price, selling_price, sub_category, warranty } = req.body;
    const file = req.file; // This will contain your uploaded file

    const updates = { name, category, supplier, buying_price, selling_price, sub_category, warranty };

    if (file) {
      updates.image = `images/${file.filename}`; // Save the image path to your database
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});











// Delete a product by ID and fetch all updated products
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch all products after deletion
    const products = await Product.find({});

    // Update stock status for each product
    products.forEach(product => {
      const inStockCount = product.units.filter(unit => unit.status === 'in_stock').length;
      const lowStockThreshold = product.low_stock_threshold;

      if (inStockCount === 0) {
        product.current_stock_status = 'OUT OF STOCK';
      } else if (inStockCount <= lowStockThreshold) {
        product.current_stock_status = 'LOW';
      } else {
        product.current_stock_status = 'HIGH';
      }
    });

    // Emit updated product list to WebSocket
    req.app.get('io').emit('products-updated', products);

    return res.status(200).json({
      message: 'Product deleted successfully',
      products: products,
    });

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
      product.low_stock_threshold = thresholds.low;

      // Determine stock status
      let status;
      const { quantity_in_stock, low_stock_threshold} = product;

      if (quantity_in_stock <= 0) {
        status = 'OUT OF STOCK';
      } else if (quantity_in_stock <= low_stock_threshold) {
        status = 'LOW';
      } else {
        status = 'HIGH';
      }

      return {
        updateOne: {
          filter: { _id: product._id },
          update: { 
            $set: { 
              current_stock_status: status,
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
    const products = await Product.find();  
    const sortedProducts = products.sort((a, b) => (a.sales - b.sales) * -1);

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




// Add this below your existing routes in the router file
router.get('/:id/units', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ units: product.units });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/details/:id', async (req, res) => {
  try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send('Product not found.');

      // Update the product units and other fields as needed
      product.units = req.body.units;

      // This will trigger the pre-save hook to recalculate quantity_in_stock
      await product.save();

      res.send(product);
  } catch (error) {
      res.status(500).send('Error updating product.');
  }
});


// Route to update a unit by its unit ID
router.put('/:productId/unit/:unitId', upload.single('serial_number_image'), async (req, res) => {
  try {
    const { productId, unitId } = req.params;
    const { serial_number, status, purchase_date } = req.body; // Include other fields as needed

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const unit = product.units.id(unitId);
    if (!unit) return res.status(404).json({ message: 'Unit not found' });

    // Update the unit fields
    if (serial_number !== undefined) unit.serial_number = serial_number;
    if (status !== undefined) unit.status = status;
    if (purchase_date !== undefined) unit.purchase_date = purchase_date;

    // Check if a new image was uploaded and update the serial_number_image field
    if (req.file) {
      unit.serial_number_image = `images/${req.file.filename}`;
    }

    await product.save(); // Save the updated product

    res.status(200).json({ message: 'Unit updated successfully', unit }); // Return the updated unit
  } catch (error) {
    console.error('Error updating unit:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});



// Route to delete a unit by its unit ID
router.delete('/:productId/unit/:unitId', async (req, res) => {
  try {
    const { productId, unitId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Find the unit within the product's units array using the unit ID
    const unit = product.units.id(unitId);
    if (!unit) return res.status(404).json({ message: 'Unit not found' });

    // Remove the unit from the units array
    product.units = product.units.filter((u) => u.id !== unitId);

    await product.save(); // Save the updated product

    res.status(200).json({ message: 'Unit deleted successfully' });
  } catch (error) {
    console.error('Error deleting unit:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});



// Add units for a specific product
router.post('/:productId/unit', upload.fields([{ name: 'serial_number_image', maxCount: 100 }]), async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const unitID = await Product.generateUnitID(); // Generate a unique unit ID

    // Map the serial numbers and the corresponding images from the request
    const units = req.body.serial_number.map((serial_number, index) => ({
      serial_number,
      serial_number_image: req.files['serial_number_image'] ? `images/${req.files['serial_number_image'][index].filename}` : null, // Handle file upload properly
      status: 'in_stock',
      unit_id: unitID, 
    }));

    product.units.push(...units); // Add the new units to the product's units array
    await product.save();

    res.status(201).json({ message: 'Units added successfully', units });
  } catch (error) {
    console.error("Error adding units:", error);
    res.status(500).json({ message: 'Server error' });
  }
});





export default router;