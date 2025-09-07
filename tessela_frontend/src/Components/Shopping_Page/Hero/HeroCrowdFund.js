import { Link } from "react-router-dom";
import "./Hero.css";

const HeroCrowdFund = () => {
  return (
    <>
      <div className="hero-overlay"></div>
      <div className="hero">
        <div className="hero-content">
          <h1>Hello Crowd Fund</h1>
          <h2>Connecting the World.</h2>
          <Link to="/donate"  className="marketplace-link">
            Donate Now
          </Link>
        </div>
      </div>
    </>
  );
};

export default HeroCrowdFund;