import Navbar from '../Navbar/Navbar';
import SecondNavbar from '../Navbar/SecondNavbar';
import ExploreStory from './exploreStory';
import ExploreImage from './exploreImage';
import ExploreNavbar from './exploreNavbar';
import Explore from './exploreArea';

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