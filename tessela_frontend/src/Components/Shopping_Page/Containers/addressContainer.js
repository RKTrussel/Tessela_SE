import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";

import Navbar from "../Navbar/Navbar";
import SecondNavbar from "../Navbar/SecondNavbar";
import AddressManagement from "../Home_Address/addressManagement";
import ProfileManagement from "../Home_Address/profileManagement";

export default function AccountContainer() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <>  
        <Navbar />
        <SecondNavbar />
        <Container className="mt-4">
            <Row>
                {/* Sidebar */}
                <Col md={3}>
                <ListGroup>
                    <ListGroup.Item
                    action
                    active={activeTab === "profile"}
                    onClick={() => setActiveTab("profile")}
                    >
                    Profile
                    </ListGroup.Item>
                    <ListGroup.Item
                    action
                    active={activeTab === "addresses"}
                    onClick={() => setActiveTab("addresses")}
                    >
                    Addresses
                    </ListGroup.Item>
                </ListGroup>
                </Col>

                {/* Content Area */}
                <Col md={9}>
                {activeTab === "profile" && <ProfileManagement />}
                {activeTab === "addresses" && <AddressManagement />}
                </Col>
            </Row>
        </Container>
    </>
  );
}
