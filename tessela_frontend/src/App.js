import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './Components/Shopping_Page/Home_Page/homePage';
import Explore from './Components/Shopping_Page/Containers/exploreContainer';
import ItemContainer from './Components/Shopping_Page/Containers/itemContainer';
import LoginRegisterContainer from './Components/Shopping_Page/Containers/LRContainer';

import { DashboardContainer, MyOrderContainer } from './Components/Sellers_Page/Containers/dashboardContainer';
import MyProductContainer from "./Components/Sellers_Page/Containers/myProductContainer";
import ProductAddContainer from './Components/Sellers_Page/Containers/productAddContainer';

import AuthContainer from './Components/Auth/Container/AuthContainer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shopping Page */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login_register" element={<LoginRegisterContainer />} />
        <Route path="/explore/:id" element={<Explore />} />
        <Route path="/product/:id" element={<ItemContainer />} />

        {/* Auth Page */}
        <Route path="/auth" element={<AuthContainer />} />

        {/* Sellers Page */}
        <Route path="/dashboard" element={<DashboardContainer />} />
        <Route path="/dashboard/myOrder" element={<MyOrderContainer />} />
        <Route path="/dashboard/myProduct" element={<MyProductContainer />} />
        <Route path="/dashboard/myProduct/addProduct" element={<ProductAddContainer />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
