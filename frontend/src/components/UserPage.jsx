// src/pages/UserPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import socket from '../socket';
import axios from 'axios';

const UserPage = () => {
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [amount, setAmount] = useState('');
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
    // Listen for timer updates
    socket.on('timerUpdate', ({ timerDuration, isTimerActive }) => {
      setTimer(timerDuration);
      setIsTimerActive(isTimerActive);
    });
    return () => {
      socket.off('timerUpdate');
    };
  }, []);

  // Handle adding an amount
  const handleAddAmount = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/transactions/add`,
        { amount: Number(amount), timerDuration: timer },
        { withCredentials: true }
      );
      setAmount('');
    } catch (error) {
      console.error('Error adding amount:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">User Dashboard</h1>

      {/* Timer Section */}
      <div className="bg-white shadow-lg p-6 rounded-lg mb-6 w-full md:w-1/2">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Current Timer</h2>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            <strong>{timer}</strong> seconds
          </span>
          <span className={`px-2 py-1 rounded text-white ${isTimerActive ? 'bg-green-500' : 'bg-gray-500'}`}>
            {isTimerActive ? 'Timer is Active' : 'Timer is Inactive'}
          </span>
        </div>
      </div>

      {/* Add Amount Section */}
      <div className="bg-white shadow-lg p-6 rounded-lg w-full md:w-1/2">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add to Stock Account</h2>
        <div className="flex items-center">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="border border-gray-300 p-2 rounded-lg w-full mr-4 focus:outline-none focus:ring focus:border-blue-300"
            disabled={!isTimerActive}
          />
          <button
            onClick={handleAddAmount}
            disabled={!isTimerActive}
            className={`px-4 py-2 rounded-lg transition ${
              isTimerActive ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add Amount
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
