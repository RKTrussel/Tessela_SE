import './Hero.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HeroMarketPicture from '../../../Assets/HeroMarketPicture.JPG';

const HeroMarket = () => {
    return (
        <>
            <div className='hero-overlay'></div>
            <div className='hero'>
                <Container className="h-100">
                    <Row className="h-100 align-items-center">
                        <Col className="hero-market-left">
                            <h2>Support Indigenous Artisans.</h2>
                            <p>Discover unique, handcrafted items made with tradition and care.</p>
                            <Link to="/marketplace" className="marketplace-link mt-3">
                                Visit Marketplace
                            </Link>
                        </Col>
                        <Col className='hero-market-right'>
                            <img 
                                src={HeroMarketPicture} 
                                alt="Handcrafted market" 
                                className="hero-market-img"
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
};

export default HeroMarket;
