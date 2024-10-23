import express from 'express';
import Refund from '../models/refundModel.js';
const router = express.Router();

// Create a new refund
router.post('/', async (req, res) => {
  try {
    const refund = new Refund(req.body);
    await refund.save();
    res.status(201).json(refund);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all refunds
router.get('/', async (req, res) => {
  try {
    const refunds = await Refund.find().populate('transaction_id'); // Populate transaction details if needed
    res.status(200).json(refunds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single refund by ID
router.get('/:id', async (req, res) => {
  try {
    const refund = await Refund.findById(req.params.id);
    if (!refund) {
      return res.status(404).json({ message: 'Refund not found' });
    }
    res.status(200).json(refund);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a refund by ID
router.put('/:id', async (req, res) => {
  try {
    const refund = await Refund.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!refund) {
      return res.status(404).json({ message: 'Refund not found' });
    }
    res.status(200).json(refund);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a refund by ID
router.delete('/:id', async (req, res) => {
  try {
    const refund = await Refund.findByIdAndDelete(req.params.id);
    if (!refund) {
      return res.status(404).json({ message: 'Refund not found' });
    }
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
