import BackgroundPicture from '../../../Assets/BackgroundPicture.jpg';
import './Background.css';

const Background = () => {
    return(
        <img src={BackgroundPicture} alt='ESL' className='background' />
    )
};

export default Background;