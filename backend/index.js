import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import productRoutes from './routes/productRoute.js';
import customerRoutes from './routes/customerRoute.js';
import transactionRoutes from './routes/transactionRoute.js';
import userRoute from './routes/userRoute.js';
import SupplierRoute from './routes/supplierRoute.js';
import RMARoute from './routes/RMARoute.js';
import Counter from './models/counterModel.js';
import refundRoute from './routes/refundRoute.js';
import { mongoDBURL, PORT } from './config.js';
import cors from 'cors';
import cron from 'node-cron'; // Import node-cron
import Transaction from './models/transactionModel.js'; // Adjust the path as necessary
import Product from './models/productModel.js'; // Adjust the path as necessary

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.static('public'));

app.set('io', io);

// Define routes
app.use('/product', productRoutes);
app.use('/customer', customerRoutes);
app.use('/transaction', transactionRoutes);
app.use('/user', userRoute);
app.use('/supplier', SupplierRoute);
app.use('/rma', RMARoute);
app.use('/refund', refundRoute);

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Dynamically import WebSocket handlers
  import('./websockets/productSocket.js').then(({ default: productSocket }) => productSocket(io, socket));
  import('./websockets/customerSocket.js').then(({ default: customerSocket }) => customerSocket(io, socket));
  import('./websockets/transactionSocket.js').then(({ default: transactionSocket }) => transactionSocket(io, socket));
});

// Initialize counter
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

// Function to delete transactions and update product status
const processOldTransactions = async () => {
  const now = new Date();

  try {
    // Find transactions that are 'Reserved' and 'unpaid' and past their due date
    const transactions = await Transaction.find({
      status: 'Reserved',
      payment_status: 'unpaid',
      due_date: { $lt: now }
    });

    for (const transaction of transactions) { 
      // Update each product's status to 'in_stock'
      await Promise.all(
        transaction.products.map(async (productItem) => {
          // Find the product by ID
          const product = await Product.findById(productItem.product);
    
          if (product) {
            // Update status of each unit associated with this product
            await Promise.all(
              product.units.map(async (unit) => {
                // Here you can choose which units to update
                await Product.findOneAndUpdate(
                  { _id: product._id, 'units.unit_id': unit.unit_id },
                  { $set: { 'units.$.status': 'in_stock' } }
                );
              })
            );
          }
        })
      );
    
      // Delete the transaction
      await Transaction.findByIdAndDelete(transaction._id);
      console.log(`Deleted transaction ${transaction.transaction_id} and updated associated products.`);
    }
    
  } catch (error) {
    console.error('Error processing old transactions:', error);
  }
};

// Schedule the job to run daily at midnight
cron.schedule('* * * * *', () => {
  console.log('Running scheduled job to process old transactions...');
  processOldTransactions();
});

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('Connected to MongoDB');
    initializeCounter();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
