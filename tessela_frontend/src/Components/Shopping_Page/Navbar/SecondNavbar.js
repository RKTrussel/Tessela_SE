import './Navbar.css';
import { Link } from 'react-router-dom';

const SecondNavbar = () => {
    return (
        <>
            <nav>
                <ul className="second-navbar">
                    <li><Link to="/inabel">Inabel</Link></li>
                    <li><Link to="/ikat">Ikat</Link></li>
                    <li><Link to="/kalinga">Kalinga</Link></li>
                </ul>
            </nav>
        </>
    )
};

export default SecondNavbar;