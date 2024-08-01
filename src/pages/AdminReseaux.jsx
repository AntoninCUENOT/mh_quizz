import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationAdmin from '../components/NavigationAdmin';

const AdminReseaux = () => {
    const [reseaux, setReseaux] = useState([]);
    const [nom, setNom] = useState('');
    const [url, setUrl] = useState('');
    const [icon, setIcon] = useState(null);

    useEffect(() => {
        fetchReseaux();
    }, []);

    const fetchReseaux = async () => {
        try {
            const response = await axios.get('http://localhost:8002/api/Networks/Reseaux.php');
            setReseaux(response.data);
        } catch (error) {
            console.error('Error fetching reseaux:', error);
        }
    };

    const handleAddReseau = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('url', url);
        if (icon) {
            formData.append('icon', icon);
        }

        try {
            await axios.post('http://localhost:8002/api/Networks/AddReseau.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Recharger les réseaux après ajout
            fetchReseaux();
            setNom('');
            setUrl('');
            setIcon(null);
        } catch (error) {
            console.error('Error adding reseau:', error);
        }
    };

    const handleDeleteReseau = async (id) => {
        try {
            await axios.post('http://localhost:8002/api/Networks/DeleteReseau.php', { id });
            // Recharger les réseaux après suppression
            fetchReseaux();
        } catch (error) {
            console.error('Error deleting reseau:', error);
        }
    };

    return (
        <>
            <NavigationAdmin />
            <div className="board" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <form onSubmit={handleAddReseau} className="admin-reseaux" style={{marginTop: '0'}}>
                    <h2 style={{textAlign: 'center'}}>ADMIN SOCIAL NETWORK</h2>
                    <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        placeholder="Nom"
                        required
                    />
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="URL"
                        required
                    />
                    <input
                        style={{
                            background: 'black',
                            padding: '1rem',
                            borderRadius: '64px',
                            border: '1px solid white',
                            marginRight: '1rem',
                        }}
                        type="file"
                        onChange={(e) => setIcon(e.target.files[0])}
                    />
                    <button type="submit">Ajouter</button>
                </form>
                <div className='network-array' style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thTdStyle}>Logo</th>
                                <th style={thTdStyle}>Nom</th>
                                <th style={urlThTdStyle}>URL</th>
                                <th style={thTdStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reseaux.map((reseau) => (
                                <tr key={reseau.id}>
                                    <td style={thTdStyle}>
                                        <img
                                            src={reseau.icon}
                                            alt={reseau.nom}
                                            style={imgStyle}
                                        />
                                    </td>
                                    <td style={thTdStyle}>{reseau.nom}</td>
                                    <td style={urlTdStyle}>
                                        {reseau.url}
                                    </td>
                                    <td style={thTdStyle}>
                                        <button
                                            onClick={() => handleDeleteReseau(reseau.id)}
                                            style={buttonStyle}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

const tableContainerStyle = {
    textAlign: 'center',
};

const tableStyle = {
    margin: '20px auto',
    borderCollapse: 'collapse',
    backgroundColor: 'black',
    color: '#fff',
    boxShadow: '5px 10px 10px rgba(0, 0, 0, 0.8)',
    width: '100%',
};

const thTdStyle = {
    border: '1px solid white',
    padding: '5px',
    textAlign: 'center',
};

const urlThTdStyle = {
    ...thTdStyle,
    width: '20%',
};

const urlTdStyle = {
    ...thTdStyle,
    maxWidth: '80px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};

const imgStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
};

const buttonStyle = {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default AdminReseaux;
