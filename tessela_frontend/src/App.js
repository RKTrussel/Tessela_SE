import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './Components/Home_Page/homePage';
import Inabel from './Components/Explore_Pages/Inabel/inabel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inabel" element={<Inabel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
