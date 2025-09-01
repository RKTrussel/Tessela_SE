import { Container, Card, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function BlogHomePage() {


  return (
      <>
        <Container className="panel">
          <p>This is the Blog Site of the Website.</p>
        </Container>

        <Container className='panel'>
            <Row>
                <Col md={4} className='mb-3'>
                  <Card style={{ width: '18rem'}}>
                      <Card.Img variant='top' />
                      <Card.Body>
                          <Card.Title>Title of Blog</Card.Title>
                          <Card.Text>
                            Details of the blog.
                          </Card.Text>
                          <Button variant='primary'>Select This Blog</Button>
                      </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className='mb-3'>
                  <Card style={{ width: '18rem'}}>
                      <Card.Img variant='top' />
                      <Card.Body>
                          <Card.Title>Title of Blog</Card.Title>
                          <Card.Text>
                            Details of the blog.
                          </Card.Text>
                          <Button variant='primary'>Select This Blog</Button>
                      </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className='mb-3'>
                  <Card style={{ width: '18rem'}}>
                      <Card.Img variant='top' />
                      <Card.Body>
                          <Card.Title>Title of Blog</Card.Title>
                          <Card.Text>
                            Details of the blog.
                          </Card.Text>
                          <Button variant='primary'>Select This Blog</Button>
                      </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className='mb-3'>
                  <Card style={{ width: '18rem'}}>
                      <Card.Img variant='top' />
                      <Card.Body>
                          <Card.Title>Title of Blog</Card.Title>
                          <Card.Text>
                            Details of the blog.
                          </Card.Text>
                          <Button variant='primary'>Select This Blog</Button>
                      </Card.Body>
                  </Card>
                </Col>

                <Col md={4} className='mb-3'>
                  <Card style={{ width: '18rem'}}>
                      <Card.Img variant='top' />
                      <Card.Body>
                          <Card.Title>Title of Blog</Card.Title>
                          <Card.Text>
                            Details of the blog.
                          </Card.Text>
                          <Button variant='primary'>Select This Blog</Button>
                      </Card.Body>
                  </Card>
                </Col>
            </Row>
        </Container>

      </>
  )
};

export default BlogHomePage;


              {/*
              * Pseudocode:
              * Image display
              * Title of the Blog
              * The Body of the Blog
              *
              */}