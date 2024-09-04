// middleware/cleanupMiddleware.js
import Transaction from '../models/transactionModel.js';

const cleanupExpiredTransactions = async (req, res, next) => {
  try {
    // Get the current date
    const now = new Date();

    // Delete transactions where due_date is less than the current date
    await Transaction.deleteMany({ due_date: { $lt: now } });

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error cleaning up expired transactions:', error);
    // Proceed even if the cleanup fails, as it should not block the request handling
    next();
  }
};

export default cleanupExpiredTransactions;
