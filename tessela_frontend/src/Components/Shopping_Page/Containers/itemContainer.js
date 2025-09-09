import Navbar from '../Navbar/Navbar';
import SecondNavbar from '../Navbar/SecondNavbar';
import ImagePreview from '../Item_Page/imagePreview';
import ItemDetails from '../Item_Page/itemDetails';
import Reviews from '../Item_Page/reviews';
import RelatedProducts from '../Item_Page/relatedProducts';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ItemContainer() {
  const { id } = useParams();

  return (
    <>
      <Navbar />
      <SecondNavbar />
      <hr style={{ position: 'sticky', top: '123px', zIndex: 2 }} />
      <Container fluid>
        <Row className="justify-content-center">
          <ImagePreview id={id} />
          <ItemDetails id={id} />
        </Row>

        <Row className="justify-content-center my-4 mx-3">
          <Col xs={12} md={12} lg={12}>
            {id && <RelatedProducts productId={id} limit={8} />}
          </Col>
        </Row>

        <Row className="justify-content-center my-4">
          <Col xs={12} md={10} lg={10}>
            <Reviews productId={id} />
          </Col>
        </Row>

      </Container>
    </>
  );
}

export default ItemContainer;