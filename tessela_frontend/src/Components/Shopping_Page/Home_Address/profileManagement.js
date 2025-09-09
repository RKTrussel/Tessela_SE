import { useEffect, useState } from "react";
import api from "../../../api";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

export default function ProfileManagement() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/me")
      .then(res => setAccount(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <Card>
      <Card.Header>My Profile</Card.Header>
      <Card.Body>
        <p><strong>Name:</strong> {account?.name}</p>
        <p><strong>Email:</strong> {account?.email}</p>
        <p><strong>Gender:</strong> {account?.gender}</p>
        <p><strong>Birthday:</strong>{" "}
          {account?.birthday
            ? new Date(account.birthday).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "—"}
        </p>
      </Card.Body>
    </Card>
  );
}
