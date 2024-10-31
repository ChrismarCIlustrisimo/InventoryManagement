import express from 'express';
import RMA from '../models/RmaModel.js';
import Product from '../models/productModel.js';
import Transaction from '../models/transactionModel.js';

const router = express.Router();

// Route to create a new RMA
router.post('/', async (req, res) => {
  try {
    const {
      transaction,
      product,
      serial_number,
      customer_name,
      reason,
      warranty_status,
      notes,
      condition,
      product_warranty,
      transaction_date,
      cashier,
      product_price,
      product_id,
      customerID,
    } = req.body;

    // Check for required fields
    if (!transaction || !product || !serial_number || !customer_name || !reason) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Update the product unit's status to 'rma'
    const updatedProduct = await Product.findOneAndUpdate(
      { name: product, "units.serial_number": serial_number },
      { $set: { "units.$.status": 'rma' } }, // Update the unit's status
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product or serial number not found.' });
    }

    // Update the transaction's status to 'Rma'
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { transaction_id: transaction },
      { $set: { status: 'RMA' } }, // Set transaction status to 'Rma'
      { new: true } // Return the updated transaction
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    // Generate RMA ID
    const rma_id = await RMA.generateRMAId();

    // Create a new RMA record
    const newRMA = new RMA({
      rma_id,
      transaction,
      product,
      serial_number,
      customer_name,
      reason,
      warranty_status,
      notes,
      condition,
      product_warranty,
      transaction_date,
      cashier,
      product_price,
      product_id,
      customerID,
    });

    const createdRMA = await newRMA.save();

    // Return the updated product, transaction, and new RMA
    return res.status(201).json({
      message: 'RMA request created successfully.',
      updatedProduct,
      updatedTransaction,
      createdRMA
    });

  } catch (error) {
    // Return error response
    return res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  const { status, notes, process } = req.body; // Include process if needed

  try {
    const updatedRMA = await RMA.findByIdAndUpdate(
      req.params.id,
      { status, notes, process }, // Update status, notes, and process
      { new: true, runValidators: true }
    ).populate('transaction product');

    if (updatedRMA) {
      // Emit event to all clients about the updated RMA
      const io = req.app.get('io');
      io.emit('rmaUpdated', updatedRMA);

      return res.status(200).json(updatedRMA);
    } else {
      return res.status(404).json({ message: 'RMA not found' });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});


// Route to get all RMAs
router.get('/', async (req, res) => {
  try {
    const rmas = await RMA.find();

    // Get the current date for comparison
    const now = new Date();

    // Process each RMA to calculate warranty status
    const processedRMAs = rmas.map(rma => {
      if (typeof rma.product_warranty !== 'string') {
        rma.warranty_status = 'Invalid Warranty';
        return rma;
      }

      const warrantyParts = rma.product_warranty.split(' ');
      if (warrantyParts.length !== 2 || isNaN(warrantyParts[0])) {
        rma.warranty_status = 'Invalid Warranty';
        return rma;
      }

      const warrantyNumber = parseInt(warrantyParts[0], 10);
      const warrantyUnit = warrantyParts[1]; // 'Year', 'Months', or 'Days'
      const expirationDate = new Date(rma.transaction_date);

      // Calculate the expiration date based on warranty unit
      if (warrantyUnit === 'Year') {
        expirationDate.setFullYear(expirationDate.getFullYear() + warrantyNumber);
      } else if (warrantyUnit === 'Month') {
        expirationDate.setMonth(expirationDate.getMonth() + warrantyNumber);
      } else if (warrantyUnit === 'Day') {
        expirationDate.setDate(expirationDate.getDate() + warrantyNumber);
      }

      // Determine warranty status
      rma.warranty_status = expirationDate > now ? 'Valid' : 'Expired';
      return rma;
    });

    return res.status(200).json(processedRMAs);
  } catch (error) {
    console.error('Error fetching RMAs:', error); // Log error for debugging
    return res.status(500).json({ message: error.message });
  }
});

// Route to get a specific RMA by ID
router.get('/:id', async (req, res) => {
  try {
    const rma = await RMA.findById(req.params.id).populate('transaction product');
    if (rma) {
      return res.status(200).json(rma);
    } else {
      return res.status(404).json({ message: 'RMA not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Route to delete an RMA
router.delete('/:id', async (req, res) => {
  try {
    const rma = await RMA.findByIdAndDelete(req.params.id);
    if (rma) {
      return res.status(200).json({ message: 'RMA deleted successfully' });
    } else {
      return res.status(404).json({ message: 'RMA not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/process', async (req, res) => {
  const { process } = req.body;  // Get the process field from request body

  // Validate the process value
  if (!['Refund', 'Replacement'].includes(process)) {
    return res.status(400).json({ message: 'Invalid process value. Must be either Refund or Replacement.' });
  }

  try {
    // Update the RMA process
    const updatedRMA = await RMA.findByIdAndUpdate(
      req.params.id,
      { process },  // Update the process field
      { new: true, runValidators: true }  // Return the updated RMA and ensure validation
    );

    if (updatedRMA) {
      res.status(200).json(updatedRMA);
    } else {
      res.status(404).json({ message: 'RMA not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
