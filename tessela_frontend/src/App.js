import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './Components/Home_Page/homePage';
import Explore from './Components/Explore_Pages/exploreContainer';
import ItemContainer from './Components/Item_Pages/itemContainer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Route for explore not yet done  */}
        <Route path="/explore" element={<Explore />} />
        {/* Route for items not yet done  */}
        <Route path="/product" element={<ItemContainer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
