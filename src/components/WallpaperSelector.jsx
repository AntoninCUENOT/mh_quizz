// import React, { useEffect, useState } from 'react';

// const WallpaperSelector = () => {
//     const [images, setImages] = useState([]);
//     const [selectedImage, setSelectedImage] = useState('');

//     useEffect(() => {
//         fetch('http://localhost:8002/api/list_wallpaper.php')
//             .then(response => response.json())
//             .then(data => {
//                 setImages(data.images);
//                 if (data.activeImage) {
//                     setSelectedImage(data.activeImage.path);
//                     document.body.style.backgroundImage = `url(${data.activeImage.path})`;
//                 }
//             })
//             .catch(error => console.error('Error fetching images:', error));
//     }, []);

//     const handleImageSelect = (image) => {
//         setSelectedImage(image.path);
//         document.body.style.backgroundImage = `url(${image.path})`;

//         fetch('http://localhost:8002/api/update_active_wallpaper.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ id: image.id }),
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === 'success') {
//                 alert('Background updated successfully!');
//             } else {
//                 alert('Failed to update background: ' + data.message);
//             }
//         })
//         .catch(error => console.error('Error updating background:', error));
//     };

//     const handleImageDelete = (id) => {
//         fetch('http://localhost:8002/api/delete_wallpaper.php', {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ id }),
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === 'success') {
//                 setImages(images.filter(image => image.id !== id));
//                 alert('Image deleted successfully!');
//             } else {
//                 alert('Failed to delete image: ' + data.message);
//             }
//         })
//         .catch(error => console.error('Error deleting image:', error));
//     };
    
//     return (
//         <div>
//             {images.map((image) => (
//                 <div key={image.id} style={{display:'inline-block', width: '30vw', position:'relative', textAlign: 'center', margin:'1rem'}}>
//                     <img
//                         src={image.path}
//                         alt={`wallpaper ${image.id}`}
//                         style={{ width: '30vw', objectFit:'cover', cursor: 'pointer', boxShadow:'10px 10px 15px black' }}
//                         onClick={() => handleImageSelect(image)}
//                     />
//                     <button style={{position:'absolute', right:'2px', top:'2px', fontSize:'25px'}} onClick={() => handleImageDelete(image.id)}>X</button>
//                 </div>
//             ))}
//         </div>  
//     );
// };

// export default WallpaperSelector;
