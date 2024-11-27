import express from 'express';
import mongoose from 'mongoose';
import AuditLog from '../models/AuditLogModel.js';

const router = express.Router();

// POST route to create a new audit log entry
router.post('/', async (req, res) => {
  const { user, action, module, event, previousValue, updatedValue } = req.body;

  try {
    // Create a new audit log entry
    const newAuditLog = new AuditLog({
      user,
      action,
      module,
      event,
      previousValue,
      updatedValue,
    });

    // Save the audit log to the database
    await newAuditLog.save();

    return res.status(201).json({ message: 'Audit log created successfully', log: newAuditLog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create audit log' });
  }
});

// GET route to fetch audit logs (you can add pagination or filters as needed)
router.get('/', async (req, res) => {
  try {
    // Fetch all audit logs from the database
    const logs = await AuditLog.find().sort({ timestamp: -1 }); // Sorting by timestamp in descending order

    return res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
});

export default router;
