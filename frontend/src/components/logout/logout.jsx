import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the token from local storage or wherever it is stored
        localStorage.removeItem('token');
        // Redirect to login or home page
        navigate('/login'); // Adjust to your routing setup
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
