import Counter from '../models/counterModel.js';
// unfinish
// Function to generate a new transaction ID
const generateTransactionId = async () => {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'sales_id' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } 
      );
  
      if (!counter) {
        throw new Error('Failed to generate transaction_id');
      }
  
      return `SL-${counter.seq.toString().padStart(3, '0')}`;
    } catch (error) {
      throw new Error('Error generating transaction ID');
    }
  };