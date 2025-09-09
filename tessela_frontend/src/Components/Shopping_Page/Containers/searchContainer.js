import Navbar from '../Navbar/Navbar';
import SecondNavbar from '../Navbar/SecondNavbar';
import SearchPage from '../Search/SearchPage';

function SearchContainer() {
    return (
        <>
            <Navbar />
            <SecondNavbar />
            <hr />
            <SearchPage />
        </>
    );
}

export default SearchContainer;