import { useRef } from 'react';
import Col from 'react-bootstrap/Col';

import Picture from './cathethiya.jpg';
import Try from './try.jpg';

const images = [
    Picture,
    Try,
    Try, 
];

function ImagePreview() {
    const imageRefs = useRef([]);

    const handleClick = (idx) => {
        if (imageRefs.current[idx]) {
            imageRefs.current[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <>
            <Col xs={1} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', 
                position: 'sticky', top: '20px', zIndex: 2, alignSelf: 'flex-start' }}>
                {images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Preview ${idx}`} style={{ maxWidth: '80px', marginBottom: '10px', 
                        cursor: 'pointer', border: '2px solid transparent', maxHeight: '80px', background: '#fff' }} onClick={() => handleClick(idx)} />
                ))}
            </Col>
            <Col xs={5} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', 
                alignContent: 'center' }}>
                {images.map((img, idx) => (
                    <div key={idx}>
                        <img ref={el => imageRefs.current[idx] = el} src={img} alt={`Big preview ${idx}`}
                            style={{ maxWidth: '500px', maxHeight: '500px', objectFit: 'contain', display: 'block' }}
                        />
                    </div>
                ))}
            </Col>
        </>
    );
}

export default ImagePreview;