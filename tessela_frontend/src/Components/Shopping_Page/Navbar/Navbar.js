import './Navbar.css';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiSearch, FiUser } from "react-icons/fi";
import { useState, useEffect } from 'react';
import LogoutButton from '../../Auth/logoutButton';
import SearchOverlay from '../Search/SearchOverlay';

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);

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
        <h2 className='logo'>Tessela</h2>
        <ul>
          <li><LogoutButton /></li>
          <li>
            <Link to='/auth'>
              <FiUser className='logo-icon'/>
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setShowSearch(prev => !prev)} // toggle open/close
              aria-label="Open search"
              style={{ background: "transparent", border: 0, padding: 0, lineHeight: 0, cursor: "pointer" }}
            >
              <FiSearch className='logo-icon'/>
            </button>
          </li>
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