import { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation';
import MonsterInput from '../components/MonsterInput';
import Response from '../components/Response';

const QuizzGuessMonster = () => {
    const [responseMessages, setResponseMessages] = useState([]);
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
    }, [responseMessages, isCorrectAnswer, isAnswer]);

    const handleSubmit = async (userInput) => {
        try {
            const response = await axios.get(`http://localhost:8002/api/monsters.php?name=${userInput}`);
            const data = response.data;

            if (!isValidMonsterData(data)) {
                console.error('Invalid monster data:', data);
                return;
            }

            const updatedResponses = [data, ...responseMessages];
            setResponseMessages(updatedResponses);

            if (data.all_correct) {
                setIsCorrectAnswer(true);
            }
            setIsAnswer(true);
        } catch (error) {
            console.error('Error submitting guess:', error);
        }
    };

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
        setResponseMessages([]);
        setIsCorrectAnswer(false);
        setIsAnswer(false);
        localStorage.removeItem('submittedProposals');
        localStorage.removeItem('correctAnswer');
        localStorage.removeItem('answer');
    };

    return (
        <>
            <Navigation />
            <button onClick={handleReset}>Réinitialiser</button>
            <div className="home-container">
                {!isCorrectAnswer && (
                    <>
                        <h1>TROUVE LE MONSTRE</h1>
                        <MonsterInput onSubmit={handleSubmit} />
                    </>
                )}
                {isAnswer && <Response responseMessages={responseMessages} />}
            </div>
        </>
    );
};

export default QuizzGuessMonster;
