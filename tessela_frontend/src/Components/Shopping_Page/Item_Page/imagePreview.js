import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api';
import Col from 'react-bootstrap/Col';

function ImagePreview() {
    const { id } = useParams();  // Get product ID from URL
    const [images, setImages] = useState([]);
    const imageRefs = useRef([]);

    const handleClick = (idx) => {
        if (imageRefs.current[idx]) {
            imageRefs.current[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    useEffect(() => {
        const fetchProductImages = async () => {
            try {
                const response = await api.get(`/products/${id}`);  // Assuming images are included in the product data
                setImages(response.data.images);  // Extract images from the product data
            } catch (error) {
                console.error('Error fetching product images:', error);
            }
        };

        fetchProductImages();
    }, [id]);  // Refetch images when `id` changes

    return (
        <>
            <Col xs={1} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', 
                position: 'sticky', top: '20px', zIndex: 2, alignSelf: 'flex-start' }}>
                {images.map((img, idx) => (
                    <img key={idx} src={img.url} alt={`Preview ${idx}`} style={{ maxWidth: '80px', marginBottom: '10px', 
                        cursor: 'pointer', border: '2px solid transparent', maxHeight: '80px', background: '#fff' }} onClick={() => handleClick(idx)} />
                ))}
            </Col>
            <Col xs={5} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', 
                alignContent: 'center' }}>
                {images.map((img, idx) => (
                    <div key={idx}>
                        <img ref={el => imageRefs.current[idx] = el} src={img.url} alt={`Big preview ${idx}`}
                            style={{ maxWidth: '500px', maxHeight: '500px', objectFit: 'contain', display: 'block' }}
                        />
                    </div>
                ))}
            </Col>
        </>
    );
}

export default ImagePreview;