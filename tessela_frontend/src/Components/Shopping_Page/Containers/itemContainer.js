import Navbar from '../Navbar/Navbar';
import SecondNavbar from '../Navbar/SecondNavbar';
import ImagePreview from '../Item_Page/imagePreview';
import ItemDetails from '../Item_Page/itemDetails';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function ItemContainer() {
    const { id } = useParams(); 

    return (
        <>
            <Navbar />
            <SecondNavbar />
            <hr style={{position: 'sticky', top: '123px', zIndex: 2,}}/>
            <Container fluid>
                <Row className="justify-content-center">
                    <ImagePreview id={id} />
                    <ItemDetails id={id} />
                </Row>
            </Container>
        </>
    );
}

export default ItemContainer;