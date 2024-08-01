import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Footer = () => {
    const [reseaux, setReseaux] = useState([]);

    useEffect(() => {
        const fetchReseaux = async () => {
            try {
                const response = await axios.get('http://localhost:8002/api/Networks/Reseaux.php');
                setReseaux(response.data);
            } catch (error) {
                console.error('Error fetching reseaux:', error);
            }
        };

        fetchReseaux();
    }, []);

    return (
        <footer className='footer'>
            <h2>MY SOCIAL NETWORKS</h2>
            <nav>
                {reseaux.map((reseau) => (
                        <a key={reseau.id} href={reseau.url} target="_blank" rel="noopener noreferrer">
                            <img src={reseau.icon} alt={`${reseau.nom} icon`} width="60" height="60" />
                        </a>
                ))}
            </nav>
            <a className='policy' href="/privacy-policy">Privacy Policy</a>
        </footer>
    );
};

export default Footer;
