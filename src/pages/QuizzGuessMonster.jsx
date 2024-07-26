import { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation';
import MonsterInput from '../components/MonsterInput';
import Response from '../components/Response';

const QuizzGuessMonster = () => {
    const [responseMessages, setResponseMessages] = useState([]);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
    const [isAnswer, setIsAnswer] = useState(false);
    const [dataSaved, setDataSaved] = useState(false);
    const [shouldUpdateScore, setShouldUpdateScore] = useState(false);
    
    // Gestion du nettoyage du localStorage
    useEffect(() => {
        const now = new Date();
        const currentUTCDate = now.toISOString().split('T')[0]; // Format YYYY-MM-DD
        const currentUTCHour = now.getUTCHours();
        const localOffset = now.getTimezoneOffset() / 60; // Décalage en heures par rapport à UTC
        const localHour = (currentUTCHour - localOffset + 24) % 24; // Heure locale ajustée pour UTC
        const cleanupHourLocal = 1; 
    
        const lastCleanupDate = localStorage.getItem('lastCleanupDate');
    
        if (lastCleanupDate) {
            const lastCleanup = new Date(lastCleanupDate);
            const lastCleanupUTCDate = lastCleanup.toISOString().split('T')[0];
    
            if (localHour === cleanupHourLocal && currentUTCDate !== lastCleanupUTCDate) {
                localStorage.removeItem('suggestions');
                localStorage.removeItem('submittedProposals');
                localStorage.removeItem('correctAnswer');
                localStorage.removeItem('answer');
                localStorage.setItem('lastCleanupDate', now.toISOString());
            }
        } else {
            localStorage.setItem('lastCleanupDate', now.toISOString());
        }
    }, []);
    
    // Chargement des propositions stockées au chargement initial
    useEffect(() => {
        const storedProposals = JSON.parse(localStorage.getItem('submittedProposals')) || [];
        const storedCorrectAnswer = JSON.parse(localStorage.getItem('correctAnswer')) || false;
        const storedAnswer = JSON.parse(localStorage.getItem('answer')) || false;
        
        setResponseMessages(storedProposals);
        setIsCorrectAnswer(storedCorrectAnswer);
        setIsAnswer(storedAnswer);
    }, []);

    // Sauvegarde dans le localStorage à chaque changement de responseMessages
    useEffect(() => {
        if (responseMessages.length > 0 || isCorrectAnswer || isAnswer) {
            localStorage.setItem('submittedProposals', JSON.stringify(responseMessages));
            localStorage.setItem('correctAnswer', JSON.stringify(isCorrectAnswer));
            localStorage.setItem('answer', JSON.stringify(isAnswer));
            setDataSaved(true);
            setShouldUpdateScore(true); // Déclenche la mise à jour du score après sauvegarde
        }
    }, [responseMessages, isCorrectAnswer, isAnswer]);

    // Mise à jour du score lorsque shouldUpdateScore est vrai
    useEffect(() => {
        if (shouldUpdateScore) {
            const updateScore = async () => {
                try {
                    const userId = localStorage.getItem('userId');
                    const correctAnswerStr = localStorage.getItem('correctAnswer');
                    const hintUsedStr = localStorage.getItem('hint_used');
        
                    // Conversion des chaînes en entiers
                    const correct = correctAnswerStr === 'true' ? 1 : 0;
                    const hintUsed = hintUsedStr === 'true' ? 1 : 0;
        
                    console.log('Updating score with:', { userId, correct, hintUsed });
        
                    await axios.post('http://localhost:8002/api/update_score.php', {
                        userId,
                        correct,
                        hintUsed
                    });
        
                    console.log('Score updated successfully');
                } catch (error) {
                    console.error('Error updating score:', error.response ? error.response.data : error.message);
                }
            };
            updateScore();
            setShouldUpdateScore(false); // Réinitialiser l'état après la mise à jour
        }
    }, [shouldUpdateScore]);

    const handleSubmit = async (userInput) => {
        const userId = localStorage.getItem('userId');
        const hintUsed = localStorage.getItem('hint_used') === 'true' ? 1 : 0;

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
        localStorage.removeItem('suggestions');
        localStorage.removeItem('answer');
        setDataSaved(false); // Réinitialiser l'état de sauvegarde
        setShouldUpdateScore(false); // Réinitialiser l'état de mise à jour du score
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
