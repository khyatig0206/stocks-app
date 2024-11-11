import express from 'express';
import { setTimer } from '../controllers/timerController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/set', isAuthenticated, setTimer);

export default router;