import SideNavbar from "../Sellers_Info/sideNavbar";
import TopNavbar from "../Sellers_Info/topNavbar";
import SellerDashboard from "../Sellers_Info/dashboardInfo";
import MyOrders from "../Orders/myOrders";
import MyProducts from "../Products/myProducts";
import { TopCustomNav } from "../Product_add/topCustomNav";

const containerStyle = {
    display: 'flex',
    background: '#f5f5f5',
    minHeight: '94vh'
};

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
            <TopCustomNav 
                breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'My Orders' }
                ]}
            />
            <div className="d-flex" style={containerStyle}>
                <SideNavbar />
                <MyOrders />
            </div>
        </>
    );
}

export function MyProductContainer() {
    return (
        <>
            <TopCustomNav 
                breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'My Products' }
                ]}
            />
            <div className="d-flex" style={containerStyle}>
                <SideNavbar />
                <MyProducts />
            </div>
        </>
    );
}