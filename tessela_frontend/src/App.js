import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './Components/Shopping_Page/Home_Page/homePage';
import Explore from './Components/Explore_Page/exploreContainer';
import ItemContainer from './Components/Item_Page/itemContainer';
import LoginRegisterContainer from './Components/Shopping_Page/Login_Register_Page/LRContainer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login_register" element={<LoginRegisterContainer />} />
        {/* Route for explore not yet done  */}
        <Route path="/explore/:id" element={<Explore />} />
        {/* Route for items not yet done  */}
        <Route path="/product/:id" element={<ItemContainer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
