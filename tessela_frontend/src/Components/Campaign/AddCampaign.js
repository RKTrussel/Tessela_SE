import { useState } from 'react';
import api from '../../api';
import { Button, Form, Spinner, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddCampaign = () => {
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
  const defaultEnd = thirtyDaysLater.toISOString().split("T")[0];
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    goalAmount: '',
    start_date: today,
    end_date: defaultEnd,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setCampaignData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setCampaignData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(campaignData).forEach(([key, value]) => {
        if (key === "images" && value.length > 0) {
          for (let i = 0; i < value.length; i++) {
            formData.append("images[]", value[i]); // ✅ matches backend
          }
        } else {
          formData.append(key, value);
        }
      });

      await api.post('/campaigns', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/dashboard/myCampaign');
    } catch (error) {
      console.error('Error adding campaign:', error);
      setLoading(false);
    }
  };

  return (
    <Container fluid style={{ maxWidth: '800px'}}>
      <h1 className="my-4">Add New Campaign</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formCampaignName">
          <Form.Label>Campaign Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter campaign name"
            name="name"
            value={campaignData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCampaignDescription">
          <Form.Label>Campaign Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter campaign description"
            name="description"
            value={campaignData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCampaignGoalAmount">
          <Form.Label>Goal Amount (₱)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter campaign goal amount"
            name="goalAmount"
            value={campaignData.goalAmount}
            onChange={handleChange}
            min="1"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCampaignStartDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="start_date"
            value={campaignData.start_date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCampaignEndDate">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="end_date"
            value={campaignData.end_date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCampaignImages">
          <Form.Label>Campaign Images</Form.Label>
          <Form.Control
            type="file"
            name="images"
            accept="image/*"
            multiple       // ✅ allow multiple uploads
            onChange={(e) =>
              setCampaignData((prev) => ({ ...prev, images: e.target.files }))
            }
          />
        </Form.Group>


        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/dashboard/myCampaign')}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : 'Create Campaign'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddCampaign;
