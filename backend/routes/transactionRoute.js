import express from 'express';
import Transaction from '../models/transactionModel.js';
import Product from '../models/productModel.js';
import Customer from '../models/customerModel.js';
import Counter from '../models/counterModel.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// requireAuth for all transactions routes
//router.use(requireAuth)

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

// routes/transactionRoutes.js
router.post('/', async (req, res) => {
  try {
    const { products, customer, total_price, transaction_date, total_amount_paid, payment_status, cashier } = req.body;

    // Validate required fields
    if (!products || !customer || !total_price || !transaction_date || payment_status === undefined) {
      return res.status(400).json({ message: 'Products, customer, total_price, transaction_date, and payment_status are required' });
    }

    console.log('Received transaction data:', req.body);

    const productItems = await Promise.all(products.map(async (item) => {
      const { product: productId, serial_number: unitIds } = item;

      // Check for valid serial numbers
      if (!Array.isArray(unitIds) || unitIds.length === 0) {
        throw new Error(`Serial numbers (unit IDs) are missing or not in the correct format for product ID ${productId}`);
      }

      const productDoc = await Product.findById(productId);
      if (!productDoc) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      console.log(`Units for product ${productId}:`, productDoc.units);

      const processedUnits = [];

      // Process each unit ID
      for (let unitId of unitIds) {
        console.log(`Processing product ${productId} with unit ID ${unitId}`);

        const productUnit = productDoc.units.find(unit => 
          unit._id.toString() === unitId && unit.status === 'in_stock'
        );

        if (!productUnit) {
          console.warn(`Skipping unit ID ${unitId} - already sold or unavailable`);
          continue;
        }

        // Mark the unit as 'sold'
        productUnit.status = 'sold';
        
        processedUnits.push({
          product: productId,
          serial_number: productUnit.serial_number,
          price: productDoc.selling_price // Keeping the price for transaction purposes
        });
      }

      // Check processed units
      if (processedUnits.length === 0) {
        throw new Error(`No available units for product ID ${productId}`);
      }

      await productDoc.save(); // Save the product document to update the status of units

      return {
        product: productId,
        serial_number: processedUnits.map(unit => unit.serial_number),
        price: productDoc.selling_price,
        quantity: processedUnits.length // Keep track of how many units were sold
      };
    }));

    // Check total price
    const totalPrice = productItems.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);
    if (total_price !== totalPrice) {
      throw new Error(`Total price mismatch. Expected ${totalPrice}, received ${total_price}`);
    }

    const transaction_id = await generateTransactionId();
    const dueDate = new Date(transaction_date);
    dueDate.setDate(dueDate.getDate() + 10);

    const newTransaction = new Transaction({
      transaction_id,
      products: productItems.map(item => ({
        product: item.product,
        serial_number: item.serial_number,
        quantity: item.quantity,
        price: item.price
      })),
      customer,
      total_price,
      total_amount_paid,
      transaction_date,
      due_date: dueDate,
      payment_status,
      cashier
    });

    const transaction = await newTransaction.save();
    return res.status(201).send(transaction);

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error.message });
  }
});
















// Get All Transactions
router.get('/', async (req, res) => {
  try {
    let query = {};

    // Build query based on request parameters
    if (req.query.payment_status) {
      query.payment_status = req.query.payment_status;
    }
    

    if (req.query.transaction_id) {
      query.transaction_id = { $regex: req.query.transaction_id, $options: 'i' }; // Partial match for transaction_id
    }

    // Add condition for cashier name with partial matching
    if (req.query.cashier) {
      query.cashier = { $regex: req.query.cashier, $options: 'i' }; 
    }

    if (req.query.startDate && req.query.endDate) {
      query.transaction_date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    } else if (req.query.startDate) {
      query.transaction_date = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      query.transaction_date = { $lte: new Date(req.query.endDate) };
    }
    

    if (req.query.minPrice && req.query.maxPrice) {
      query.total_price = {
        $gte: parseInt(req.query.minPrice),
        $lte: parseInt(req.query.maxPrice),
      };
    } else if (req.query.minPrice) {
      query.total_price = { $gte: parseInt(req.query.minPrice) };
    } else if (req.query.maxPrice) {
      query.total_price = { $lte: parseInt(req.query.maxPrice) };
    }

    let sort = {};

    if (req.query.sortBy === 'price_asc') {
      sort = { total_price: 1 };
    } else if (req.query.sortBy === 'price_desc') {
      sort = { total_price: -1 };
    } else if (req.query.sortBy === 'customer_name_asc') {
      sort = { 'customer.name': 1 };
    } else if (req.query.sortBy === 'customer_name_desc') {
      sort = { 'customer.name': -1 };
    } else if (req.query.sortBy === 'transaction_id_desc') {
      sort = { transaction_id: -1 };
    } else if (req.query.sortBy === 'transaction_id_asc') {
      sort = { transaction_id: 1 };
    } else {
      sort = { transaction_id: 1 };
    }

    const transactions = await Transaction.find(query)
      .populate('products.product')
      .populate('customer')
      .sort(sort);

    return res.status(200).json({ count: transactions.length, data: transactions });

  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});




// Get Single Transaction
router.get('/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findOne({ transaction_id: transactionId })
      .populate('products.product')
      .populate('customer');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

// Update Transaction (for total price and payment status)
router.put('/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { payment_status, total_price, cashier } = req.body;

    // Validate input
    if (payment_status && !['paid', 'unpaid'].includes(payment_status)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    // Update transaction
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { transaction_id: transactionId },
      {
        $set: {
          payment_status,
          total_price,
          cashier,
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

// Update Transaction
router.put('/:id', async (req, res) => {
  try {
    const { products, customer, total_amount_paid, source, cashier } = req.body;
    const { id } = req.params;

    // Validate required fields
    if (!products || !total_amount_paid || !cashier) {
      return res.status(400).send({ message: 'Products, total_amount_paid, and cashier are required' });
    }

    // Process products
    const productItems = await Promise.all(products.map(async (item) => {
      const { product: productId, quantity } = item;
      const productDoc = await Product.findById(productId);
      if (!productDoc) {
        throw new Error(`Product with id ${productId} not found`);
      }
      return {
        product: productId,
        quantity,
        price: productDoc.selling_price
      };
    }));

    // Calculate total price
    const total_price = productItems.reduce((acc, curr) => {
      const productPrice = curr.quantity * curr.price;
      return acc + productPrice;
    }, 0);

    // Optionally handle payment_status update if source is included
    const payment_status = source ? (source === 'pos' ? 'paid' : 'unpaid') : undefined;

    const transaction = await Transaction.findByIdAndUpdate(id, {
      products: productItems,
      customer,
      total_price,
      total_amount_paid,
      payment_status,
      cashier // Update cashier information
    }, { new: true });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res.status(200).send({ message: 'Transaction updated', data: transaction });

  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

// Delete Transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Transaction.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res.status(200).json({ message: 'Transaction deleted Successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

export default router;
