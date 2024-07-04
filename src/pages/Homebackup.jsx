import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation';

const Home = () => {
    const [userInput, setUserInput] = useState('');
    const [responseMessages, setResponseMessages] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
    const [isAnswer, setIsAnswer] = useState(false);

    // Au chargement initial, récupérer les propositions stockées dans le localStorage
    useEffect(() => {
        const storedProposals = JSON.parse(localStorage.getItem('submittedProposals'));
        const storedCorrectAnswer = JSON.parse(localStorage.getItem('correctAnswer'));
        const storedAnswer = JSON.parse(localStorage.getItem('answer'));
        if (storedProposals) {
            setResponseMessages(storedProposals);
            setIsCorrectAnswer(storedCorrectAnswer);
            setIsAnswer(storedAnswer);
        }
    }, []);

    // Sauvegarder dans le localStorage à chaque changement de responseMessages
    useEffect(() => {
        if (responseMessages.length > 0) {
            localStorage.setItem('submittedProposals', JSON.stringify(responseMessages));
            localStorage.setItem('correctAnswer',JSON.stringify(isCorrectAnswer));
            localStorage.setItem('answer',JSON.stringify(isAnswer));
        }
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

            // Vérifier la structure des données reçues
            if (!isValidMonsterData(data)) {
                console.error('Invalid monster data:', data);
                return;
            }

            // Ajouter la nouvelle réponse au tableau de toutes les réponses
            const updatedResponses = [data, ...responseMessages];
            setResponseMessages(updatedResponses);

            // Vérifier si la réponse est correcte et mettre à jour la variable d'état
            if (data.all_correct) {
                setIsCorrectAnswer(true);
            }
            setIsAnswer(true);
            // Réinitialiser le champ de saisie
            setUserInput('');
            setShowSuggestions(false);
        } catch (error) {
            console.error('Error submitting guess:', error);
        }
    };

    // Vérifier si les données du monstre sont valides
    const isValidMonsterData = (data) => {
        return (
            data &&
            data.correct_guess !== undefined &&
            data.all_correct !== undefined &&
            data.user_monster &&
            data.correct_monster
        );
    };

    const handleReset = () => {
        setUserInput('');
        setResponseMessages([]);
        setIsCorrectAnswer(false); // Réinitialiser la variable d'état
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
        <>
            <Navigation />
            <button onClick={handleReset}>Réinitialiser</button>
            <div className="home-container">
                {!isCorrectAnswer && (
                    <>
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
                    </>
                )}
                {isAnswer && (
                <div className='reponse'>
                    <p><span>LOGO</span></p>
                    <p><span>MONSTRE</span></p>
                    <p><span>ESPECE</span></p>
                    <p><span>COULEUR</span></p>
                    <p><span>MAP 1</span></p>
                    <p><span>MAP 2</span></p>
                    <p><span>MAP 3</span></p>
                    <p><span>TAILLE MIN</span></p>
                    <p><span>TAILLE MAX</span></p>
                </div>
                )}
                {responseMessages.length > 0 && (
                    <div className="all-responses">
                        {responseMessages.map((response, index) => (
                            <div key={index} className={`result ${response.all_correct ? 'correct' : 'incorrect'}`}>
                                {response.all_correct && (
                                    <div className='correct-monster'>
                                        <h2 className='bravo'>BRAVO!!!<br />
                                            <img src={response.user_monster.image_path.value} alt={response.user_monster.name.value} />{response.user_monster.name.value}<br></br>
                                            {response.user_monster.description.value}
                                        </h2>
                                    </div>
                                )}
                                <div className='reponse'>
                                    <img src={response.user_monster.image_path.value} alt={response.user_monster.name.value} />
                                    <p className={response.user_monster.name.class}><span>{response.user_monster.name.value}</span></p>
                                    <p className={response.user_monster.type.class}><span>{response.user_monster.type.value}</span></p>
                                    <p className={response.user_monster.color.class}><span>{response.user_monster.color.value}</span></p>
                                    {response.user_monster.maps.slice(0, 3).map((map, idx) => (
                                        <p key={idx} className={map.class}><span>{map.value}</span></p>
                                    ))}
                                    <p className={response.user_monster.size_min.class}>
                                        <span className='arrow'>{response.user_monster.size_min.arrow}</span><span>{response.user_monster.size_min.value}<br></br>Cm</span><span className='arrow'>{response.user_monster.size_min.arrow}</span>
                                    </p>
                                    <p className={response.user_monster.size_max.class}>
                                        <span className='arrow'>{response.user_monster.size_max.arrow}</span><span>{response.user_monster.size_max.value}<br></br>cm</span><span className='arrow'>{response.user_monster.size_max.arrow}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
