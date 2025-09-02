import Navbar from '../Navbar/Navbar';
import Marketplace from '../Market_Place/marketPlace';
import Showcase from '../Market_Place/showcase';

function MarketPlaceContainer() {
    return (
        <>
            <Navbar />
            <hr style={{position: 'sticky', top: '60px', zIndex: 2,}}/>
            <Marketplace />
            <Showcase />
        </>
    );
}

export default MarketPlaceContainer;