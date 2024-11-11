// index.js
import http from 'http';
import express from 'express';
import session from 'express-session';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import MongoStore from 'connect-mongo';
import timerRoutes from './routes/timerRoutes.js';
import TransactionRoutes from './routes/transactionRoutes.js';
import { initializeSocket } from './socket.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);  // Use the server instance

initializeSocket(server);  // Initialize WebSocket after creating the server instance

app.use(
  cors({
    origin: 'http://localhost:5173', // Update this to match your frontend's URL
    credentials: true, // Allows credentials (cookies) to be sent
  })
);

app.use(express.json());
app.use(
  session({
    secret: 'some_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS; false for localhost
      sameSite: 'lax', // Helps with cross-origin requests
      maxAge: 86400000, // 1 day
    },
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/timer', timerRoutes);
app.use('/api/transactions', TransactionRoutes);

app.get('/api/auth/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Use server.listen, not app.listen

