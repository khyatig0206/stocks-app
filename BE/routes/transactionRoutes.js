import express from 'express';
import { addTransaction } from '../controllers/transactionController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';  // Import the middleware

const router = express.Router();

// Apply isAuthenticated middleware to protect the route
router.post('/add', isAuthenticated, addTransaction);

export default router;