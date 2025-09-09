import Navbar from '../Navbar/Navbar';
import SecondNavbar from '../Navbar/SecondNavbar';
import Cart from '../ShoppingBag_Page/cart';
import Checkout from '../CheckOut/checkout';

export function ShoppingBagContainer() {
  return (
    <>
      <Navbar />
      <SecondNavbar />
      <hr />
      <Cart />
    </>
  );
}

export function CheckoutContainer() {
  return (
    <>
      <Navbar />
      <SecondNavbar />
      <hr />
      <Checkout />
    </>
  );
}