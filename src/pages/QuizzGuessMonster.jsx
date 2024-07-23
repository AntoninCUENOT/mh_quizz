import { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation';
import MonsterInput from '../components/MonsterInput';
import Response from '../components/Response';

const QuizzGuessMonster = () => {
    const [responseMessages, setResponseMessages] = useState([]);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
    const [isAnswer, setIsAnswer] = useState(false);

    useEffect(() => {
        // Obtenir la date et l'heure actuelles en UTC
        const now = new Date();
        const currentUTCDate = now.toISOString().split('T')[0]; // Format YYYY-MM-DD
        const currentUTCHour = now.getUTCHours();
        const localOffset = now.getTimezoneOffset() / 60; // Décalage en heures par rapport à UTC
        const localHour = (currentUTCHour - localOffset + 24) % 24; // Heure locale ajustée pour UTC
    
        // Définir l'heure locale de nettoyage (1h du matin dans le fuseau horaire local)
        const cleanupHourLocal = 1; // 1h du matin dans le fuseau horaire local
    
        // Récupérer la dernière date et heure de nettoyage du localStorage
        const lastCleanupDate = localStorage.getItem('lastCleanupDate');
    
        if (lastCleanupDate) {
            const lastCleanup = new Date(lastCleanupDate);
            const lastCleanupUTCDate = lastCleanup.toISOString().split('T')[0];
    
            // Nettoyer uniquement si l'heure locale est 1h et la date du dernier nettoyage est différente de la date actuelle
            if (localHour === cleanupHourLocal && currentUTCDate !== lastCleanupUTCDate) {
                // Effectuer le nettoyage
                localStorage.removeItem('suggestions');
                localStorage.removeItem('submittedProposals');
                localStorage.removeItem('correctAnswer');
                localStorage.removeItem('answer');
    
                // Mettre à jour la date et l'heure du dernier nettoyage
                localStorage.setItem('lastCleanupDate', now.toISOString());
            }
        } else {
            // Si aucune date de nettoyage précédente, enregistrer la date actuelle
            localStorage.setItem('lastCleanupDate', now.toISOString());
        }
    }, []);
    
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
