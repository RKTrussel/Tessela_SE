import Navbar from '../Navbar/Navbar';
import SecondNavbar from '../Navbar/SecondNavbar';
import ExploreStory from '../Explore_Page/exploreStory';
import ExploreImage from '../Explore_Page/exploreImage';
import ExploreNavbar from '../Explore_Page/exploreNavbar';
import Explore from '../Explore_Page/exploreArea';

function ExploreContainer() {
    return (
        <>
            <Navbar />
            <SecondNavbar />
            <hr />
            <ExploreImage />
            <hr />
            <ExploreStory />
            <hr />
            <ExploreNavbar />
            <hr />
            <Explore />
        </>
    );
}

export default ExploreContainer;