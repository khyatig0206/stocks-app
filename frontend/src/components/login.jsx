// client/src/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
            formData,
            { withCredentials: true } // allows cookies to be sent
          );

      // Check if the logged-in user is an admin and redirect accordingly
      const { isAdmin } = response.data.user;
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
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
          <button
            type="submit"
            className="w-full py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Log In
          </button>
        </form>
        <p className="text-center">
          Don't have an account? <Link to="/signup" className="text-indigo-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
