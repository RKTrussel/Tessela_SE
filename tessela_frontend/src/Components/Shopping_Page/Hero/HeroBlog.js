import './Hero.css';
import { Container, Row, Col } from 'react-bootstrap';
import InabelWeaving from '../../../Assets/InabelWeaving.jpg';
import { Link } from 'react-router-dom';


const HeroBlog = () => {
    return (
        <>
            <div className='hero-overlay'></div>
            <div className='hero'>
                <Container className="h-100">
                    <Row className="h-100 align-items-center">
                        <Col className="hero-blog-left">
                            <h2>Rediscovering Indigenous Art</h2>
                            <p>Read the stories of Indigenous artisans and their craft.</p>
                            <Link to="/blog" className="marketplace-link mt-3">
                                Visit Blog
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

export default HeroBlog;
