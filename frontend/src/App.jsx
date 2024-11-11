
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import AdminPage from './components/AdminPage';
import UserPage from './components/UserPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default App;
