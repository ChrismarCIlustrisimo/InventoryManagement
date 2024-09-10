import express from 'express';
import Refund from '../models/RefundModel.js';
import Transaction from '../models/transactionModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
      const { transaction_id, selectedItems, refundReason, cashier } = req.body;

      // Fetch the transaction and populate the product details
      const transaction = await Transaction.findOne({ transaction_id }).populate('products.product');

      if (!transaction) {
          return res.status(404).json({ message: 'Transaction not found' });
      }

      const refundedProducts = [];
      const remainingProducts = [];

      // Loop through transaction products and handle refund logic
      transaction.products.forEach((item) => {
        const productId = item.product._id.toString();
        const refundedItem = selectedItems[productId];
    
        console.log('Product ID:', productId);
        console.log('Refunded Item:', refundedItem);
    
        if (refundedItem) {
            const refundQuantity = Number(refundedItem) || 0;
    
            console.log('Refund Quantity:', refundQuantity);
    
            if (refundQuantity > item.quantity) {
                return res.status(400).json({ message: 'Refund quantity exceeds purchased quantity' });
            }
    
            refundedProducts.push({
                product: item.product._id,
                quantity: refundQuantity,
            });
    
            if (refundQuantity < item.quantity) {
                remainingProducts.push({
                    product: item.product._id,
                    quantity: item.quantity - refundQuantity,
                });
            }
        } else {
            remainingProducts.push(item);
        }
    });
    
    
      
      // Create a refund record in the Refund collection
      const refund = new Refund({
          transaction_id,
          refunded_products: refundedProducts,
          refund_reason: refundReason,
          refunded_by: cashier,
          refund_date: new Date(),
      });
      await refund.save();

      // Update the transaction with remaining products or delete if fully refunded
      if (remainingProducts.length > 0) {
          transaction.products = remainingProducts;
          // Ensure item prices are numbers
          transaction.total_price = remainingProducts.reduce(
              (total, item) => {
                  const itemPrice = Number(item.product.selling_price) || 0; // Ensure itemPrice is a number
                  const itemQuantity = Number(item.quantity) || 0; // Ensure itemQuantity is a number
                  return total + itemPrice * itemQuantity;
              },
              0
          );
          console.log('Updated Total Price Calculation:', transaction.total_price); // Log total_price calculation
          await transaction.save();
      } else {
          await Transaction.deleteOne({ transaction_id });
      }

      // Send a success response
      res.status(200).json({ message: 'Refund processed successfully', refund });
  } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).json({ message: 'Server error', error });
  }
});






// Get all refunds
router.get('/', async (req, res) => {
  try {
    const refunds = await Refund.find().populate('refunded_products.product'); // Populate product details
    res.status(200).json(refunds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update a refund by ID
router.put('/:id', async (req, res) => {
  try {
    const { selectedItems, refundReason, cashier } = req.body;
    const refund = await Refund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({ message: 'Refund not found' });
    }

    // Update the refund details
    refund.refund_reason = refundReason || refund.refund_reason;
    refund.refunded_by = cashier || refund.refunded_by;
    refund.refund_date = new Date();

    // Update refunded products
    if (selectedItems) {
      const updatedProducts = [];
      for (let itemId in selectedItems) {
        updatedProducts.push({
          product: itemId,
          quantity: selectedItems[itemId].quantity,
        });
      }
      refund.refunded_products = updatedProducts;
    }

    await refund.save();
    res.status(200).json({ message: 'Refund updated successfully', refund });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete a refund by ID
router.delete('/:id', async (req, res) => {
  try {
    const refund = await Refund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({ message: 'Refund not found' });
    }

    await refund.remove();
    res.status(200).json({ message: 'Refund deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});


export default router;
