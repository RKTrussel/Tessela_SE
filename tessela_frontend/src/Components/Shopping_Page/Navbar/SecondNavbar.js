import './Navbar.css';
import { Link } from 'react-router-dom';

const SecondNavbar = () => {
    return (
        <>
            <nav>
                <ul className="second-navbar">
                    <li><Link to="/explore/Inabel">Inabel</Link></li>
                    <li><Link to="/explore/Ikat">Ikat</Link></li>
                    <li><Link to="/explore/Kalinga">Kalinga</Link></li>
                </ul>
            </nav>
        </>
    )
};

export default SecondNavbar;