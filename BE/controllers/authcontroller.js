import User from '../models/user.js';
import bcrypt from 'bcrypt';

// Sign up a new user
export const register = async (req, res) => {
    const { name, password, isAdmin } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, password: hashedPassword, isAdmin });
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  };
  
  export const login = async (req, res) => {
    const { name, password } = req.body;
  
    try {
      const user = await User.findOne({ name });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Store only necessary information in the session
      req.session.user = {
        id: user._id,   // Store user id
        name: user.name,
        isAdmin: user.isAdmin,  // Store the admin flag if required
      };
  
      // Send back the relevant user info to the client (but not sensitive data)
      res.json({
        message: 'Login successful',
        user: { name: user.name, isAdmin: user.isAdmin }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  };
  
  
  export const logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: 'Error logging out' });
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  };