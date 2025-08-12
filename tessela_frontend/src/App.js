import React, {useState} from 'react';
import Background from "./Components/Background/Background";
import Navbar from './Components/Navbar/Navbar';
import Hero from './Components/Hero/Hero';
import SecondNavbar from './Components/Navbar/SecondNavbar';



function App() {
  return (
    <div>
        <Background />
        <Navbar /> 
        <SecondNavbar />    
    </div>
  );
}

export default App;
