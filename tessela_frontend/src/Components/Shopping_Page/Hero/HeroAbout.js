import './Hero.css';
import { Container, Row, Col } from 'react-bootstrap';
import InabelWeaving from '../../../Assets/InabelWeaving.jpg';
import { Link } from 'react-router-dom';


const HeroAbout = () => {
    return (
        <>
            <div className='hero-overlay'></div>
            <div className='hero'>
                <Container className="h-100">
                    <Row className="h-100 align-items-center">
                        <Col className="hero-blog-left">
                            <h2>Contact Us</h2>
                            <p>Interested about our mission? Get in touch with our team.</p>
                            <Link to="/about" className="marketplace-link mt-3">
                                About us
                            </Link>
                        </Col>
                        <Col>
                            <img 
                                src={InabelWeaving} 
                                alt="Handcrafted market" 
                                className="hero-blog-img"
                            />
                        </Col>
                    </Row>
                </Container>
            </div>

        </>
    )
};

export default HeroAbout;
