import TopNavbar from "../../Sellers_Page/Sellers_Info/topNavbar";
import SideNavbar from "../../Sellers_Page/Sellers_Info/sideNavbar";
import MyCampaign from "../MyCampaign";
import AddCampaign from "../AddCampaign";
import { TopCustomNav3 } from "../../Sellers_Page/Product_add/topCustomNav";

export function MyCampaignContainer() {
    return (
        <>
            <TopNavbar />
            <div className="d-flex" style={{display: 'flex' , background: '#f5f5f5' , minHeight: '94vh'}}>
                <SideNavbar />
                <MyCampaign />
            </div>
        </>
    );
}

export function AddCampaignContainer() {
    return (
        <>
            <TopCustomNav3 />
            <AddCampaign />
        </>
    );
}