// socket.js
import { Server } from 'socket.io';

let io;
let timer = null;
export let timerDuration = 0; 
let isTimerActive = false;
const transactionLog = []; // Stores transactions for the current session
let totalAmount = 0;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.emit('totalAmountUpdate', totalAmount);
    socket.emit('timerUpdate', { timerDuration, isTimerActive });
    socket.emit('transactionLog', transactionLog); // Send existing transactions

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

export const startTimer = (duration) => {
  timerDuration = duration;
  isTimerActive = true;
  io.emit('timerUpdate', { timerDuration, isTimerActive });

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    timerDuration -= 1;
    if (timerDuration <= 0) {
      clearInterval(timer);
      isTimerActive = false;
      io.emit('timerUpdate', { timerDuration: 0, isTimerActive: false });
    } else {
      io.emit('timerUpdate', { timerDuration, isTimerActive });
    }
  }, 1000);
};

// Log each transaction and emit to clients
export const logTransaction = (transaction) => {
  transactionLog.push(transaction); 
  totalAmount += transaction.amount;// Add transaction to in-memory log
  io.emit('transactionUpdate', transaction);
  io.emit('totalAmountUpdate', totalAmount);
};

export default io;
