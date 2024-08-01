import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationAdmin from '../components/NavigationAdmin';
import { NavLink } from 'react-router-dom';

const AdminListMonster = () => {
    const [monsters, setMonsters] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Récupérer les types
        axios.get('http://localhost:8002/api/Monsters/GetMonsters.php?type=types')
            .then(response => {
                setTypes(response.data);
            })
            .catch(error => {
                setError('Error fetching types');
                console.error('Error fetching types:', error);
            });
    }, []);

    useEffect(() => {
        // Récupérer les monstres en fonction du type sélectionné
        const url = selectedType ? `http://localhost:8002/api/Monsters/GetMonsters.php?type=${selectedType}` : 'http://localhost:8002/api/Monsters/GetMonsters.php';
        axios.get(url)
            .then(response => {
                setMonsters(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching monsters');
                setLoading(false);
                console.error('Error fetching monsters:', error);
            });
    }, [selectedType]);

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this monster?')) {
            try {
                await axios.delete(`http://localhost:8002/api/Monsters/DeleteMonster.php?id=${id}`);
                setMonsters(monsters.filter(monster => monster.id !== id));
            } catch (error) {
                console.error('Error deleting monster:', error);
                setError('Error deleting monster');
            }
        }
    };

    return (
        <>
            <NavigationAdmin />
            <div style={{ padding: '20px' }}>
                <h1>List of Monsters</h1>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <select value={selectedType} onChange={handleTypeChange} style={{ padding: '10px', fontSize: '16px', background: 'black' }}>
                        <option value="">All Types</option>
                        {types.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                    {monsters.length > 0 ? (
                        monsters.map(monster => (
                            <div key={monster.id} style={{ textAlign: 'center', background: 'black', border: '1px solid white', padding: '1rem', position: 'relative' }}>
                                <NavLink style={{ textDecoration: 'none' }} to={`/admin/edit-monster/${monster.id}`}>
                                    <img
                                        src={monster.image_path}
                                        alt={monster.name}
                                        style={{ width: '150px', height: '150px', objectFit: 'cover', background: 'black' }}
                                    />
                                    <p style={{ textTransform: 'uppercase' }}>{monster.name}</p>
                                </NavLink>
                                <button
                                    onClick={() => handleDelete(monster.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        border: '1px solid white',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        padding: '5px',
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No monsters found</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminListMonster;
