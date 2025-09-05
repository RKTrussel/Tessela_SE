import { TopCustomNav } from "../Product_add/topCustomNav";
import ItemAddInfo from "../Product_add/itemAddInfo";

const containerStyle = {
    display: 'flex',
    background: '#f5f5f5',
    minHeight: '94vh'
};

export default function ProductAddContainer() {
    return (
        <>
            <TopCustomNav
                breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'My Products', path: '/dashboard/myProduct' },
                    { label: 'Add Product' }
                ]}
            />
            <div style={containerStyle}>
                <ItemAddInfo />
            </div>
        </>
    );
}
