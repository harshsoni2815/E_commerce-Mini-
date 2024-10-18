import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './nav.css';

const Nav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); 
    } else {
      setIsAuthenticated(false); 
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className='nav-c'>
      <div className='nav2'>
        <nav>
          <ul className="navbar">
            {!isAuthenticated && <li><Link to="/">Login/sign up</Link></li>} 
            {isAuthenticated && (
              <li>
                <button onClick={handleLogout} className='logout-button'>Logout</button> 
              </li>
            )}
            <li><Link to="/home">Home</Link></li>
            
            <li><Link to="/order">My Orders</Link></li>
            <li><Link to="/cart">My Cart</Link></li> 
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Nav;
