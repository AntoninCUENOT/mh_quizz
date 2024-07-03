import React from 'react';
import MonsterForm from '../components/MonsterForm'; // Importez votre formulaire de création de monstre
import '../assets/styles/style.scss';
import Navigation from '../components/Navigation';

const AdminMonster = () => {
    return (
        <>
            <Navigation />
            <h1>Admin Monster Page</h1>
            <MonsterForm /> {/* Incluez votre formulaire de création de monstre */}
        </>
    );
};

export default AdminMonster;
