import { logTransaction } from '../socket.js';
import { timerDuration } from '../socket.js';

export const addTransaction = (req, res) => {
  // Get the username and userId from the session
  const userId = req.session.user?.id; // Corrected userId access from session
  const username = req.session.user?.name; 
  const { amount } = req.body;

  // Check if userId exists to ensure the user is authenticated
  if (!userId) {
    return res.status(400).json({ message: 'User not authenticated' });
  }

  // Create the transaction object with the username and other details
  const transaction = {
    userId,         // Include userId for reference
    username,       // Include username if needed
    amount,
    timestamp: Date.now(),
    timerDuration: timerDuration, // Current timer value when transaction is logged
  };

  // Log the transaction and emit updates if needed
  logTransaction(transaction);

  // Respond to the client with the transaction data
  return res.status(200).json({ 
    message: 'Transaction logged successfully', 
    transaction 
  });
};
