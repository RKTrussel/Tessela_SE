import SideNavbar from "../../Sellers_Page/Sellers_Info/sideNavbar";
import MyCampaign from "../MyCampaign";
import AddCampaign from "../AddCampaign";
import CampaignDonate from "../CampaignDonate";
import CampaignDirectory from "../CampaignDirectory";
import Navbar from "../../Shopping_Page/Navbar/Navbar";
import SecondNavbar from "../../Shopping_Page/Navbar/SecondNavbar";
import { TopCustomNav } from "../../Sellers_Page/Product_add/topCustomNav";

const containerStyle = {
    display: 'flex',
    background: '#f5f5f5',
    minHeight: '94vh'
};

export function MyCampaignContainer() {
    return (
        <>
            <TopCustomNav 
                breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'My Campaigns' }
                ]}
            />
            <div className="d-flex" style={containerStyle}>
                <SideNavbar />
                <MyCampaign />
            </div>
        </>
    );
}

export function AddCampaignContainer() {
    return (
        <>
            <TopCustomNav 
                breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'My Campaigns', path: '/dashboard/myCampaign' },
                    { label: 'Add Campaign' }
                ]}
            />
            <div className="d-flex" style={containerStyle}>
                <SideNavbar />
                <AddCampaign />
            </div>
        </>
    );
}

export function CampaignDonateContainer({ campaignId }) {
    return (
        <>
            <Navbar />
            <SecondNavbar />
            <CampaignDonate campaignId={campaignId }/>

        </>
    );
}

export function CampaignDirectoryContainer() {
    return (
        <>
            <Navbar />
            <SecondNavbar />
            <CampaignDirectory />

        </>
    );
}