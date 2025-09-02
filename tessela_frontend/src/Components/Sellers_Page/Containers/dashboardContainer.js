import SideNavbar from "../Sellers_Info/sideNavbar";
import TopNavbar from "../Sellers_Info/topNavbar";
import SellerDashboard from "../Sellers_Info/dashboardInfo";
import MyOrders from "../Orders/myOrders";
import { TopCustomNav3 } from "../Product_add/topCustomNav";

export function DashboardContainer() {
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

export function MyOrderContainer() {
    return (
        <>
            <TopCustomNav3 />
            <div className="d-flex" style={{display: 'flex' , background: '#f5f5f5' , minHeight: '94vh'}}>
                <SideNavbar />
                <MyOrders />
            </div>
        </>
    );
}
