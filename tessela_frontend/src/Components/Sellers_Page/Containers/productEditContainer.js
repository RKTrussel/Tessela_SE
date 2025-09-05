import { TopCustomNav } from "../Product_add/topCustomNav";
import EditProduct from "../Products/EditProduct";

const containerStyle = {
    display: 'flex',
    background: '#f5f5f5',
    minHeight: '94vh'
};

export default function EditProductContainer() {
    return (
        <>
            <TopCustomNav
                breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'My Products', path: '/dashboard/myProduct' },
                    { label: 'Edit Product' }
                ]}
            />
            <div style={containerStyle}>
                <EditProduct />
            </div>
        </>
    );
}
