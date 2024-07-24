import { useEffect, useState } from 'react';
import axios from 'axios';

const Response = ({ responseMessages }) => {
    const [incorrectAttempts, setIncorrectAttempts] = useState(0);
    const [hints, setHints] = useState([]);

    useEffect(() => {
        const elements = document.querySelectorAll('.result img, .result p');

        // Vérifier si la page a été rechargée
        const isPageReloaded = sessionStorage.getItem('isPageReloaded') === 'true';

        // Vérifier si une réponse est correcte
        const hasCorrectResponse = responseMessages.some(response => response.all_correct);

        // Définir la limite en fonction des conditions
        let limit;
        if (isPageReloaded) {
            limit = elements.length; // Animer tous les éléments si la page est rechargée
        } else if (hasCorrectResponse) {
            limit = 10; // Limiter à 10 éléments si la réponse est correcte
        } else {
            limit = 9; // Limiter à 9 éléments par défaut
        }

        elements.forEach((element, index) => {
            if (index < limit) { // Appliquer la limite selon la condition
                element.style.animationDelay = `${index * 0.3}s`;
                element.classList.add('flip-in');
                
                // Ajouter un écouteur d'événement pour supprimer la classe une fois l'animation terminée
                const handleAnimationEnd = () => {
                    element.classList.remove('flip-in');
                    element.removeEventListener('animationend', handleAnimationEnd);
                };
                element.addEventListener('animationend', handleAnimationEnd);
            }
        });

        // Définir un indicateur de rechargement de la page
        const handleBeforeUnload = () => {
            sessionStorage.setItem('isPageReloaded', 'true');
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Nettoyage de l'événement
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [responseMessages]);

    useEffect(() => {
        // Charger la liste des indices depuis le backend lors du chargement initial du composant
        axios.get('http://localhost:8002/api/hint.php')
            .then(response => {
                setHints(response.data);
            })
            .catch(error => {
                console.error('Error fetching hints:', error);
            });
    }, []);

    useEffect(() => {
        // Supprimer l'indicateur de rechargement de la page après le premier rendu
        sessionStorage.removeItem('isPageReloaded');
    }, []);

    useEffect(() => {
        const incorrectResponses = responseMessages.filter(response => !response.all_correct).length;
        setIncorrectAttempts(incorrectResponses);
    }, [responseMessages]);

    // Ajouter les listeners de toucher
    useEffect(() => {
        const container = document.querySelector('.all-responses.horizontal-scroll');
        const handleTouchStart = () => {
            container.classList.add('show-scrollbar');
        };
        const handleTouchEnd = () => {
            container.classList.remove('show-scrollbar');
        };

        if (container) {
            container.addEventListener('touchstart', handleTouchStart);
            container.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (container) {
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchend', handleTouchEnd);
                container.classList.remove('show-scrollbar');
            }
        };
    }, []);

    return (
        <>
            <div className="hints">
                {incorrectAttempts >= 5 ? (
                    hints.length > 0 ? (
                        hints.map((hint, index) => (
                            <div key={index} className="hint-item">
                                <details>
                                    <summary><span className="summary-content">INDICE</span></summary>
                                    <p>THEME</p>
                                    <audio controls>
                                        <source src={hint.theme_path} type="audio/mp3" />
                                        Your browser does not support the audio element
                                    </audio>
                                </details>
                            </div>
                        ))
                    ) : (
                        <p>Aucun indice disponible pour le moment</p>
                    )
                ) : (
                    <p className='tentative'>Vous avez {5 - incorrectAttempts} tentatives incorrectes restantes avant de recevoir un indice</p>
                )}
            </div>

            <div className="all-responses horizontal-scroll">
                <div className='reponse'>
                    <p className='high-array'><span>LOGO</span></p>
                    <p className='high-array'><span>MONSTRE</span></p>
                    <p className='high-array'><span>ESPECE</span></p>
                    <p className='high-array'><span>COULEUR</span></p>
                    <p className='high-array'><span>MAP 1</span></p>
                    <p className='high-array'><span>MAP 2</span></p>
                    <p className='high-array'><span>MAP 3</span></p>
                    <p className='high-array'><span>TAILLE MIN</span></p>
                    <p className='high-array'><span>TAILLE MAX</span></p>
                </div>
                {responseMessages.map((response, index) => (
                    <div key={index} className={`result ${response.all_correct ? 'correct' : 'incorrect'}`}>
                        {response.all_correct && (
                            <div className='correct-monster'>
                                <h2 className='bravo'>BRAVO!!!<br />
                                    <img src={response.user_monster.image_path.value} alt={response.user_monster.name.value} /><br></br>{response.user_monster.name.value}<br></br>
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
        </>
    );
};

export default Response;
