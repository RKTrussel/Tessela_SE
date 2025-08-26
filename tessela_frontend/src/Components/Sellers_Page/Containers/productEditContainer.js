import { TopCustomNav } from "../Product_add/topCustomNav";
import EditProduct from "../Products/EditProduct";

export default function ProductAddContainer() {
    return (
        <>
            <TopCustomNav />
            <div style={{display: 'flex' , background: '#f5f5f5' , minHeight: '94vh'}}>
                <EditProduct />
            </div>
        </>
    );
}
