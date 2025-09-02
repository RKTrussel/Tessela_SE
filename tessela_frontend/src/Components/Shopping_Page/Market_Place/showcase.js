import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import dressImg from "./cathethiya.jpg";
// import boleroImg from "../assets/bolero.jpg";
// import barongImg from "../assets/barong.jpg";

export default function Showcase() {
  const showcaseImages = [
    {
      url: dressImg,
      alt: "Inabel",
    },
    {
      url: dressImg,
      alt: "Ikat",
    },
    {
      url: dressImg,
      alt: "??",
    },
  ];

  return (
    <Container className="my-5">
      <h3 className="text-center mb-4">#Tessela</h3>
      <Row>
        {showcaseImages.map((img, index) => (
          <Col key={index} xs={12} md={4} className="mb-4">
            <div style={{ overflow: "hidden" }}>
              <img
                src={img.url}
                alt={img.alt}
                style={{
                  width: "100%",
                  height: "25rem",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                }}
              />
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}