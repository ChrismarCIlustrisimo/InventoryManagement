import express from 'express';
import Transaction from '../models/transactionModel.js';
import Product from '../models/productModel.js';
import Customer from '../models/customerModel.js';
import Counter from '../models/counterModel.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// requireAuth for all transactions routes
router.use(requireAuth)

// Function to generate a new transaction ID
const generateTransactionId = async () => {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'transaction_id' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } 
    );

    if (!counter) {
      throw new Error('Failed to generate transaction_id');
    }

    return `SO-${counter.seq.toString().padStart(3, '0')}`;
  } catch (error) {
    throw new Error('Error generating transaction ID');
  }
};

// Add Transaction
router.post('/', async (request, response) => {
  try {
    const { products, customer, total_price, transaction_date, total_amount_paid, source } = request.body;

    const productItems = await Promise.all(products.map(async (item) => {
      const { product: productId, quantity } = item;
      const productDoc = await Product.findById(productId);
      if (!productDoc) {
        throw new Error(`Product with id ${productId} not found`);
      }
      return {
        product: productId,
        quantity,
        price: productDoc.selling_price // Include price in product items
      };
    }));

    const totalPrice = productItems.reduce((acc, curr) => {
      const productPrice = curr.quantity * curr.price;
      return acc + productPrice;
    }, 0);

    if (total_price !== totalPrice) {
      throw new Error(`Total price mismatch. Expected ${totalPrice}, received ${total_price}`);
    }

    const transaction_id = await generateTransactionId(); // Generate transaction_id here

    const payment_status = source === 'pos' ? 'paid' : 'unpaid'; // Set payment_status based on source

    const newTransaction = new Transaction({
      transaction_id,
      products: productItems,
      customer,
      total_price,
      total_amount_paid,
      transaction_date,
      payment_status // Set payment_status here
    });

    const transaction = await newTransaction.save();
    return response.status(201).send(transaction);

  } catch (error) {
    console.error(error);
    return response.status(500).send('Server Error');
  }
});


// Get All Transactions
router.get('/', async (request, response) => {
  try {
    let query = {};

    if (request.query.payment_status) {
      query.payment_status = request.query.payment_status;
    }

    if (request.query.startDate && request.query.endDate) {
      query.transaction_date = {
        $gte: new Date(request.query.startDate),
        $lte: new Date(request.query.endDate),
      };
    } else if (request.query.startDate) {
      query.transaction_date = { $gte: new Date(request.query.startDate) };
    } else if (request.query.endDate) {
      query.transaction_date = { $lte: new Date(request.query.endDate) };
    }

    if (request.query.minPrice && request.query.maxPrice) {
      query.total_price = {
        $gte: parseInt(request.query.minPrice),
        $lte: parseInt(request.query.maxPrice),
      };
    } else if (request.query.minPrice) {
      query.total_price = { $gte: parseInt(request.query.minPrice) };
    } else if (request.query.maxPrice) {
      query.total_price = { $lte: parseInt(request.query.maxPrice) };
    }

    let sort = {};

    if (request.query.sortBy === 'price_asc') {
      sort = { total_price: 1 };
    } else if (request.query.sortBy === 'price_desc') {
      sort = { total_price: -1 };
    } else if (request.query.sortBy === 'customer_name_asc') {
      sort = { 'customer.name': 1 };
    } else if (request.query.sortBy === 'customer_name_desc') {
      sort = { 'customer.name': -1 };
    } else if (request.query.sortBy === 'transaction_id_desc') {
      sort = { transaction_id: -1 };
    } else if (request.query.sortBy === 'transaction_id_asc') {
      sort = { transaction_id: 1 };
    } else {
      sort = { transaction_id: 1 };
    }

    const transactions = await Transaction.find(query)
      .populate('products.product')
      .populate('customer')
      .sort(sort);

    return response.status(200).json({ count: transactions.length, data: transactions });

  } catch (error) {
    console.error(error);
    return response.status(500).send('Server Error');
  }
});


//Get Single Transaction
router.get('/:transactionId', async (request, response) => {
  try {
    const { transactionId } = request.params;
    const transaction = await Transaction.findOne({ transaction_id: transactionId })
      .populate('products.product')
      .populate('customer');

    if (!transaction) {
      return response.status(404).json({ message: 'Transaction not found' });
    }

    return response.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    return response.status(500).send('Server Error');
  }
});


// Update Transaction
router.put('/:id', async (request, response) => {
  try {
    const { products, customer, total_amount_paid, source } = request.body;
    const { id } = request.params;

    if (!products || !customer || !total_amount_paid) {
      return response.status(400).send({ message: 'Products, customer, and total_amount_paid are required' });
    }

    const productItems = await Promise.all(products.map(async (item) => {
      const { product: productId, quantity } = item;
      const productDoc = await Product.findById(productId);
      if (!productDoc) {
        throw new Error(`Product with id ${productId} not found`);
      }
      return {
        product: productId,
        quantity,
      };
    }));

    const total_price = productItems.reduce((acc, curr) => {
      const productPrice = curr.quantity * productDoc.selling_price;
      return acc + productPrice;
    }, 0);

    // Optionally handle payment_status update if source is included in the update request
    const payment_status = source ? (source === 'pos' ? 'paid' : 'unpaid') : undefined;

    const transaction = await Transaction.findByIdAndUpdate(id, {
      products: productItems,
      customer,
      total_price,
      total_amount_paid,
      payment_status // Update payment_status if present
    }, { new: true });

    if (!transaction) {
      return response.status(404).json({ message: 'Transaction not found' });
    }

    return response.status(200).send({ message: 'Transaction updated', data: transaction });

  } catch (error) {
    console.error(error);
    return response.status(500).send('Server Error');
  }
});


// Delete Transaction
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Transaction.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Transaction not found' });
    }

    return response.status(200).json({ message: 'Transaction deleted Successfully' });
  } catch (error) {
    console.error(error);
    return response.status(500).send('Server Error');
  }
});

export default router;
