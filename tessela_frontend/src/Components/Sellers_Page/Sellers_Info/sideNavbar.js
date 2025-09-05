import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { useNavigate } from 'react-router-dom';

function SideNavbar() {
  const [open, setOpen] = useState({ products: false, orders: false, campaigns: false });
  const navigate = useNavigate();

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
      {/* Orders Section */}
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
              <button
                type="button"
                className="list-group-item list-group-item-action text-start"
                onClick={() => navigate('/dashboard/myOrder')}
              >
                My Orders
              </button>
            </div>
          </div>
        </Collapse>
      </div>

      {/* Products Section */}
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
              <button
                type="button"
                className="list-group-item list-group-item-action text-start"
                onClick={() => navigate('/dashboard/myProduct')}
              >
                My Products
              </button>
              <button
                type="button"
                className="list-group-item list-group-item-action text-start"
                onClick={() => navigate('/dashboard/myProduct/addProduct')}
              >
                Add New Product
              </button>
            </div>
          </div>
        </Collapse>
      </div>

      {/* Blogs Section */}
      <div className="mb-2 w-100">
        <Button
          variant="outline-primary"
          className="w-100 text-start"
          onClick={() => handleToggle('blogs')}
          aria-expanded={open.blogs}
        >
          Blogs
        </Button>

        <Collapse in={open.blogs}>
          <div>
            <div className="list-group w-100 mt-2">
              <button
                type="button"
                className="list-group-item list-group-item-action text-start"
                onClick={() => navigate('/dashboard/myBlogs')}
              >
                My Blogs
              </button>
              <button
                type="button"
                className="list-group-item list-group-item-action text-start"
                onClick={() => navigate('/dashboard/myBlog/addBlogs')}
              >
                Add New Blogs
              </button>
            </div>
          </div>
        </Collapse>
      </div>

      {/* Campaigns Section */}
      <div className="mb-2 w-100">
        <Button
          variant="outline-primary"
          className="w-100 text-start"
          onClick={() => handleToggle('campaigns')}
          aria-expanded={open.campaigns}
        >
          Campaign
        </Button>

        <Collapse in={open.campaigns}>
          <div>
            <div className="list-group w-100 mt-2">
              <button
                type="button"
                className="list-group-item list-group-item-action text-start"
                onClick={() => navigate('/dashboard/myCampaign')}
              >
                My Campaigns
              </button>
              <button
                type="button"
                className="list-group-item list-group-item-action text-start"
                onClick={() => navigate('/dashboard/myCampaign/addCampaign')}
              >
                Add New Campaign
              </button>
            </div>
          </div>
        </Collapse>
      </div>
    </aside>
  );
}

export default SideNavbar;
