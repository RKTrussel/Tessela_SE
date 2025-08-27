import { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import SecondNavbar from '../Navbar/SecondNavbar';
import ExploreStory from '../Explore_Page/exploreStory';
import ExploreImage from '../Explore_Page/exploreImage';
import ExploreNavbar from '../Explore_Page/exploreNavbar';
import Explore from '../Explore_Page/exploreArea';

function ExploreContainer() {
    const [sort, setSort] = useState('default'); // Track current sort option

    return (
        <>
            <Navbar />
            <SecondNavbar />
            <hr />
            <ExploreImage />
            <hr />
            <ExploreStory />
            <hr />
            {/* Pass sort state and setter to ExploreNavbar */}
            <ExploreNavbar sort={sort} setSort={setSort} />
            <hr />
            {/* Pass current sort to ExploreArea */}
            <Explore sort={sort} />
        </>
    );
}

export default ExploreContainer;