import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [userInput, setUserInput] = useState('');
    const [responseMessages, setResponseMessages] = useState([]);

    // Au chargement initial, récupérer les propositions stockées dans le localStorage
    useEffect(() => {
        const storedProposals = JSON.parse(localStorage.getItem('submittedProposals'));
        if (storedProposals) {
            setResponseMessages(storedProposals);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('submittedProposals', JSON.stringify(responseMessages));
    }, [responseMessages]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.get(`http://localhost:8002/api/monsters.php?name=${userInput}`);
            const data = response.data;

            // Ajouter la nouvelle réponse au tableau de toutes les réponses
            const updatedResponses = [data, ...responseMessages];
            setResponseMessages(updatedResponses);
            // Réinitialiser le champ de saisie
            setUserInput('');
        } catch (error) {
            console.error('Error submitting guess:', error);
        }
    };

    const handleReset = () => {
        setUserInput('');
        setResponseMessages([]);
        localStorage.removeItem('submittedProposals');
    };

    return (
        <div className="home-container">
            <button onClick={handleReset}>Réinitialiser</button>
            <h1>TROUVE LE MONSTRE</h1>
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Devinez le nom du monstre..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
            </form>

            {responseMessages.length > 0 && (
                <div className="all-responses">
                    {responseMessages.map((response, index) => (
                        <div key={index} className={`result ${response.all_correct ? 'correct' : 'incorrect'}`}>
                            {response.all_correct && (
                                <p>Bonne réponse ! Vous avez trouvé le monstre correctement.</p>
                            )}
                            <div className='reponse'>
                                <p className={response.user_monster.name.class}><span>{response.user_monster.name.value}</span></p>
                                <p className={response.user_monster.type.class}><span>{response.user_monster.type.value}</span></p>
                                <p className={response.user_monster.color.class}><span>{response.user_monster.color.value}</span></p>
                                {response.user_monster.maps.map((map, idx) => (
                                    <p key={idx} className={map.class}><span>{map.value}</span></p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
