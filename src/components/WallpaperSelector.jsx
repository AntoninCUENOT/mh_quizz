import React, { useEffect, useState } from 'react';

const WallpaperSelector = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8002/api/list_wallpaper.php')
            .then(response => response.json())
            .then(data => setImages(data))
            .catch(error => console.error('Error fetching images:', error));
    }, []);

    const handleImageSelect = (imagePath) => {
        setSelectedImage(imagePath);
        document.body.style.backgroundImage = `url(${imagePath.path})`; // Use imagePath.path instead of just imagePath
    };

    return (
        <div>
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image.path}
                    alt={`wallpaper ${index}`}
                    style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                    onClick={() => handleImageSelect(image)}
                />
            ))}
        </div>
    );
};

export default WallpaperSelector;
