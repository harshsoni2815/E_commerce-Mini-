import React from 'react'
import { Link } from 'react-router-dom'
import './nav.css'

const Nav = () => {
  return (
    <div className='nav-c'>
        <div className='nav2'>

      <nav>
                <ul className="navbar">
                    <li><Link to="/">Login</Link></li>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/about">About</Link></li> {/* Add more links as needed */}
                </ul>
            </nav>
        </div>
    </div>
  )
}

export default Nav;
