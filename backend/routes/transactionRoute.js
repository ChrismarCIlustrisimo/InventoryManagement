import express from 'express';
import Transaction from '../models/transactionModel.js';
import Product from '../models/productModel.js';
import Customer from '../models/customerModel.js';
import Counter from '../models/counterModel.js';
import requireAuth from '../middleware/requireAuth.js';
import RMA from '../models/RmaModel.js';
const router = express.Router();
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
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

// Create Transaction
router.post('/', async (req, res) => {
  try {
    const {
      products,
      customer,
      total_price,
      transaction_date,
      total_amount_paid_paid,
      payment_status,
      cashier,
      discount,
      vat,
      payment_method,
      status,
    } = req.body;

    // Validate required fields
    if (!products || !customer || !total_price || !transaction_date || payment_status === undefined) {
      return res.status(400).json({
        message: 'Products, customer, total_price, transaction_date, and payment_status are required',
      });
    }

    console.log('Received transaction data:', req.body);

    const productItems = await Promise.all(
      products.map(async (item) => {
        const { product: productId, serial_number: unitIds, item_status, reason_for_refund } = item;

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

        for (let unitId of unitIds) {
          console.log(`Processing product ${productId} with unit ID ${unitId}`);

          const productUnit = productDoc.units.find(
            (unit) => unit._id.toString() === unitId && unit.status === 'in_stock'
          );

          console.log(`Units for produc ${productUnit}`)

          if (!productUnit) {
            console.warn(`Skipping unit ID ${unitId} - already sold or unavailable`);
            continue;
          }

          // Mark the unit as 'sold'
          productUnit.status = 'sold';

          processedUnits.push({
            product: productId,
            serial_number: productUnit.serial_number,
            price: productDoc.selling_price,
          });
        }

        if (processedUnits.length === 0) {
          throw new Error(`No available units for product ID ${productId}`);
        }

        await productDoc.save(); // Save the product document to update the status of units

        return {
          product: productId,
          serial_number: processedUnits.map((unit) => unit.serial_number),
          price: productDoc.selling_price,
          quantity: processedUnits.length, // Track sold units
        };
      })
    );

    // Calculate total price with VAT and discount
    const totalPriceWithoutVat = productItems.reduce(
      (acc, curr) => acc + curr.quantity * curr.price,
      0
    );

    const transaction_id = await generateTransactionId();
    const dueDate = new Date(transaction_date);
    dueDate.setDate(dueDate.getDate() + 1);

    const newTransaction = new Transaction({
      transaction_id,
      products: productItems.map((item) => ({
        product: item.product,
        serial_number: item.serial_number,
        quantity: item.quantity,
        price: item.price,
        item_status: item.item_status,
        reason_for_refund: item.reason_for_refund,
      })),
      customer,
      total_price,
      total_amount_paid_paid,
      transaction_date,
      due_date: dueDate,
      payment_status,
      cashier,
      discount,
      vat,
      payment_method,
      status
    });

    const transaction = await newTransaction.save();
    return res.status(201).send(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error.message });
  }
});





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


router.post('/online-reservation', async (req, res) => {
  try {
    const {
      products,
      customer: customerId, // This will be the customer ID
      total_price,
      transaction_date,
      total_amount_paid,
      payment_status,
      cashier,
      discount,
      vat,
      payment_method,
      status,
    } = req.body;

    // Validate required fields
    if (!products || !customerId || !total_price || !transaction_date || payment_status === undefined) {
      return res.status(400).json({
        message: 'Products, customer, total_price, transaction_date, and payment_status are required.',
      });
    }

    // Process each product item with serial numbers and include product_name
    const productItems = await Promise.all(
      products.map(async (item) => {
        const { product: productId, serial_number: unitSerialNumbers } = item;

        if (!Array.isArray(unitSerialNumbers) || unitSerialNumbers.length === 0) {
          throw new Error(`Serial numbers are missing or not in the correct format for product ID ${productId}`);
        }

        const productDoc = await Product.findById(productId);
        if (!productDoc) {
          throw new Error(`Product with ID ${productId} not found.`);
        }

        const processedUnits = [];
        for (let serial of unitSerialNumbers) {
          const productUnit = productDoc.units.find(
            (unit) => unit.serial_number === serial && unit.status === 'in_stock'
          );

          if (!productUnit) {
            console.warn(`Skipping serial ${serial} - already sold or unavailable.`);
            continue;
          }

          productUnit.status = 'reserved';
          processedUnits.push({
            product: productId,
            serial_number: productUnit.serial_number,
            product_name: productDoc.name, // Added product_name
            price: productDoc.selling_price,
          });
        }

        if (processedUnits.length === 0) {
          throw new Error(`No available units for product ID ${productId}`);
        }

        await productDoc.save();

        return {
          product: productId,
          product_name: productDoc.name, // Added product_name
          serial_number: processedUnits.map((unit) => unit.serial_number),
          price: productDoc.selling_price,
          quantity: processedUnits.length,
        };
      })
    );

    // Calculate total price before VAT
    const totalPriceWithoutVat = productItems.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);

    // Generate transaction ID and set due date
    const transaction_id = await generateTransactionId();
    const dueDate = new Date(transaction_date);
    dueDate.setMinutes(dueDate.getMinutes() + 1); // Set due date to 1 minute later
    
    //const dueDate = new Date(transaction_date);
    //dueDate.setHours(dueDate.getHours() + 24); // Set due date to 24 hours later
    
    // Create and save the new transaction
    const newTransaction = new Transaction({
      transaction_id,
      products: productItems.map((item) => ({
        product: item.product,
        product_name: item.product_name, // Included product_name here
        serial_number: item.serial_number,
        quantity: item.quantity,
        price: item.price,
      })),
      customer: customerId, // Store the customer ID
      total_price,
      total_amount_paid,
      transaction_date,
      due_date: dueDate,
      payment_status,
      cashier,
      discount,
      vat,
      payment_method,
      status,
    });

    const transaction = await newTransaction.save();

    // Retrieve the customer's email using the customer ID
    const customer = await Customer.findById(customerId);
    if (!customer || !customer.email) {
      console.error("Customer not found or email is missing.");
      return res.status(404).json({ message: "Customer not found or email is missing." });
    }

    // Prepare email content
    const emailText = `
      Dear ${customer.name},
      
      Thank you for your reservation! Here are your transaction details:
      
      Transaction ID: ${transaction_id}
      Total Price: ${total_price}
      Payment Status: ${payment_status}
      Transaction Date: ${transaction_date}
      
      Products:
      ${productItems.map(item => `${item.product_name} (Serial: ${item.serial_number.join(', ')}) - Price: ${item.price}`).join('\n')}
      
      We appreciate your business!
    `;

    // Send the confirmation email
    sendEmail(customer.email, 'Reservation Confirmation', emailText);

    return res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});













router.get('/', async (req, res) => {
  try {
    let query = {};

    // Build query based on request parameters
    if (req.query.payment_status) {
      query.payment_status = req.query.payment_status;
    }

    if (req.query.transaction_id) {
      query.transaction_id = { $regex: req.query.transaction_id, $options: 'i' };
    }

    if (req.query.cashier) {
      query.cashier = { $regex: req.query.cashier, $options: 'i' }; 
    }

    // Date filtering
    if (req.query.startDate || req.query.endDate) {
      query.transaction_date = {};
      if (req.query.startDate) {
        query.transaction_date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.transaction_date.$lte = new Date(req.query.endDate);
      }
    }

    // Price filtering
    if (req.query.minPrice) {
      query.total_amount_paid = { ...query.total_amount_paid, $gte: Number(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      query.total_amount_paid = { ...query.total_amount_paid, $lte: Number(req.query.maxPrice) };
    }

    // Apply status filters
    if (req.query.statusFilters) {
      const statusFilters = JSON.parse(req.query.statusFilters);
      const itemStatusConditions = [];

      // Check for each status and add it to the conditions if checked
      if (statusFilters.Completed) itemStatusConditions.push({ status: 'Completed' });
      if (statusFilters.Refunded) itemStatusConditions.push({ status: 'Refunded' });
      if (statusFilters.Replaced) itemStatusConditions.push({ status: 'Replaced' });

      if (itemStatusConditions.length > 0) {
        query.$or = itemStatusConditions; // Use $or for top-level query
      }
    }

    // Log the constructed query before executing it
    console.log('Constructed Query:', query);

    // Sorting
    let sort = {};
    if (req.query.sortBy) {
      sort[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1; // Example sorting logic
    }

    // Populate customer while querying
    const transactions = await Transaction.find(query)
      .populate('products.product')
      .populate('customer')
      .sort(sort);

    // If a customer name filter is applied, filter the results after population
    let filteredTransactions = transactions;
    if (req.query.customer) {
      const customerRegex = new RegExp(req.query.customer, 'i'); // Case-insensitive regex
      filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.customer && customerRegex.test(transaction.customer.name)
      );
    }

    return res.status(200).json({ count: filteredTransactions.length, data: filteredTransactions });

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


// Get Single Transaction
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({ _id: id })
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

router.put('/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { 
      payment_status, 
      cashier, 
      discount, 
      status, 
      payment_method, 
      total_amount_paid, 
      products, 
      transaction_date // Add transaction_date here
    } = req.body;

    // Validate payment_status input
    if (payment_status && !['paid', 'unpaid'].includes(payment_status)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    // Validate discount input
    if (discount !== undefined && typeof discount !== 'number') {
      return res.status(400).json({ message: 'Invalid discount value' });
    }

    // Prepare update object for the transaction
    const updateFields = {};
    if (payment_status) updateFields.payment_status = payment_status;
    if (cashier) updateFields.cashier = cashier;
    if (discount !== undefined) updateFields.discount = discount; // Add discount
    if (status) updateFields.status = status; // Add status
    if (payment_method) updateFields.payment_method = payment_method; // Add payment method
    if (total_amount_paid !== undefined) updateFields.total_amount_paid = total_amount_paid; // Add total amount
    if (transaction_date) updateFields.transaction_date = transaction_date; // Add transaction_date

    // Update transaction
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { transaction_id: transactionId },
      { $set: updateFields },
      { new: true } // Return the updated document
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update the status of each unit (serial number) to "sold"
    if (products && Array.isArray(products)) {
      const unitUpdates = products.map(product => {
        return {
          updateOne: {
            filter: { 
              "units.serial_number": { $in: product.serial_number } // Filter by serial number
            },
            update: {
              $set: { "units.$.status": 'sold' } // Set status to 'sold'
            }
          }
        };
      });

      // Perform bulk update for all units
      await Product.bulkWrite(unitUpdates);
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
    const { products, customer, total_amount_paid_paid, source, cashier,transaction_date } = req.body;
    const { id } = req.params;

    // Validate required fields
    if (!products || !total_amount_paid_paid || !cashier) {
      return res.status(400).send({ message: 'Products, total_amount_paid_paid, and cashier are required' });
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
      total_amount_paid_paid,
      payment_status,
      cashier,
      transaction_date
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

router.put('/:transactionId/replace-units', async (req, res) => {
  try {
      const { transactionId } = req.params;
      const { products, rmaId } = req.body;

      // Validate input
      if (!products || products.length === 0) {
          return res.status(400).json({ message: 'Products are required for replacement.' });
      }

      // Find the transaction by its transaction_id
      const transaction = await Transaction.findOne({ transaction_id: transactionId });

      // Check if transaction exists
      if (!transaction) {
          return res.status(404).json({ message: 'Transaction not found.' });
      }

      // Loop through each product to update the serial numbers
      for (const { old_serial_number, new_serial_number } of products) {
          // Find the product in the transaction's products array
          const productToUpdate = transaction.products.find(product => product.serial_number.includes(old_serial_number));

          // If the product with the old serial number exists, update it
          if (productToUpdate) {
              // Update the old serial number status to 'replaced'
              const updateOldUnit = await Product.updateOne(
                  { 'units.serial_number': old_serial_number },
                  { $set: { 'units.$.status': 'replaced' } }
              );

              if (updateOldUnit.nModified === 0) {
                  return res.status(500).json({ message: `Failed to update status for old unit ${old_serial_number}.` });
              }

              // Update the product's serial_number to the new serial number
              productToUpdate.serial_number = new_serial_number;

              // Update the new serial number status to 'in_stock'
              const updateNewUnit = await Product.updateOne(
                  { 'units.serial_number': new_serial_number },
                  { $set: { 'units.$.status': 'sold' } }
              );

              if (updateNewUnit.nModified === 0) {
                  return res.status(500).json({ message: `Failed to update status for new unit ${new_serial_number}.` });
              }

              // Update the RMA status for the current new_serial_number
              await RMA.updateOne(
                  { rma_id: rmaId }, // Assuming rmaId is passed in the request body
                  { $set: { status: 'Completed'} }
              );
          } else {
              return res.status(400).json({ message: `Serial number ${old_serial_number} not found in the transaction.` });
          }
      }

      // Update the transaction status to 'Replaced'
      transaction.status = 'Replaced';

      // Save the updated transaction
      await transaction.save();
      
      return res.status(200).json({ message: 'Units replaced successfully!', transaction });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error while processing replacement.', error: error.message });
  }
});




export default router;
