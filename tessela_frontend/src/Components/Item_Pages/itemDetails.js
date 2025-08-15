import Col from 'react-bootstrap/Col';

function ItemDetails() {
    return (
        <Col xs={3}>
            <h2>Mario Badescu</h2>
            <h4>Oil Free Moisturizer SPF 30</h4>
            <p><strong>The Anniversary Sale</strong></p>
            <p>
                <span style={{ color: "#d9534f", fontWeight: "bold" }}>Sale price ₱1,955.00</span><br />
                <span style={{ textDecoration: "line-through" }}>Regular price ₱2,300.00</span>
            </p>
            <p>SKU: 1261375</p>
            <p><strong>Only 2 units left</strong></p>
            <div className="d-flex align-items-center mb-2">
                <button className="btn btn-outline-secondary btn-sm me-2">-</button>
                <span>1</span>
                <button className="btn btn-outline-secondary btn-sm ms-2">+</button>
            </div>
            <button className="btn btn-primary mb-3">Add to shopping bag</button>
            <div className="alert alert-info">
                Rustans.com The Anniversary Sale Exclusive: Enjoy extra 10% off via promo code on August 15 to 18, 2025. <a href="#dsa">See promo codes</a>
            </div>
            <hr />
            <h5>EDITOR'S NOTE</h5>
            <p>
                A clear fan favorite, Mario Badescu Oil Free Moisturizer SPF 30 has a best-selling formula that is ideal for all skin types. Formulated to deliver instant, lasting moisture to your skin without excess oil or shine, this moisturizer is also enhanced with green tea extract. These ingredients all together fight off harmful free radicals and UVA/UVB rays that could damage your skin with premature wrinkles, acne marks, and age spots.
            </p>
            <h6>SUITABLE FOR</h6>
            <p>All skin types</p>
            <h6>THE DETAILS</h6>
            <ul>
                <li>Contains SPF 30</li>
                <li>Lightweight, oil-free formula</li>
                <li>Hydrates skin</li>
                <li>Cruelty-free</li>
            </ul>
        </Col>
    );
}

export default ItemDetails;