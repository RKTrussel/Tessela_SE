import Navbar from '../Navbar/Navbar';
import Marketplace from '../Market_Place/marketPlace';
import Showcase from '../Market_Place/showcase';

function MarketPlaceContainer() {
    return (
        <>
            <Navbar />
            <hr />
            <Marketplace />
            <Showcase />
        </>
    );
}

export default MarketPlaceContainer;