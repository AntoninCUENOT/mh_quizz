import React, { useState } from 'react';
import axios from 'axios';

const MonsterInput = ({ onSubmit }) => {
    const [userInput, setUserInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(userInput);
        setUserInput(''); // Reset user input after submission
        setShowSuggestions(false); // Hide suggestions after submission
    };

    const handleChange = (e) => {
        const query = e.target.value;
        setUserInput(query);
        fetchSuggestions(query);
    };

    const handleClick = (e) => {
        const suggestion = e.target.innerText;
        setUserInput(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
        onSubmit(suggestion); // Appel à onSubmit avec la suggestion choisie
        setUserInput('');
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
    );
};

export default MonsterInput;
