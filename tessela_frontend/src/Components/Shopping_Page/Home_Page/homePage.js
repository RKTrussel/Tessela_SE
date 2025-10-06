import 'bootstrap/dist/css/bootstrap.min.css';

import { Carousel } from 'react-bootstrap';

import SecondNavbar from '../Navbar/SecondNavbar';
import Navbar from '../Navbar/Navbar';

import Background from '../Background/Background';
import Hero from '../Hero/Hero'
import HeroBlog from '../Hero/HeroBlog';
import HeroMarket from '../Hero/HeroMarket'; 
import HeroCrowdFund from '../Hero/HeroCrowdFund';
import HeroAbout from '../Hero/HeroAbout';

import "./HomePage.css";

function homePage() {
  return (
    <div>
         <Background />
        <Navbar /> 
        <SecondNavbar />
          <Carousel 
            indicators={false} 
            interval={5000}   
            pause="hover"     
            controls          
          >
            <Carousel.Item>
              <Hero />
            </Carousel.Item>
            <Carousel.Item>
              <HeroMarket />
            </Carousel.Item>
            <Carousel.Item>
              <HeroBlog />
            </Carousel.Item>
            <Carousel.Item>
              <HeroCrowdFund />
            </Carousel.Item>
            <Carousel.Item>
              <HeroAbout />
            </Carousel.Item>
          </Carousel>
          <div className="dimming-div"> </div>
    </div>
  );
}

export default homePage;
