import './Navbar.css';

import { FiShoppingBag } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { FiUser } from "react-icons/fi";

const Navbar = () => {
    return (
        <nav className='navbar'>
            <h2 className='logo'>Tessela</h2>
            <ul>
                <li><FiUser className='logo-icon'/></li>
                <li><FiSearch className='logo-icon'/></li>
                <li><FiShoppingBag className='logo-icon'/></li>
            </ul>
        </nav>
    );
};

export default Navbar;