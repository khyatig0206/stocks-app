// client/src/Signup.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', password: '', isAdmin: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, formData);
      alert('Signup successful');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAdmin"
              onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
              className="mr-2 rounded focus:ring-indigo-500"
            />
            <label className="text-gray-700">Admin</label>
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center">
          Already have an account? <Link to="/" className="text-indigo-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
