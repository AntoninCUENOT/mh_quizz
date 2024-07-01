import React from 'react';
import MonsterForm from '../components/MonsterForm'; // Importez votre formulaire de création de monstre
import '../assets/styles/style.scss';

const AdminMonster = () => {
    return (
        <div>
            <h1>Admin Monster Page</h1>
            <MonsterForm /> {/* Incluez votre formulaire de création de monstre */}
        </div>
    );
};

export default AdminMonster;
