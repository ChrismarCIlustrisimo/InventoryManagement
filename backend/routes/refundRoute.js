import express from 'express';
import Refund from '../models/refundModel.js';
import Transaction from '../models/transactionModel.js';
import Product from '../models/productModel.js';
import RMA from '../models/RmaModel.js';
 
const router = express.Router();

// @route   POST /refunds
// @desc    Create a new refund
// @access  Public
router.post('/', async (req, res) => {
  try {
    console.log("Received refund request with data:", req.body); // Log incoming request body

    // Destructure the required fields from req.body
    const {
      customer_name,
      transaction_id,
      refund_amount,
      refund_method,
      product_name,
      serial_number, // This can be a single string or an array
      reason,
      unit_price,
      cashier,
    } = req.body;

    // Generate a unique refund_id
    const refund_id = await Refund.generateRefundId();

    // Create a new refund instance
    const refund = new Refund({
      refund_id,
      customer_name,
      transaction_id,
      refund_amount,
      refund_method,
      product_name,
      serial_number,
      reason,
      unit_price,
      cashier,
    });

    // Save the refund
    await refund.save();

    // Update the transaction status to 'Refunded'
    const transactionUpdate = await Transaction.findOneAndUpdate(
      { transaction_id },
      { status: 'Refunded' },
      { new: true }
    );

    if (!transactionUpdate) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Ensure serial_number is treated as an array
    const serialNumbers = Array.isArray(serial_number) ? serial_number : [serial_number];

    // Update the units' statuses to 'refunded'
    const updatePromises = serialNumbers.map(async (serial) => {
      return await Product.updateOne(
        { 'units.serial_number': serial },
        { $set: { 'units.$.status': 'refunded' } }
      );
    });

    await Promise.all(updatePromises); // Wait for all updates to finish

    // Update RMA status to 'Completed'
    const rmaUpdate = await RMA.findOneAndUpdate(
      { transaction: transaction_id }, // Assuming the RMA is linked by transaction_id
      { status: 'Completed' },
      { new: true }
    );

    // If RMA does not exist, handle accordingly (optional)
    if (!rmaUpdate) {
      console.log(`No RMA found for transaction ${transaction_id}.`);
    }

    res.status(201).json({ refund, transaction: transactionUpdate, rma: rmaUpdate });
  } catch (error) {
    console.error("Error creating refund:", error); // Log the error
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /refunds
// @desc    Get all refunds
// @access  Public
router.get('/', async (req, res) => {
  try {
    const refunds = await Refund.find();
    res.json(refunds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /refunds/:id
// @desc    Get a refund by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const refund = await Refund.findById(req.params.id);
    if (!refund) {
      return res.status(404).json({ message: 'Refund not found' });
    }
    res.json(refund);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /refunds/:id
// @desc    Update a refund by ID
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const refund = await Refund.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!refund) {
      return res.status(404).json({ message: 'Refund not found' });
    }
    res.json(refund);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /refunds/:id
// @desc    Delete a refund by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const refund = await Refund.findByIdAndDelete(req.params.id);
    if (!refund) {
      return res.status(404).json({ message: 'Refund not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/check/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  
  try {
    const matchingRefunds = await Refund.find({ transaction_id: transactionId });
    const refundData = matchingRefunds.map(refund => ({
      refund_id: refund.refund_id,
      ...refund.toObject() // Include other relevant fields if needed
    }));

    res.json({ transactionId, refundData });
  } catch (error) {
    console.error('Error fetching refunds:', error);
    res.status(500).json({ message: 'Error fetching refunds', error });
  }
});


export default router;
