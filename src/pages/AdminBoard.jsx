import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationAdmin from '../components/NavigationAdmin';

const AdminBoard = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // État pour la recherche
    const [error, setError] = useState('');

    useEffect(() => {
        // Récupérer la liste des utilisateurs
        axios.get('http://localhost:8002/api/get_users.php')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setError('Error fetching users');
            });
    }, []);

    const handleRoleChange = (userId, newRole) => {
        // Mettre à jour le rôle de l'utilisateur
        axios.post('http://localhost:8002/api/update_role.php', { id: userId, role: newRole })
            .then(response => {
                setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
            })
            .catch(error => {
                console.error('Error updating role:', error);
                setError('Error updating role');
            });
    };

    // Filtrer les utilisateurs en fonction de la recherche
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <NavigationAdmin />
            <div style={{textAlign: 'center', marginTop: '15vh'}}>
                <h1>ADMIN BOARD</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Champ de recherche */}
                <input
                    type="text"
                    placeholder="Search users by username or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={searchInputStyle}
                />

                {/* Conteneur avec défilement horizontal */}
                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thTdStyle}>Username</th>
                                <th style={thTdStyle}>Email</th>
                                <th style={thTdStyle}>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td style={thTdStyle}>{user.username}</td>
                                    <td style={thTdStyle}>{user.email}</td>
                                    <td style={thTdStyle}>
                                        <select
                                            style={selectStyle}
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
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

const searchInputStyle = {
    padding: '10px',
    marginBottom: '20px',
    width: '80%',
    maxWidth: '300px',
    borderRadius: '5px',
    border: '1px solid white',
    textAlign: 'center',
    backgroundColor: 'black',
};

const tableContainerStyle = {
    overflowX: 'auto',
    maxWidth: '90%',
    margin: '0 auto',
};

const tableStyle = {
    margin: '20px auto',
    borderCollapse: 'collapse',
    backgroundColor: 'black',
    color: '#fff',
    minWidth: '600px',
    boxShadow: '5px 10px 10px rgba(0, 0, 0, 0.8)',
};

const thTdStyle = {
    border: '1px solid white',
    padding: '10px',
    textAlign: 'center',
};

const selectStyle = {
    backgroundColor: 'black',
    color: 'white',
    border: '1px solid #555',
    padding: '5px',
};

export default AdminBoard;
