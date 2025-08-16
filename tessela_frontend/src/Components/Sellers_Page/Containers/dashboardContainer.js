import SideNavbar from "../Sellers_Info/sideNavbar";
import TopNavbar from "../Sellers_Info/topNavbar";
import SellerDashboard from "../Sellers_Info/dashboardInfo";

export default function DashboardContainer() {
    return (
        <>
            <TopNavbar />
            <div className="d-flex">
                <SideNavbar />
                <SellerDashboard />
            </div>
            
        </>
    );
}
