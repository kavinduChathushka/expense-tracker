import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <Link to="/" className="navbar-brand" aria-label="Expense Tracker Home">
          <span className="emoji" role="img" aria-label="money bag">💰</span>
          <span className="text">Expense Tracker</span>
        </Link>
        
        <ul className="navbar-nav" role="menubar">
          <li role="none">
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
              role="menuitem"
              aria-current={isActive('/') ? 'page' : undefined}
              aria-label="Dashboard - View expense overview and summaries"
            >
              <span role="img" aria-label="dashboard" style={{ marginRight: '8px' }}>📊</span>
              Dashboard
            </Link>
          </li>
          <li role="none">
            <Link 
              to="/upload" 
              className={isActive('/upload') ? 'active' : ''}
              role="menuitem"
              aria-current={isActive('/upload') ? 'page' : undefined}
              aria-label="Upload Expense - Add new expense with payslip"
            >
              <span role="img" aria-label="upload" style={{ marginRight: '8px' }}>📤</span>
              Upload Expense
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
