import React, { useState } from 'react';
import BackgroundPicture from '../../../Assets/BackgroundPicture.jpg';
import './Background.css';

const Background = () => {
    return(
        <img src={BackgroundPicture} className='background' />
    )
};

export default Background;