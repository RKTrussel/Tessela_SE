import { Link } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import "./Hero.css";
import PeopleWeaving from '../../../Assets/PeopleWeaving.jpeg';

const HeroCrowdFund = () => {
  return (
    <>
      <div className='hero-overlay'></div>
            <div className='hero'>
                <Container className="h-100">
                    <Row className="h-100 align-items-center">
                        <Col className="hero-blog-left">
                            <h2>Weave Hope with Every Gift</h2>
                            <p>Your donation helps preserve indigenous traditions and uplift communities.</p>
                            <Link to="/donate" className="marketplace-link mt-3">
                                Donate Now
                            </Link>
                        </Col>
                        <Col>
                            <img 
                                src={PeopleWeaving} 
                                alt="Handcrafted market" 
                                className="hero-blog-img"
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
    </>
  );
};

export default HeroCrowdFund;