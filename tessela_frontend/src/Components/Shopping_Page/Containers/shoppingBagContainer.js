import Navbar from '../Navbar/Navbar';
import SecondNavbar from '../Navbar/SecondNavbar';
import Cart from '../ShoppingBag_Page/cart';

function ShoppingBagContainer() {
    return (
        <>
            <Navbar />
            <SecondNavbar />
            <hr />
            <Cart />
        </>
    );
}

export default ShoppingBagContainer;