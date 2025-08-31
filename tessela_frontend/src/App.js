import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './Components/Shopping_Page/Home_Page/homePage';
import Explore from './Components/Shopping_Page/Containers/exploreContainer';
import ItemContainer from './Components/Shopping_Page/Containers/itemContainer';
import ShoppingBagContainer from './Components/Shopping_Page/Containers/shoppingBagContainer';

import { DashboardContainer, MyOrderContainer } from './Components/Sellers_Page/Containers/dashboardContainer';
import MyProductContainer from "./Components/Sellers_Page/Containers/myProductContainer";
import ProductAddContainer from './Components/Sellers_Page/Containers/productAddContainer';

import AuthContainer from './Components/Auth/Container/AuthContainer';

import { AuthProvider } from './Components/Auth/AuthContext';
import RequireAuth from './Components/Auth/Guards/RequireAuth';
import RequireRole from './Components/Auth/Guards/RequireRole';
import GuestOnly from './Components/Auth/Guards/GuestOnly';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Guests should NOT reach /auth if already logged in */}
          <Route element={<GuestOnly />}>
            <Route path="/auth" element={<AuthContainer />} />
          </Route>

          {/* Everything below requires a logged-in user (blocks non-user from shop) */}
          <Route element={<RequireAuth />}>
            {/* Shopping Page (protected) */}
            <Route path="/explore/:category" element={<Explore />} />
            <Route path="/product/:id" element={<ItemContainer />} />
            <Route path="/shoppingBag" element={<ShoppingBagContainer />} />

            {/* Admin-only area (blocks user & guest from admin) */}
            <Route element={<RequireRole allow={['admin']} />}>
              <Route path="/dashboard" element={<DashboardContainer />} />
              <Route path="/dashboard/myOrder" element={<MyOrderContainer />} />
              <Route path="/dashboard/myProduct" element={<MyProductContainer />} />
              <Route path="/dashboard/myProduct/addProduct" element={<ProductAddContainer />} />
            </Route>
            
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
