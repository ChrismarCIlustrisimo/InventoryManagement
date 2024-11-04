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
import Customer from './models/customerModel.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
      user: process.env.EMAIL_USER, // Email address from .env
      pass: process.env.EMAIL_PASS,  // Email password from .env
  },
});



// Example function to send an email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: to,                        // Recipient address
      subject: subject,              // Subject line
      text: text,                    // Plain text body
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log('Error occurred: ' + error.message);
      }
      console.log('Email sent: ' + info.response);
  });
};



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
      // Get customer email if available
      const customer = await Customer.findById(transaction.customer);
      const customerEmail = customer ? customer.email : 'no-email@example.com'; // Fallback email

      // Update each product's status to 'in_stock'
      await Promise.all(
        transaction.products.map(async (productItem) => {
          const product = await Product.findById(productItem.product);

          if (product) {
            await Promise.all(
              product.units.map(async (unit) => {
                await Product.findOneAndUpdate(
                  { _id: product._id, 'units.unit_id': unit.unit_id },
                  { $set: { 'units.$.status': 'in_stock' } }
                );
              })
            );
          }
        })
      );

      // Send email notification to customer
      sendEmail(customerEmail, 'Transaction Expired', `Your reservation with ID ${transaction.transaction_id} has expired and has been removed. Please contact support for more information.`);

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
