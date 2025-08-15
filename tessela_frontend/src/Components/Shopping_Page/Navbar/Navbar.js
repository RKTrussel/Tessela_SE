import './Navbar.css';

import { Link } from 'react-router-dom';

import { FiShoppingBag } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { FiUser } from "react-icons/fi";

const Navbar = () => {
    return (
        <nav className='navbar'>
            <h2 className='logo'>Tessela</h2>
            <ul>
                <li>
                    <Link to='/account'>
                        <FiUser className='logo-icon'/>
                    </Link>
                </li>
                <li>
                    <Link to='/search'>
                        <FiSearch className='logo-icon'/>                    
                    </Link>
                </li>
                <li>
                    <Link to='/shoppingBag'>
                        <FiShoppingBag className='logo-icon'/>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;