import { useState } from 'react';
import axios from 'axios';

const MonsterInput = ({ onSubmit }) => {
    const [userInput, setUserInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [hasSuggestions, setHasSuggestions] = useState(true); // Added state to manage suggestions availability

    const fetchSuggestions = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            setHasSuggestions(false); // No suggestions available
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8002/api/Monsters/Suggestions.php?q=${query}`);
            const filteredSuggestions = response.data.filter(suggestion => {
                const savedSuggestions = JSON.parse(localStorage.getItem('suggestions') || '[]');
                return !savedSuggestions.includes(suggestion);
            });

            setSuggestions(filteredSuggestions);
            setShowSuggestions(true);
            setHasSuggestions(filteredSuggestions.length > 0); // Check if there are any suggestions
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setHasSuggestions(false); // No suggestions available
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (hasSuggestions) { // Check if suggestions are available before submission
            setUserInput(''); // Reset user input after submission
            setShowSuggestions(false); // Hide suggestions after submission
        }
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
        saveSuggestion(suggestion);
        setUserInput('');
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) { // Enter key
            const selectedSuggestion = suggestions[activeSuggestionIndex];
            if (selectedSuggestion) { // Ensure suggestion exists before submitting
                setUserInput(selectedSuggestion);
                setSuggestions([]);
                setShowSuggestions(false);
                saveSuggestion(selectedSuggestion);
                onSubmit(selectedSuggestion); // Appel à onSubmit avec la suggestion choisie
                setUserInput('');
            }
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

    const saveSuggestion = (suggestion) => {
        const savedSuggestions = JSON.parse(localStorage.getItem('suggestions') || '[]');
        if (!savedSuggestions.includes(suggestion)) {
            savedSuggestions.push(suggestion);
            localStorage.setItem('suggestions', JSON.stringify(savedSuggestions));
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
                placeholder="Guess name of monster..."
                value={userInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            {renderSuggestions()}
            <button type="submit" disabled={!hasSuggestions}></button>
        </form>
    );
};

export default MonsterInput;
