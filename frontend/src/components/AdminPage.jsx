// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import socket from '../socket';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPage = () => {
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [durationInput, setDurationInput] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/check-session`,
          { withCredentials: true }
        );
        if (!response.data.loggedIn) {
          navigate('/');
        }
      } catch (error) {
        console.error('Session check error:', error);
        navigate('/');
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    socket.on('timerUpdate', ({ timerDuration, isTimerActive }) => {
      setTimer(timerDuration);
      setIsTimerActive(isTimerActive);
    });

    // Listen for transaction updates
    socket.on('transactionUpdate', (transaction) => {
      setTransactions((prev) => [transaction, ...prev]);
    });

    socket.on('totalAmountUpdate', (updatedTotal) => {
        setTotalAmount(updatedTotal);
      });

    return () => {
      socket.off('timerUpdate');
      socket.off('transactionUpdate');
      socket.off('totalAmountUpdate');
    };
  }, []);

  // Handle starting or setting the timer
  const handleSetTimer = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/timer/set`,
        { duration: Number(durationInput) },
        { withCredentials: true }
      );
      setDurationInput('');
    } catch (error) {
      console.error('Error setting timer:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Admin Dashboard</h1>
      
      {/* Timer Section */}
      <div className="mb-6 bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Current Timer: <span className="text-blue-600">{timer}</span> seconds</h2>
        <div className="flex items-center">
          <input
            type="number"
            value={durationInput}
            onChange={(e) => setDurationInput(e.target.value)}
            placeholder="Set duration (seconds)"
            className="border border-gray-300 p-2 rounded mr-4 w-48 focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={handleSetTimer}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
          >
            Start Timer
          </button>
        </div>
      </div>
      
      {/* Transaction List */}
      <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Total Amount: <span className="text-green-600">Rs.{totalAmount}</span></h2>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Transactions</h2>
        <ul className="list-disc pl-6 text-gray-600">
          {transactions.length > 0 ? (
            transactions.map((txn, idx) => (
              <li key={idx} className="mb-2">
                <span className="font-medium text-gray-800">User:</span> {txn.username}, <span className="font-medium text-gray-800">Amount:</span> {txn.amount}, <span className="font-medium text-gray-800">Time:</span> {new Date(txn.timestamp).toLocaleString()}, <span className="font-medium text-gray-800">Timer Duration:</span> {txn.timerDuration} seconds
              </li>
            ))
          ) : (
            <p className="text-gray-500">No recent transactions available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
