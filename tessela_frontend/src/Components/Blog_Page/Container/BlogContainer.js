import SideNavbar from "../../Sellers_Page/Sellers_Info/sideNavbar";
import MyBlog from "../MyBlog";
import CreateBlog from "../Blog_Creation/CreateBlog";
import { TopCustomNav } from "../../Sellers_Page/Product_add/topCustomNav";

const containerStyle = {
    display: 'flex',
    background: '#f5f5f5',
    minHeight: '94vh'
};

export function MyBlogContainer() {
    return (
        <>
            <TopCustomNav
                breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'My Blog' }
                ]}
            />
            <div className="d-flex" style={containerStyle}>
                <SideNavbar />
                <MyBlog />
            </div>
        </>
    );
}

export function AddBlogContainer() {
    return (
        <>
            <TopCustomNav
                breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'My Blog', path: '/dashboard/myBlog' },
                    { label: 'Add Blog' }
                ]}
            />
            <div className="d-flex" style={containerStyle}>
                <SideNavbar />
                <CreateBlog />
            </div>
        </>
    );
}