import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import Dashboard from './pages/Dashboard';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<h2>Welcome!</h2>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
