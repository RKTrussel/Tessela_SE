import 'bootstrap/dist/css/bootstrap.min.css';
import Background from '../Background/Background';
import Navbar from '../Navbar/Navbar';

import SecondNavbar from '../Navbar/SecondNavbar';

function homePage() {
  return (
    <div>
        <Background />
        <Navbar /> 
        <SecondNavbar />    
    </div>
  );
}

export default homePage;
