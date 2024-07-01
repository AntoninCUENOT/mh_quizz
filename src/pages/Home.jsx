import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [userInput, setUserInput] = useState('');
    const [responseMessages, setResponseMessages] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

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

    const fetchSuggestions = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8002/api/suggestions.php?q=${query}`);
            setSuggestions(response.data);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

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
            setShowSuggestions(false);
        } catch (error) {
            console.error('Error submitting guess:', error);
        }
    };

    const handleReset = () => {
        setUserInput('');
        setResponseMessages([]);
        localStorage.removeItem('submittedProposals');
    };

    const handleChange = (e) => {
        const query = e.target.value;
        setUserInput(query);
        fetchSuggestions(query);
    };

    const handleClick = (e) => {
        setUserInput(e.target.innerText);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) { // Enter key
            setUserInput(suggestions[activeSuggestionIndex]);
            setSuggestions([]);
            setShowSuggestions(false);
        } else if (e.keyCode === 38) { // Up arrow
            if (activeSuggestionIndex > 0) {
                setActiveSuggestionIndex(activeSuggestionIndex - 1);
            }
        } else if (e.keyCode === 40) { // Down arrow
            if (activeSuggestionIndex < suggestions.length - 1) {
                setActiveSuggestionIndex(activeSuggestionIndex + 1);
            }
        }
    };

    const renderSuggestions = () => {
        if (showSuggestions && userInput) {
            if (suggestions.length) {
                return (
                    <ul className="suggestions">
                        {suggestions.map((suggestion, index) => {
                            let className;
                            if (index === activeSuggestionIndex) {
                                className = "suggestion-active";
                            }
                            return (
                                <li className={className} key={suggestion} onClick={handleClick}>
                                    {suggestion}
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                return (
                    <div className="no-suggestions">
                        <em>Aucune suggestion disponible</em>
                    </div>
                );
            }
        }
        return null;
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
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                {renderSuggestions()}
            </form>

            {responseMessages.length > 0 && (
                <div className="all-responses">
                    {responseMessages.map((response, index) => (
                        <div key={index} className={`result ${response.all_correct ? 'correct' : 'incorrect'}`}>
                            {response.all_correct && (
                                <p>Bonne réponse ! Vous avez trouvé le bon monstre.</p>
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
