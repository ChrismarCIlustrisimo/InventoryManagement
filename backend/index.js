import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import productRoutes from './routes/productRoute.js';
import customerRoutes from './routes/customerRoute.js';
import transactionRoutes from './routes/transactionRoute.js';
import userRoute from './routes/userRoute.js';
import SupplierRoute from './routes/supplierRoute.js';
import RefundRoute from './routes/refundRoute.js'; 
import Counter from './models/counterModel.js';
import { mongoDBURL, PORT } from './config.js';
import cleanupExpiredTransactions from './middleware/cleanupExpiredTransactions.js';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(express.static('public'));
app.use(cleanupExpiredTransactions);

app.set('io', io);

// Define routes
app.use('/product', productRoutes);
app.use('/customer', customerRoutes);
app.use('/transaction', transactionRoutes);
app.use('/user', userRoute);
app.use('/supplier', SupplierRoute);
app.use('/refund', RefundRoute);

// Handle preflight requests
app.options('*', cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
  
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
