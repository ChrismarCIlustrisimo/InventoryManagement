import express from 'express';
import Supplier from '../models/supplierModel.js';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Ensure this folder exists or create it
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Create a new supplier
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { name, contact_number, email } = req.body;
    const image = req.file ? req.file.path : '';

    if (!name || !contact_number || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newSupplier = new Supplier({ name, contact_number, email, image });
    const savedSupplier = await newSupplier.save();
    return res.status(201).json(savedSupplier);
  } catch (error) {
    console.error('Error creating supplier:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    return res.status(200).json({
      count: suppliers.length,
      data: suppliers
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Get a single supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    return res.status(200).json(supplier);
  } catch (error) {
    console.error('Error fetching supplier by ID:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Update a supplier by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_number, email } = req.body;

    if (!name || !contact_number || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      { name, contact_number, email },
      { new: true, runValidators: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    return res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error('Error updating supplier:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a supplier by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    return res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
