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

        fetch('http://localhost:8002/api/Wallpaper.php', {
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
                location.reload();
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
        <div style={{textAlign:'center', marginTop:'5vh'}}>
            <input style={{background:'black', padding:'1rem', borderRadius:'64px', border:'1px solid white', marginRight:'1rem'}} type="file" onChange={handleFileChange} />
            <button style={{background:'black', padding:'1rem', borderRadius:'64px', border:'1px solid white'}} onClick={handleUpload}>UPLOAD</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadImage;
