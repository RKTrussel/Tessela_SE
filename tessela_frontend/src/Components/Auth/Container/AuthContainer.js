import { useState } from "react";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import Login from "../login";
import Register from "../register";
import Navbar from "../../Shopping_Page/Navbar/Navbar";
import SecondNavbar from "../../Shopping_Page/Navbar/SecondNavbar";

export default function AuthContainer() {
  const [key, setKey] = useState("login"); 

  return (
    <>
      <Navbar />
      <SecondNavbar />
      <hr />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Tabs
              id="auth-tabs"
              activeKey={key}
              onSelect={(k) => k && setKey(k)}
              className="mb-3"
              fill
            >
              <Tab eventKey="register" title="REGISTER">
                <Register onSwitch={() => setKey("login")} />
              </Tab>
              <Tab eventKey="login" title="LOGIN">
                <Login onSwitch={() => setKey("register")} />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
}
