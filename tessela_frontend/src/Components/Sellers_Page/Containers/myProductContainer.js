import SideNavbar from "../Sellers_Info/sideNavbar";
import { TopCustomNav2 } from "../Product_add/topCustomNav";
import MyProducts from "../Products/myProducts";

export default function myProductContainer() {
    return (
        <>
            <TopCustomNav2 />
            <div className="d-flex" style={{display: 'flex' , background: '#f5f5f5' , minHeight: '94vh'}}>
                <SideNavbar />
                <MyProducts />
            </div>
            
        </>
    );
}
