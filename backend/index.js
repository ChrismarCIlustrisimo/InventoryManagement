// Import required modules
import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoute.js';
import customerRoutes from './routes/customerRoute.js';
import transactionRoutes from './routes/transactionRoute.js';
import userRoute from './routes/userRoute.js';
import SupplierRoute from './routes/supplierRoute.js';
import Counter from './models/counterModel.js';
import { mongoDBURL, PORT } from './config.js';
import cleanupExpiredTransactions from './middleware/cleanupExpiredTransactions .js';

import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve static files from public folder
app.use(cleanupExpiredTransactions); // Apply cleanup middleware


// Mount routes
app.use('/product', productRoutes);
app.use('/customer', customerRoutes);
app.use('/transaction', transactionRoutes);
app.use('/user', userRoute);
app.use('/supplier', SupplierRoute);



// Function to initialize the counter
const initializeCounter = async () => {
  try {
    const counter = await Counter.findById('transaction_id');
    if (!counter) {
      await new Counter({ _id: 'transaction_id', seq: 0 }).save();
    }
  } catch (error) {
    console.error('Error initializing counter:', error);
  }
};

// MongoDB connection
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('Connected to MongoDB');
    initializeCounter(); // Initialize counter after MongoDB connection is established
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
