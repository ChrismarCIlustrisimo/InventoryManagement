// index.js
import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoute.js';
import customerRoutes from './routes/customerRoute.js';
import transactionRoutes from './routes/transactionRoute.js';
import Counter from './models/counterModel.js'; // Import Counter model
import { mongoDBURL, PORT } from './config.js';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());

// Routes
app.use('/product', productRoutes);
app.use('/customer', customerRoutes);
app.use('/transaction', transactionRoutes);

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
mongoose.connect(mongoDBURL)
  .then(() => {
    console.log('Connected to MongoDB');
    // Initialize the counter after connecting to MongoDB
    initializeCounter();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });