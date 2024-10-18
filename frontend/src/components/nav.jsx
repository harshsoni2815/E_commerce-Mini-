import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './nav.css';

const Nav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // User is logged in
    } else {
      setIsAuthenticated(false); // User is not logged in
    }
  }, []);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    setIsAuthenticated(false); // Update the authentication state
    navigate('/'); // Redirect to login page
  };

  return (
    <div className='nav-c'>
      <div className='nav2'>
        <nav>
          <ul className="navbar">
            {!isAuthenticated && <li><Link to="/">Login/sign up</Link></li>} {/* Show login if not authenticated */}
            {isAuthenticated && (
              <li>
                <button onClick={handleLogout} className='logout-button'>Logout</button> {/* Show logout if authenticated */}
              </li>
            )}
            <li><Link to="/home">Home</Link></li>
            
            <li><Link to="/order">My Orders</Link></li>
            <li><Link to="/cart">My Cart</Link></li> {/* Add this link to the cart page */}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Nav;
