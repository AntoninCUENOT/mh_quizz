import React, { useState } from 'react';

const UploadImage = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('wallpaper', file);

        fetch('http://localhost:8002/api/wallpaper.php', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                alert('Upload successful!');
            } else {
                setMessage(data.message); // Set the error message state
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setMessage('Error uploading file. Please try again.');
        });
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadImage;
