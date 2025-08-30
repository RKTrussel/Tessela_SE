import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api';
import Col from 'react-bootstrap/Col';

function ItemDetails() {
    const { id } = useParams();  // Get product ID from URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);  // Fetch product details by ID
                setProduct(response.data); // Set the product data from response
                console.info(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product details:', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);  // Run this effect whenever `id` changes

    if (loading) return <div>Loading...</div>;

    return (
        <Col xs={3}>
            <h2>{product?.name || 'Product name not available'}</h2>
            <h4>{product?.description || 'No description available'}</h4>
            <p><strong>The Anniversary Sale</strong></p>
            <p>
                <span style={{ color: "#d9534f", fontWeight: "bold" }}>Sale price ₱{product?.price || 'N/A'}</span><br />
                <span style={{ textDecoration: "line-through" }}>Regular price ₱{product?.price ? (product?.price * 1.10).toFixed(2) : 'N/A'}</span>
            </p>
            <p>SKU: {product?.barcode_value || 'N/A'}</p>
            <p><strong>Only {product?.stock || '0'} units left</strong></p>
            <div className="d-flex align-items-center mb-2">
                <button className="btn btn-outline-secondary btn-sm me-2">-</button>
                <span>1</span>
                <button className="btn btn-outline-secondary btn-sm ms-2">+</button>
            </div>
            <button className="btn btn-primary mb-3">Add to shopping bag</button>
            <div className="alert alert-info">
                {product?.sale_info || 'No sale info available'} <a href="#dsa">See promo codes</a>
            </div>
            <hr />
            <h5>EDITOR'S NOTE</h5>
            <p>{product?.editor_note || 'No editor’s note available'}</p>
            <h6>SUITABLE FOR</h6>
            <p>{product?.suitable_for || 'No suitable for information available'}</p>
            <h6>THE DETAILS</h6>
            <ul>
                {product?.details?.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                )) || <li>No details available</li>} {/* Add default message if no details */}
            </ul>
        </Col>
    );
}

export default ItemDetails;