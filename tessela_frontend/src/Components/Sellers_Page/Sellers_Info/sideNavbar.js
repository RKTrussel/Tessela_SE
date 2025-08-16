import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

function SideNavbar() {
    const [open, setOpen] = useState({ products: false, orders: false });

    const handleToggle = (key) => {
        setOpen((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <aside
            className="d-flex flex-column bg-white p-3"
            style={{ width: 240, minHeight: '94vh' }}
        >
            <div className="mb-2 w-100">
                <Button
                    variant="outline-primary"
                    className="w-100 text-start"
                    onClick={() => handleToggle('orders')}
                    aria-expanded={open.orders}
                >
                    Order
                </Button>

                <Collapse in={open.orders}>
                    <div>
                        <div className="list-group w-100 mt-2">
                            <button type="button" className="list-group-item list-group-item-action text-start">My Orders</button>
                        </div>
                    </div>
                </Collapse>
            </div>

            <div className="mb-2 w-100">
                <Button
                    variant="outline-primary"
                    className="w-100 text-start"
                    onClick={() => handleToggle('products')}
                    aria-expanded={open.products}
                >
                    Product
                </Button>

                <Collapse in={open.products}>
                    <div>
                        <div className="list-group w-100 mt-2">
                            <button type="button" className="list-group-item list-group-item-action text-start">My Products</button>
                            <button type="button" className="list-group-item list-group-item-action text-start">Add New Product</button>
                        </div>
                    </div>
                </Collapse>
            </div>
        </aside>
    );
}

export default SideNavbar;