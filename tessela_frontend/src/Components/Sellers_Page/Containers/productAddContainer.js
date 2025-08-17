import TopCustomNav from "../Product_add/topCustomNav";
import ItemAddInfo from "../Product_add/itemAddInfo";

export default function ProductAddContainer() {
    return (
        <>
            <TopCustomNav />
            <div style={{display: 'flex' , background: '#f5f5f5' , minHeight: '94vh'}}>
                <ItemAddInfo />
            </div>
        </>
    );
}
