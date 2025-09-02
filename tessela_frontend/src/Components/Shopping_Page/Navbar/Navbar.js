import './Navbar.css';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiSearch, FiUser } from "react-icons/fi";
import { useState, useEffect } from 'react';
import LogoutButton from '../../Auth/logoutButton';
import SearchOverlay from '../Search/SearchOverlay';

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !showSearch) {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showSearch]);

  return (
    <>
      <nav className='navbar'>
        <h2 className='logo'>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Tessela
          </Link>
        </h2>
        <ul>
          {/* Account dropdown */}
          <li style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowDropdown(prev => !prev)}
              style={{ background: "transparent", border: 0, cursor: "pointer" }}
            >
              <FiUser className="logo-icon" />
            </button>

            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "2.5rem",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  minWidth: "160px",
                  zIndex: 1000,
                }}
              >
                {isLoggedIn ? (
                  <>
                    <Link to="/account" className="dropdown-item">My Account</Link>
                    <LogoutButton className="dropdown-item"/>
                  </>
                ) : (
                  <Link to="/auth" className="dropdown-item">Login</Link>
                )}
              </div>
            )}
          </li>

          {/* Search */}
          <li>
            <button
              type="button"
              onClick={() => setShowSearch(prev => !prev)} 
              aria-label="Open search"
              style={{ background: "transparent", border: 0, padding: 0, lineHeight: 0, cursor: "pointer" }}
            >
              <FiSearch className='logo-icon'/>
            </button>
          </li>

          {/* Shopping bag */}
          <li>
            <Link to='/shoppingBag'>
              <FiShoppingBag className='logo-icon'/>
            </Link>
          </li>
        </ul>
      </nav>

      <SearchOverlay show={showSearch} onHide={() => setShowSearch(false)} />
    </>
  );
};

export default Navbar;