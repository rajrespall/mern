import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        // Replace with your API endpoint
        const response = await axios.post('/api/auth/signup', { email, password });
        console.log(response.data); // Handle response
    };

    return (
        <form onSubmit={handleSignup}>
            <h2>Signup</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Signup</button>
        </form>
    );
};

export default Signup;
