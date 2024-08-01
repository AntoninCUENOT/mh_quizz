import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MonsterForm = ({ monsterId, onSubmit, isEditMode }) => {
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Charger la liste des types et des maps
        axios.get('http://localhost:8002/api/Monsters/Maps.php')
            .then(response => {
                setMaps(response.data);
            })
            .catch(error => {
                console.error('Error fetching maps:', error);
                setError('Error fetching maps');
            });

        axios.get('http://localhost:8002/api/Monsters/Types.php')
            .then(response => {
                setTypes(response.data);
            })
            .catch(error => {
                console.error('Error fetching types:', error);
                setError('Error fetching types');
            });

        // Charger les données du monstre si nous sommes en mode édition
        if (monsterId) {
            axios.get(`http://localhost:8002/api/Monsters/GetMonsters.php?monsterId=${monsterId}`)
                .then(response => {
                    const monster = response.data;
                    setFormData({
                        name: monster.name || '',
                        type_id: monster.type_id || '',
                        color: monster.color || '',
                        size_min: monster.size_min || '',
                        size_max: monster.size_max || '',
                        description: monster.description || '',
                        image: null,
                        sound: null,
                        theme: null,
                    });
                    setSelectedMaps(monster.maps || []);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching monster:', error);
                    setError('Error fetching monster');
                });
        } else {
            setLoading(false);
        }
    }, [monsterId]);

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
            const url = isEditMode ? `http://localhost:8002/api/Monsters/UpdateMonster.php?id=${monsterId}` : 'http://localhost:8002/api/Monsters/CreateMonster.php';
            const response = await axios.post(url, postData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Monster ' + (isEditMode ? 'updated' : 'created') + ' successfully:', response.data);
            if (onSubmit) onSubmit();  // Callback pour signaler la soumission réussie
        } catch (error) {
            console.error('Error ' + (isEditMode ? 'updating' : 'creating') + ' monster:', error);
            // Gérer les erreurs
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='monster-formulaire'>
            <form onSubmit={handleSubmit} className='monster-form'>
                <h2>{isEditMode ? 'Edit Monster' : 'Create Monster'}</h2>
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
                            <label htmlFor={`map-${map.id}`}>{map.name}</label>
                        </div>
                    ))}
                </div>

                <button type="submit">{isEditMode ? 'Update Monster' : 'Create Monster'}</button>
            </form>
        </div>
    );
};

export default MonsterForm;
