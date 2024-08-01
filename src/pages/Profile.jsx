import { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation';

const Profile = () => {
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    const [profile, setProfile] = useState({ username: '', email: '' });
    const [scores, setScores] = useState({ answer: 0, answer_correct: 0, answer_hint: 0 });
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        // Charger le profil depuis le backend lors du chargement initial du composant
        axios.get(`http://localhost:8002/api/Profiles/Profile.php?id=${userId}`)
            .then(response => {
                setProfile(response.data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });

        // Charger la liste des scores depuis le backend
        axios.get(`http://localhost:8002/api/Profiles/Scores.php?id=${userId}`)
            .then(response => {
                setScores(response.data);
            })
            .catch(error => {
                console.error('Error fetching scores:', error);
            });
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Envoyer les données mises à jour au backend
        axios.post(`http://localhost:8002/api/Profiles/UpdateProfile.php`, profile)
            .then(response => {
                console.log('Profile updated:', response.data);
                setIsFormVisible(false);
                setStatusMessage('Profile updated');
            })
            .catch(error => {
                console.error('Error updating profile:', error);
            });
    };

    return (
        <>
            <Navigation />
            <div className='profil' style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
                <div className='hunter-formulaire'>
                    {isFormVisible && (<form className='hunter-score' onSubmit={handleSubmit}>
                        <h2 style={{ textTransform: 'uppercase', textAlign: 'center' }}>{userName}'S PROFILE</h2>
                        <input
                            type="hidden"
                            name="id"
                            style={align}
                            value={profile.id || ''}
                            onChange={handleChange}
                            required
                        />
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            style={align}
                            value={profile.username || ''}
                            onChange={handleChange}
                            required
                        />

                        <label>Email:</label>
                        <input
                            type="text"
                            name="email"
                            style={align}
                            value={profile.email || ''}
                            onChange={handleChange}
                        />

                        <button type="submit">Update Profile</button>
                    </form>
                    )}
                    <h1>{statusMessage}</h1>
                </div>
                <div className='hunter-formulaire'>
                    <div className='hunter-score'>
                        <h2 style={{ textTransform: 'uppercase', textAlign: 'center' }}>{userName}'S SCORES</h2>
                        <label>Total Answer</label>
                        <p style={align}>{scores.answer}</p>
                        <label>Correct Answer</label>
                        <p style={align}>{scores.answer_correct}</p>
                        <label>With Hint</label>
                        <p style={align}>{scores.answer_hint}</p>
                    </div>
                </div>
            </div>
        </>
    );
};
const align = {
    textAlign: 'center'
}

export default Profile;
