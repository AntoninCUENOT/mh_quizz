import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MonsterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        type_id: '',
        color: '',
        size_min: '',
        size_max: '',
        description: '',
        image: null,
        sound: null,
        theme: null,
    });

    const [maps, setMaps] = useState([]);
    const [selectedMaps, setSelectedMaps] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        // Charger la liste des maps depuis le backend lors du chargement initial du composant
        axios.get('http://localhost:8002/api/maps.php')
            .then(response => {
                setMaps(response.data);
            })
            .catch(error => {
                console.error('Error fetching maps:', error);
            });

        // Charger la liste des types depuis le backend
        axios.get('http://localhost:8002/api/types.php')
            .then(response => {
                setTypes(response.data);
            })
            .catch(error => {
                console.error('Error fetching types:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMapSelection = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedMaps([...selectedMaps, value]);
        } else {
            setSelectedMaps(selectedMaps.filter(mapId => mapId !== value));
        }
    };

    const handleFileUpload = (e, fileType) => {
        const file = e.target.files[0];
        setFormData({ ...formData, [fileType]: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = new FormData();
        postData.append('name', formData.name);
        postData.append('type_id', formData.type_id);
        postData.append('color', formData.color);
        postData.append('size_min', formData.size_min);
        postData.append('size_max', formData.size_max);
        postData.append('description', formData.description);
        if (formData.image) {
            postData.append('image', formData.image);
        }
        if (formData.sound) {
            postData.append('sound', formData.sound);
        }
        if (formData.theme) {
            postData.append('theme', formData.theme);
        }
        postData.append('maps', JSON.stringify(selectedMaps));

        try {
            const response = await axios.post('http://localhost:8002/api/create_monster.php', postData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Monster created successfully:', response.data);
            // Réinitialiser le formulaire ou afficher un message de succès
            setFormData({
                name: '',
                type_id: '',
                color: '',
                size_min: '',
                size_max: '',
                description: '',
                image: null,
                sound: null,
                theme: null,
            });
            setSelectedMaps([]);
        } catch (error) {
            console.error('Error creating monster:', error);
            // Gérer les erreurs
        }
    };

    return (
        <div>
            <h2>Create Monster</h2>
            <form onSubmit={handleSubmit} className='monster-form'>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                
                <label>Type:</label>
                <select name="type_id" value={formData.type_id} onChange={handleInputChange}>
                    <option value="">Select a type</option>
                    {types.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                </select>
                
                <label>Color:</label>
                <input type="text" name="color" value={formData.color} onChange={handleInputChange} />

                <label>Size (cm) minimum:</label>
                <input type="number" name="size_min" value={formData.size_min} onChange={handleInputChange} />

                <label>Size (cm) maximum:</label>
                <input type="number" name="size_max" value={formData.size_max} onChange={handleInputChange} />
                
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>
                
                <label>Image:</label>
                <input type="file" name="image" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                
                <label>Sound:</label>
                <input type="file" name="sound" accept=".mp3" onChange={(e) => handleFileUpload(e, 'sound')} />
                
                <label>Theme:</label>
                <input type="file" name="theme" accept=".mp3" onChange={(e) => handleFileUpload(e, 'theme')} />
                
                <label>Maps:</label>
                <div className="maps-container">
                    {maps.map(map => (
                        <div key={map.id} className="map-item">
                            <input
                                type="checkbox"
                                id={`map-${map.id}`}
                                name={`map-${map.id}`}
                                value={map.id}
                                checked={selectedMaps.includes(map.id.toString())}
                                onChange={handleMapSelection}
                            />
                            <label htmlFor={`map-${map.id}`} >{map.name}</label>
                        </div>
                    ))}
                </div>

                <button type="submit">Create Monster</button>
            </form>
        </div>
    );
};

export default MonsterForm;
