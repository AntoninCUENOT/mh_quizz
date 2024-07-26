import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationAdmin from '../components/NavigationAdmin';

const AdminBoard = () => {
    const [users, setUsers] = useState([]);
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

    return (
        <>
            <NavigationAdmin />
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>ADMIN BOARD</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thTdStyle}>Username</th>
                            <th style={thTdStyle}>Email</th>
                            <th style={thTdStyle}>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
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
        </>
    );
};

const tableStyle = {
    margin: '20px auto',
    borderCollapse: 'collapse',
    backgroundColor: 'black',
    color: '#fff',
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
