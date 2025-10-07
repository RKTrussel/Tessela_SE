import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './Components/Shopping_Page/Home_Page/homePage';
import Explore from './Components/Shopping_Page/Containers/exploreContainer';
import ItemContainer from './Components/Shopping_Page/Containers/itemContainer';
import { ShoppingBagContainer , CheckoutContainer  } from './Components/Shopping_Page/Containers/cartCheckoutContainer';
import MarketPlaceContainer from './Components/Shopping_Page/Containers/marketPlaceContainer';
import AddressContainer from './Components/Shopping_Page/Containers/addressContainer';
import AboutPage from './Components/About_Page/AboutPage';

import HomeBlogPage from './Components/Blog_Page/HomeBlogPage';

import { DashboardContainer, MyOrderContainer , MyProductContainer } from './Components/Sellers_Page/Containers/dashboardContainer';
import ProductAddContainer from './Components/Sellers_Page/Containers/productAddContainer';
import { MyCampaignContainer, AddCampaignContainer , CampaignDonateContainer , CampaignDirectoryContainer } from './Components/Campaign/Container/CampaignContainer';
import { MyBlogContainer , AddBlogContainer } from './Components/Blog_Page/Container/BlogContainer';

import AuthContainer from './Components/Auth/Container/AuthContainer';

import { AuthProvider } from './Components/Auth/AuthContext';
import RequireAuth from './Components/Auth/Guards/RequireAuth';
import RequireRole from './Components/Auth/Guards/RequireRole';
import GuestOnly from './Components/Auth/Guards/GuestOnly';

import SearchContainer from './Components/Shopping_Page/Containers/searchContainer';
import BlogDetail from './Components/Blog_Page/BlogDetails';

function CampaignDonateRoute() {
  const { id } = useParams();
  console.log("donate route id:", id); // <-- should log a number, not 'undefined'
  return <CampaignDonateContainer campaignId={id} />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<HomeBlogPage />} />

          {/* Public donation routes */}
         <Route path="/donate" element={<CampaignDirectoryContainer />} />
         <Route path="/donate/:id" element={<CampaignDonateRoute />} />

          {/* Guests-only auth */}
          <Route element={<GuestOnly />}>
            <Route path="/auth" element={<AuthContainer />} />
          </Route>

          {/* Protected (logged-in) */}
          <Route element={<RequireAuth />}>
            {/* User area */}
            <Route element={<RequireRole allow={['user']} />}>
              <Route path="/explore/:weavingType" element={<Explore />} />
              <Route path="/product/:id" element={<ItemContainer />} />
              <Route path="/search" element={<SearchContainer />} /> 
              <Route path="/shoppingBag" element={<ShoppingBagContainer />} />
              <Route path="/checkout" element={<CheckoutContainer />} />
              <Route path="/marketplace" element={<MarketPlaceContainer />} />
              <Route path="/account" element={<AddressContainer />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* Admin area */}
            <Route element={<RequireRole allow={['admin']} />}>
              <Route path="/dashboard" element={<DashboardContainer />} />
              <Route path="/dashboard/myProduct" element={<MyProductContainer />} />
              <Route path="/dashboard/myOrder" element={<MyOrderContainer />} />
              <Route path="/dashboard/myProduct/addProduct" element={<ProductAddContainer />} />
              <Route path="/dashboard/myCampaign" element={<MyCampaignContainer />} />
              <Route path="/dashboard/myCampaign/addCampaign" element={<AddCampaignContainer />} />
              <Route path="/dashboard/myBlog" element={<MyBlogContainer />} />
              <Route path="/dashboard/myBlog/addBlogs" element={<AddBlogContainer />} />
              <Route path="/blogs/:blogId" element={<BlogDetail />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;