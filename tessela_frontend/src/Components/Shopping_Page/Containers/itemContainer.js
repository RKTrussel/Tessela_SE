import Row from 'react-bootstrap/esm/Row';
import Navbar from '../Navbar/Navbar';
import SecondNavbar from '../Navbar/SecondNavbar';
import ImagePreview from '../Item_Page/imagePreview';
import ItemDetails from '../Item_Page/itemDetails';

import Container from 'react-bootstrap/Container';

function ItemContainer() {
    return (
        <>
            <Navbar />
            <SecondNavbar />
            <hr />
            <Container fluid>
                <Row className="justify-content-center">
                    <ImagePreview />
                    <ItemDetails />
                </Row>
            </Container>
        </>
    );
}

export default ItemContainer;