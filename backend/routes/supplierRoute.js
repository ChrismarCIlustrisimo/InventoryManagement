import express from 'express';
import Supplier from '../models/supplierModel.js';
import mongoose from 'mongoose';

const router = express.Router();

// Create a new supplier
router.post('/', async (req, res) => {
  try {
    const { supplier_name, contact_person, phone_number, categories, remarks, email } = req.body;

    // Ensure supplier_name is provided
    if (!supplier_name) {
      return res.status(400).json({ message: 'Supplier name is required' });
    }

    // Generate a unique supplier ID
    const supplier_id = await Supplier.generateSupplierId();

    const newSupplier = new Supplier({
      supplier_id,
      supplier_name,
      contact_person,
      phone_number,
      email,
      categories,
      remarks,
    });

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
      data: suppliers,
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get a single supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Supplier ID' });
    }

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    console.error('Error fetching supplier by ID:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a supplier by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier_name, contact_person, phone_number, categories, remarks, email } = req.body;

    // Validate required fields
    if (!supplier_name || !contact_person || !phone_number || !categories || !remarks || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      { 
          supplier_name, 
          contact_person, 
          phone_number, 
          categories: categories || [], 
          remarks: remarks || '', 
          email 
      },
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
