import express from 'express';
import { register, login, logout } from '../controllers/authcontroller.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', isAuthenticated, logout);

export default router;