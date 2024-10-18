import express from 'express';
import RMA from '../models/RmaModel.js';

const router = express.Router();

// Route to create a new RMA
router.post('/', async (req, res) => {
  try {
    const {
      transaction,
      product,
      serial_number,
      customer_name,
      request_type,
      reason,
      warranty_status
    } = req.body;

    // Generate RMA ID
    const rma_id = await RMA.generateRMAId();

    const newRMA = new RMA({
      rma_id,
      transaction,
      product,
      serial_number,
      customer_name,
      request_type,
      reason,
      warranty_status,
    });

    const createdRMA = await newRMA.save();
    res.status(201).json(createdRMA);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update RMA status and notes
router.patch('/:id', async (req, res) => {
  const { status, notes } = req.body;

  try {
    const updatedRMA = await RMA.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    ).populate('transaction product');

    if (updatedRMA) {
      // Emit event to all clients about the updated RMA
      const io = req.app.get('io');
      io.emit('rmaUpdated', updatedRMA);

      res.status(200).json(updatedRMA);
    } else {
      res.status(404).json({ message: 'RMA not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const rmas = await RMA.find()
      .populate('transaction', 'transaction_id')  // Get the transaction ID
      .populate('product', 'name');  // Get the product name

    res.status(200).json(rmas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to get a specific RMA by ID
router.get('/:id', async (req, res) => {
  try {
    const rma = await RMA.findById(req.params.id).populate('transaction product');
    if (rma) {
      res.status(200).json(rma);
    } else {
      res.status(404).json({ message: 'RMA not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete an RMA
router.delete('/:id', async (req, res) => {
  try {
    const rma = await RMA.findByIdAndDelete(req.params.id);
    if (rma) {
      res.status(200).json({ message: 'RMA deleted successfully' });
    } else {
      res.status(404).json({ message: 'RMA not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
