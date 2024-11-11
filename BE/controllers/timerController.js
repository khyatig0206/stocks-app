import { startTimer } from '../socket.js';

export const setTimer = (req, res) => {
  const { duration } = req.body;
  startTimer(duration);
  res.status(200).json({ message: 'Timer started', duration });
};