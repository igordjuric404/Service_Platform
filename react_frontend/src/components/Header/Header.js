import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoggedInStatus = () => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoggedInStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false); 
  };

  return (
    <header className="header">
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to="/providers">Providers</Link>
          </li>

          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
